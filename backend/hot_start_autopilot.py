import os
import json
import sqlite3
import asyncio
import logging
from autopilot_daemon import run_autopilot_cycle
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)

async def hot_start():
    print("\n--- 🔥 LogikSense Auto-Pilot: HOT START TRIGGERED ---")
    print("Enforcing Constraint: SMB Only (1-200 Employees)")
    await run_autopilot_cycle()
    print("\n--- Hot Start Cycle Complete ---")

if __name__ == "__main__":
    asyncio.run(hot_start())
