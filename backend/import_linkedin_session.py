import asyncio
import os
import json
import base64
import hashlib
import sqlite3
from playwright.async_api import async_playwright
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from dotenv import load_dotenv

load_dotenv()

# --- CONFIGURATION ---
VAULT_KEY = os.getenv("VAULT_ENCRYPTION_KEY", "dGVzdC12YXVsdC1rZXktZm9yLWNpLTMyYnl0ZXM=")
ACCOUNT_EMAIL = "bipinpanjari@gmail.com"
ACCOUNT_ID = "fb154923-ff11-4743-a417-49be7cf9a43a" # From our previous DB seeding
DB_PATH = "intentgraph.db"
SESSION_DIR = f".playwright-sessions/linkedin/{ACCOUNT_ID}"

def derive_key(raw_key: str) -> bytes:
    try:
        key_material = base64.b64decode(raw_key)
    except Exception:
        key_material = raw_key.encode('utf-8')
    return hashlib.sha256(key_material).digest()

def encrypt_session(data: str, vault_key: bytes) -> str:
    aesgcm = AESGCM(vault_key)
    iv = os.urandom(12)
    ciphertext = aesgcm.encrypt(iv, data.encode('utf-8'), None)
    
    # We store as iv.tag.data to match the backend decrypt logic
    # Note: cryptography's encrypt returns ciphertext + tag appended
    tag = ciphertext[-16:]
    payload = ciphertext[:-16]
    
    return f"{base64.b64encode(iv).decode()}.{base64.b64encode(tag).decode()}.{base64.b64encode(payload).decode()}"

async def capture_session():
    print(f"\n--- LinkedIn Session Capture for {ACCOUNT_EMAIL} ---")
    print("1. A visible browser window will open.")
    print("2. Please log into LinkedIn manually (including 2FA if needed).")
    print("3. Once you see your feed, come back here and press ENTER.\n")
    
    os.makedirs(SESSION_DIR, exist_ok=True)
    
    async with async_playwright() as p:
        # Launch visible browser
        context = await p.chromium.launch_persistent_context(
            user_data_dir=SESSION_DIR,
            headless=False,
            args=["--disable-blink-features=AutomationControlled"],
            viewport={'width': 1280, 'height': 800}
        )
        
        page = await context.new_page()
        await page.goto("https://www.linkedin.com/login")
        
        input("Press ENTER here AFTER you have successfully logged in and can see your LinkedIn feed...")
        
        # Capture cookies
        cookies = await context.cookies()
        session_json = json.dumps(cookies)
        
        # Encrypt
        key = derive_key(VAULT_KEY)
        encrypted_blob = encrypt_session(session_json, key)
        
        # Save to database
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            # Update the vault_secrets table
            # Assuming schema: (account_id, secret_type, secret_value)
            cursor.execute("""
                INSERT OR REPLACE INTO vault_secrets (account_id, secret_type, secret_value)
                VALUES (?, 'linkedin_session', ?)
            """, (ACCOUNT_ID, encrypted_blob))
            
            conn.commit()
            print(f"\n✅ SUCCESS: Session for {ACCOUNT_EMAIL} encrypted and saved to Vault.")
            print("You can now close the browser window.")
            conn.close()
        except Exception as e:
            print(f"\n❌ DATABASE ERROR: {e}")
        
        await context.close()

if __name__ == "__main__":
    asyncio.run(capture_session())
