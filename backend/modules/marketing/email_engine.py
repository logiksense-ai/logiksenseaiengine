import aiosmtplib
from email.message import EmailMessage
from jinja2 import Template
import os
import logging

logger = logging.getLogger(__name__)

class EmailEngine:
    def __init__(self):
        self.smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", 587))
        self.smtp_user = os.getenv("SMTP_USER")
        self.smtp_pass = os.getenv("SMTP_PASS")
        self.from_email = os.getenv("SMTP_FROM", "hello@intentgraph.ai")

    async def send_email(self, to_email: str, subject: str, body_html: str):
        """Dispatches a single email using the configured SMTP server."""
        if not self.smtp_user or not self.smtp_pass:
            logger.warning("[EmailEngine] SMTP credentials not set, skipping send.")
            return False

        message = EmailMessage()
        message["From"] = self.from_email
        message["To"] = to_email
        message["Subject"] = subject
        message.add_alternative(body_html, subtype="html")

        try:
            await aiosmtplib.send(
                message,
                hostname=self.smtp_host,
                port=self.smtp_port,
                username=self.smtp_user,
                password=self.smtp_pass,
                start_tls=True
            )
            logger.info(f"[EmailEngine] Email sent to {to_email}")
            return True
        except Exception as e:
            logger.error(f"[EmailEngine] Failed to send email: {e}")
            return False

    def render_template(self, template_str: str, context: dict):
        """Renders a personalized outreach draft using Jinja2."""
        template = Template(template_str)
        return template.render(**context)
