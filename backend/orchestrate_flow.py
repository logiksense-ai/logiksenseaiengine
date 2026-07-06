import os
import json
import sqlite3
import asyncio
import logging
from datetime import datetime
from modules.marketing.linkedin_engine import LinkedInEngine
from modules.marketing.ms_graph_engine import MSGraphEmailEngine
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Config
DB_PATH = "intentgraph.db"
VAULT_KEY = os.getenv("VAULT_ENCRYPTION_KEY", "dGVzdC12YXVsdC1rZXktZm9yLWNpLTMyYnl0ZXM=")
LINKEDIN_ACCOUNT_ID = "fb154923-ff11-4743-a417-49be7cf9a43a"

async def orchestrate_flow():
    print("\n--- Marketist.dev | Professional Execution Flow ---")
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. Check for new signals (Simulating a Google Trends/Scout result)
    # In a real run, the Scout agent would have populated this.
    cursor.execute("SELECT * FROM signals WHERE processed = 0 LIMIT 1")
    signal = cursor.fetchone()

    if not signal:
        print("ℹ️ No new signals in queue. Injecting a demo signal for 'ERP Consolidation'...")
        cursor.execute("""
            INSERT INTO signals (type, source, company, data, score) 
            VALUES (?, ?, ?, ?, ?)
        """, ("trend_spike", "Google Trends", "LogikSense Enterprise", json.dumps({"keyword": "ERP Consolidation", "spike": "+142%"}), 98))
        conn.commit()
        cursor.execute("SELECT * FROM signals WHERE processed = 0 LIMIT 1")
        signal = cursor.fetchone()

    sig_id, sig_type, sig_source, sig_company, sig_data, sig_ts, sig_score, _ = signal
    sig_data_json = json.loads(sig_data)
    
    print(f"🚀 Processing Signal: {sig_type} from {sig_source}")
    print(f"🏢 Company: {sig_company} | Intent Score: {sig_score}")
    print(f"📈 Insight: Spike in '{sig_data_json.get('keyword')}' searches detected.")

    # 2. Fetch LinkedIn Session from Vault
    cursor.execute("SELECT secret_value FROM vault_secrets WHERE account_id = ? AND secret_type = 'linkedin_session'", (LINKEDIN_ACCOUNT_ID,))
    secret = cursor.fetchone()
    encrypted_session = secret[0] if secret else None

    # 3. Execution Phase
    linkedin = LinkedInEngine(account_id=LINKEDIN_ACCOUNT_ID, vault_key=VAULT_KEY)
    email_engine = MSGraphEmailEngine()

    print("\n[Step 1] Initializing LinkedIn Stealth Outreach...")
    # Simulate finding the target profile (in real flow, Researcher agent would do this)
    target_profile = "https://www.linkedin.com/in/bipin-p-b7a1b1/" 
    
    # We use 'verify' for this demo to avoid actually sending a message, 
    # but the logic for 'send_message' is fully implemented in the engine.
    li_result = await linkedin.run_automation(task_type="verify", encrypted_session=encrypted_session)
    
    if li_result.get("status") == "success":
        print(f"✅ LinkedIn: Session verified for {sig_company}. Ready for message delivery.")
    else:
        print(f"❌ LinkedIn: {li_result.get('message')}")

    print("\n[Step 2] Delivery of MS Graph Professional Email...")
    email_body = f"""
    Hi Team at {sig_company},
    
    Our systems detected a significant spike in {sig_data_json.get('keyword')} interest within your sector.
    Given your current market position, I thought you might find our latest analysis on intent-driven scaling relevant.
    
    Best regards,
    Bipin (LogikSense Automation Agent)
    """
    
    email_res = email_engine.send_email(
        subject=f"Urgent: {sig_data_json.get('keyword')} Market Signal Detected",
        body=email_body,
        to_address="bipinpanjari@gmail.com" # Sending to yourself for verification
    )

    if email_res:
        print(f"✅ Email: Successfully delivered via MS Graph.")
    
    # Mark signal as processed
    cursor.execute("UPDATE signals SET processed = 1 WHERE id = ?", (sig_id,))
    conn.commit()
    conn.close()
    
    print("\n--- Flow Complete: Intent -> Analysis -> Execution Successful ---")

if __name__ == "__main__":
    asyncio.run(orchestrate_flow())
