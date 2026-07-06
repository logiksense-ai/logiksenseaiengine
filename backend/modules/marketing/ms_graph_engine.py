import msal
import requests
import logging
import os
from typing import Optional, List, Dict

logger = logging.getLogger(__name__)

class MSGraphEmailEngine:
    def __init__(self, 
                 client_id: str = None, 
                 tenant_id: str = None, 
                 client_secret: str = None, 
                 user_email: str = None, 
                 refresh_token: Optional[str] = None):
        
        self.client_id = client_id or os.getenv("MICROSOFT_CLIENT_ID")
        self.tenant_id = tenant_id or os.getenv("MICROSOFT_TENANT_ID")
        self.client_secret = client_secret or os.getenv("MICROSOFT_CLIENT_SECRET")
        self.user_email = user_email or os.getenv("MICROSOFT_USER_EMAIL")
        self.refresh_token = refresh_token
        
        if not all([self.client_id, self.tenant_id, self.client_secret, self.user_email]):
            logger.warning("MSGraphEmailEngine: Missing environment configuration for Microsoft 365.")

        self.authority = f"https://login.microsoftonline.com/{self.tenant_id}"
        self.scopes = ["https://graph.microsoft.com/.default"]
        
        self.app = msal.ConfidentialClientApplication(
            self.client_id,
            authority=self.authority,
            client_credential=self.client_secret,
        )

    def get_access_token(self) -> Optional[str]:
        """Acquire a token from Microsoft Identity Platform."""
        # Try to use refresh token if provided
        if self.refresh_token:
            result = self.app.acquire_token_by_refresh_token(self.refresh_token, scopes=self.scopes)
            if "access_token" in result:
                return result["access_token"]
            else:
                logger.warning(f"Failed to use refresh token: {result.get('error')}")

        # Fallback to client credentials if refresh token fails or is not provided
        result = self.app.acquire_token_silent(self.scopes, account=None)
        
        if not result:
            logger.info("No suitable token exists in cache. Getting a new one from AAD.")
            result = self.app.acquire_token_for_client(scopes=self.scopes)
            
        if "access_token" in result:
            return result["access_token"]
        else:
            logger.error(f"Error acquiring token: {result.get('error')}")
            logger.error(f"Description: {result.get('error_description')}")
            return None

    def send_email(self, 
                   to_recipients: List[str], 
                   subject: str, 
                   body_content: str, 
                   is_html: bool = True) -> bool:
        """Send an email using Microsoft Graph API."""
        token = self.get_access_token()
        if not token:
            return False

        endpoint = f"https://graph.microsoft.com/v1.0/users/{self.user_email}/sendMail"
        
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "message": {
                "subject": subject,
                "body": {
                    "contentType": "HTML" if is_html else "Text",
                    "content": body_content
                },
                "toRecipients": [
                    {"emailAddress": {"address": email}} for email in to_recipients
                ]
            },
            "saveToSentItems": "true"
        }
        
        try:
            response = requests.post(endpoint, headers=headers, json=payload)
            if response.status_code == 202:
                logger.info(f"Email sent successfully to {to_recipients}")
                return True
            else:
                logger.error(f"Failed to send email: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            logger.error(f"Exception while sending email via Graph: {str(e)}")
            return False

    def verify_connection(self) -> bool:
        """Verify the connection by fetching user profile."""
        token = self.get_access_token()
        if not token:
            print("Failed to get access token")
            return False
            
        endpoint = f"https://graph.microsoft.com/v1.0/users/{self.user_email}"
        headers = {"Authorization": f"Bearer {token}"}
        
        try:
            response = requests.get(endpoint, headers=headers)
            if response.status_code != 200:
                print(f"Graph API Error: {response.status_code} - {response.text}")
            return response.status_code == 200
        except Exception as e:
            print(f"Exception: {str(e)}")
            return False
