import logging
import os
from .ms_graph_engine import MSGraphEmailEngine
from .linkedin_engine import LinkedInEngine

logger = logging.getLogger(__name__)

class SyncBridge:
    """
    The 'Glue' between Hunting (Ruflo Swarm) and Marketing (LogikSense Modules).
    This handles moving leads from 'Discovered' to 'Active Outbound'.
    """
    def __init__(self):
        self.email_engine = MSGraphEmailEngine()
        # LinkedIn engines are usually account-specific, late initialization used below

    async def promote_lead_to_campaign(self, lead_id: str, company_data: dict, signal_data: dict, linkedin_account_id: str = None):
        """
        Takes a lead found by Marketist and pushes it into an outreach sequence.
        """
        logger.info(f"[SyncBridge] Promoting Lead {lead_id} ({company_data.get('name')}) to Marketing Pipeline")
        
        # 1. Identify the best channel
        preferred_channel = "linkedin" if company_data.get("linkedin_url") else "email"
        
        # 2. Trigger execution
        if preferred_channel == "email":
            subject = f"Marketist: Opportunity at {company_data.get('name')}"
            body = f"Hi, noticed {signal_data.get('description')}. Thought we could help."
            
            # Use MS Graph engine
            success = self.email_engine.send_email(
                to_recipients=[company_data.get('email', 'info@target.com')],
                subject=subject,
                body_content=body
            )
            return {"status": "sent" if success else "failed", "channel": "email"}
            
        elif preferred_channel == "linkedin" and linkedin_account_id:
            engine = LinkedInEngine(account_id=linkedin_account_id)
            # This would typically be an async task or queue
            # result = await engine.run_automation("send_message", target_url=company_data.get("linkedin_url"))
            return {"status": "queued", "channel": "linkedin"}
            
        return {"status": "ready", "channel": preferred_channel}

