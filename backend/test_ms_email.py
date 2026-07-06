import sys
import os
import logging
import requests
from dotenv import load_dotenv
from modules.marketing.ms_graph_engine import MSGraphEmailEngine

# Load environment variables from .env
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_ms365():
    # Use environment variables now
    CLIENT_ID = os.getenv("MICROSOFT_CLIENT_ID")
    TENANT_ID = os.getenv("MICROSOFT_TENANT_ID")
    CLIENT_SECRET = os.getenv("MICROSOFT_CLIENT_SECRET")
    USER_EMAIL = os.getenv("MICROSOFT_USER_EMAIL")
    
    # We still need a refresh token if we want to use the one from LogikSense specifically,
    # otherwise it will try to get a client-credentials token (which might not have Mail.Send permissions).
    # In LogikSense, refresh tokens were stored in the DB.
    
    # For this test, I'll use the one I found previously if it's still valid.
    REFRESH_TOKEN = "1.AWYA870-bEtUF0mrmaOXMWjddZOjpJEw44VPtiLZxuwRzJEAAHxmAA.BQABAwEAAAADAOz_BQD0_0V2b1N0c0FydGlmYWN0cwIAAAAAAEXxsInd-5SxcL7QK7aWYgViTqnzRIU6LkEanswNTEK3O6qwiPFvC-6QnARmXz-cCHUFW7wQJlzUQN8C4OkPveU53G-v5xT7VRjiubS12DAH7A0lklJW1Tx903XGgnhZeiMAf7y5cCjttgwnhZeiMAf7y5cCjttgwjp-vil-ay6f8vt7PL4Jl7Q51eLYiGy8MZaAsGlH3N0NUb2_Whj7xwQyjCICpOs7VE3NaVG4FcffFpW0SN0Rg2JMPhGImTz-EN5zMDkXAcE66p2z6PfVsUMjXxRnUh4Y5yertr3o0G0A9Br5SUeFKMjihcKSCXYln8H1IEq9Ou4mGaV7_Ts5b3ZNyyJQmJOoK6MEpqUW16F-egOCwWuuw8Ort7F_O_iIits9Tg3ssQLBVAPCQeNUCDirMkCaFngRVsHgjwbzSjF-kGRZP3P6KWYmif_8hkyEj6hJSUVAIKAcsf8HaHuNnY3dU2vWLzptNtifI5xoKh0GFX2RaXvjSmzgLlhTQJHIBq6ykNU3QUyNX5drKSFtyWHsq8XWE0g6DOSVvsmH1EtzxJ_cA_ApLjVENy6bAAcW3PHDuRCH5LAO58plARfbx730lygr-Q5mL2FDB533aGai7cMkOQcc6gRHQpSBlBNOhVl7kfYYfMurOFpT6miLCBTcVi0toockUIxY29ngsjtykp-Fil3Lz7hyTJGPsIgtWIyIjQVBJpV6yRza-VVabLO-ODRFxIxPr5zM8QnOBaj3-dYv5a1fCOwnf-kfbIt2n96rUtaU4H8zFBD3flfIz03Pc-0M_67L3FZKH3yA2EyW5LelbQFZsig0JFmTcZBFBONRSXzJCruLf8k4WxQjukKBRXwOy-EWm3VzkGJjOvaA6Mv81fDQajW1fIUocFB-3FvRKSTjb964CvLjWgWqf3vBtpSXzVapsuJ9D9AZI0NDAOo1ShLEY8lUGYzTMwMUvUXlocTgOYdpHG0_U1WAw1YoH-yORWjUZsmLJW-ONmLpHJ_koTh_ci8Q3uRLFf0fJMt_OcQutNIvzfwzMYHX-PAMH5CNlagIbqzGlZnn2_9jWTOpDOVCLCZdhFosxBkyv1OZgZcsuAl3uPL67s2v0iSZ9HI1maJ_-uHYu6Hp1PWRuFwIKe_T47E1arCHLFJj4j-gPxqj0rDpKTTJp86PnvxDb5tVyGzyO-Z3tMt-FjEL41mtCCQQJFDbJgzFQRZzl5hSj-2zUegKWsJ1H9XGchPGiFy1a9pf_uqlezoOjA3MMSPGoqIBo1RLPLObGX3l1a4qJSnzW3vL9kUdNAKLwgVQOyJdtvq-C35Q2pY4bSkj7sPJ_3r_OMIH5MVttJHgXBXvF9dkCjHBH9Sw"
    
    print("\n--- Marketist.dev | MS365 Professional Email Test ---")
    print(f"Targeting: {USER_EMAIL}")
    
    engine = MSGraphEmailEngine(
        client_id=CLIENT_ID,
        tenant_id=TENANT_ID,
        client_secret=CLIENT_SECRET,
        user_email=USER_EMAIL
    )
    
    access_token = engine.get_access_token()
    if access_token:
        print("✅ Access Token acquired!")
        
        # Try to list users to verify general API access
        try:
            res = requests.get("https://graph.microsoft.com/v1.0/users", headers={"Authorization": f"Bearer {access_token}"})
            if res.status_code == 200:
                print("✅ General API Access: SUCCESS (Can list users)")
            else:
                print(f"❌ General API Access: FAILED ({res.status_code}) - {res.text}")
        except Exception as e:
            print(f"❌ General API Access: ERROR - {str(e)}")

        test_recipient = "bipinpanjari@gmail.com"
        subject = "Marketist.dev - Graph API Deployment Test"
        
        success = engine.send_email(
            to_recipients=[test_recipient],
            subject=subject,
            body_content="<b>Success!</b> The MS Graph Engine is now integrated into Marketist.dev."
        )
        
        if success:
            print("🚀 SUCCESS! Graph test email sent.")
        else:
            print("❌ Graph API Error: Failed to send email.")
    else:
        print("❌ Failed to get Graph token.")



if __name__ == "__main__":
    test_ms365()
