import asyncio
import logging
import os
import psycopg2
from modules.marketing.linkedin_engine import LinkedInEngine

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# LogikSense DB Connection
LOGIKSENSE_DB_URL = "postgresql://db_username:logiksense@localhost:5432/logiksense_marketing"
VAULT_KEY = "dGVzdC12YXVsdC1rZXktZm9yLWNpLTMyYnl0ZXM="

async def test_linkedin():
    print("\n--- Marketist.dev | LinkedIn Professional Autopilot Test ---")
    
    try:
        conn = psycopg2.connect(LOGIKSENSE_DB_URL)
        cur = conn.cursor()
        
        # 1. Fetch LinkedIn Account
        cur.execute("SELECT id, email, session_vault_ref, workspace_id FROM linkedin_accounts WHERE email = 'bipinpanjari@gmail.com' LIMIT 1;")
        account = cur.fetchone()
        
        if not account:
            print("❌ Account bipinpanjari@gmail.com not found in DB.")
            return

        acc_id, acc_email, session_ref, ws_id = account
        print(f"Found Account: {acc_email} (ID: {acc_id})")
        
        # 2. Try to Fetch Encrypted Session from Vault (if it exists)
        encrypted_session = None
        if session_ref:
            cur.execute("SELECT encrypted_value FROM vault_secrets WHERE ref_key = %s LIMIT 1;", (session_ref,))
            secret = cur.fetchone()
            if secret:
                encrypted_session = secret[0]
                print(f"Retrieved encrypted session blob (length: {len(encrypted_session)})")
            else:
                print("ℹ️ No session cookies found in vault yet. Proceeding with fresh browser context.")

        # 3. Test LinkedInEngine
        engine = LinkedInEngine(account_id=acc_id, vault_key=VAULT_KEY)
        
        print("Launching browser autopilot...")
        # Set headless=False for testing if you want to see it, but we'll stick to headless for this run.
        os.environ["LINKEDIN_HEADLESS"] = "true" 
        
        result = await engine.run_automation(
            task_type="verify", 
            encrypted_session=encrypted_session
        )
        
        if result.get("status") == "success":
            print(f"✅ SUCCESS! LinkedIn session for {acc_email} is ACTIVE.")
        else:
            print(f"❌ LinkedIn Auth Failed: {result.get('message', result.get('error'))}")

    except Exception as e:
        print(f"❌ Error during test: {e}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    asyncio.run(test_linkedin())
