import os
import json
import sqlite3
import asyncio
import time
import subprocess
import logging
from datetime import datetime
import ollama
from modules.marketing.linkedin_engine import LinkedInEngine
from modules.marketing.ms_graph_engine import MSGraphEmailEngine
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("AutoPilot")

DB_PATH = "intentgraph.db"
VAULT_KEY = os.getenv("VAULT_ENCRYPTION_KEY", "dGVzdC12YXVsdC1rZXktZm9yLWNpLTMyYnl0ZXM=")
LINKEDIN_ACCOUNT_ID = "fb154923-ff11-4743-a417-49be7cf9a43a"
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "mistral")

async def generate_personalized_message(company, signal_type, keyword):
    """Refined AI Writer using local Ollama instance."""
    logger.info(f"Ollama: Generating creative message for {company}...")
    
    prompt = f"""
    You are a professional business development agent for LogikSense, an automation company.
    We just detected a spike in interest for '{keyword}' at the company '{company}'.
    
    Write a short, professional, and slightly intriguing outbound email.
    Guidelines:
    - Mention the interest spike in '{keyword}'.
    - Don't sound like a robot; sound like a helpful consultant.
    - Keep it under 100 words.
    - The goal is to start a conversation about how automation can help with {keyword}.
    
    Company: {company}
    Signal: {signal_type}
    Topic: {keyword}
    """
    
    try:
        # Use httpx to check if Ollama is responsive first
        import httpx
        try:
            httpx.get("http://localhost:11434/api/tags", timeout=2.0)
        except:
            raise Exception("Ollama server not reachable at localhost:11434")

        response = ollama.chat(model=OLLAMA_MODEL, messages=[
            {'role': 'system', 'content': 'You are a professional B2B writer.'},
            {'role': 'user', 'content': prompt},
        ])
        return response['message']['content']
    except Exception as e:
        logger.error(f"Ollama Error: {e}. Falling back to template.")
        fallback = f"Hi Team at {company},\n\nWe saw a major {keyword} interest spike at your company. LogikSense is here to help you automate this process. Shall we discuss?"
        return fallback

async def process_single_signal(signal, linkedin, email_engine, encrypted_session):
    # Unpack with flexibility for the new employee_count column
    sig_id, sig_type, sig_source, sig_company, sig_data, sig_ts, sig_score, processed, emp_count = signal
    sig_data_json = json.loads(sig_data)
    keyword = sig_data_json.get('keyword', 'Automation')

    logger.info(f"🚀 [AUTO-PILOT] Processing: {sig_company} (Score: {sig_score})")

    # 1. AI Creative Drafting
    personalized_msg = await generate_personalized_message(sig_company, sig_type, keyword)

    # 2. LinkedIn Execution (Stealth Mode)
    # Note: Using 'verify' for safety in demo mode, switch to 'send_message' for production
    logger.info(f"Autopilot: Running LinkedIn stealth check for {sig_company}...")
    li_result = await linkedin.run_automation(task_type="verify", encrypted_session=encrypted_session)
    
    # 3. Email Execution (Professional Hub)
    logger.info(f"Autopilot: Delivering MS Graph email to leads at {sig_company}...")
    email_res = email_engine.send_email(
        to_recipients=["bipinpanjari@gmail.com"], # Verification sink
        subject=f"Urgent: {keyword} Insight for {sig_company}",
        body_content=personalized_msg,
        is_html=False
    )

    return True

async def run_autopilot_cycle():
    logger.info("--- Starting Auto-Pilot Execution Cycle ---")
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Fetch unprocessed high-intent signals within SMB range (1-200 employees)
    cursor.execute("SELECT * FROM signals WHERE processed = 0 AND score >= 80 AND employee_count >= 1 AND employee_count <= 200 LIMIT 5")
    signals = cursor.fetchall()

    if not signals:
        logger.info("No new high-intent signals found. Resting until next cycle.")
        conn.close()
        return

    # Initialize Engines
    cursor.execute("SELECT secret_value FROM vault_secrets WHERE account_id = ? AND secret_type = 'linkedin_session'", (LINKEDIN_ACCOUNT_ID,))
    secret = cursor.fetchone()
    encrypted_session = secret[0] if secret else None

    linkedin = LinkedInEngine(account_id=LINKEDIN_ACCOUNT_ID, vault_key=VAULT_KEY)
    email_engine = MSGraphEmailEngine()

    for sig in signals:
        success = await process_single_signal(sig, linkedin, email_engine, encrypted_session)
        if success:
            cursor.execute("UPDATE signals SET processed = 1 WHERE id = ?", (sig[0],))
            conn.commit()
            # Random delay between targets to stay human-like
            await asyncio.sleep(60) 

    conn.close()
    logger.info("--- Auto-Pilot Cycle Complete ---")

async def main_loop():
    """Main daemon loop."""
    print("LogikSense Auto-Pilot Daemon Started.")
    print(f"Interval: 6 Hours | Model: {OLLAMA_MODEL} | Stealth: ON")
    
    while True:
        try:
            await run_autopilot_cycle()
        except Exception as e:
            logger.error(f"Daemon Critical Error: {e}")
        
        # Sleep for 6 hours
        logger.info("Sleeping for 6 hours...")
        await asyncio.sleep(6 * 60 * 60)

if __name__ == "__main__":
    asyncio.run(main_loop())
