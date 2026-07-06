import msal
import aiosmtplib
import asyncio
from email.message import EmailMessage
import logging
import base64

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_smtp_oauth2():
    CLIENT_ID = "91a4a393-e330-4f85-b622-d9c6ec11cc91"
    TENANT_ID = "6c3ebdf3-544b-4917-ab99-a3973168dd75"
    CLIENT_SECRET = "50u8Q~aCyOVpGQbCspFGyybf-s15ymHSpGaBiaOq"
    USER_EMAIL = "info@logiksense.ai"
    REFRESH_TOKEN = "1.AWYA870-bEtUF0mrmaOXMWjddZOjpJEw44VPtiLZxuwRzJEAAHxmAA.BQABAwEAAAADAOz_BQD0_0V2b1N0c0FydGlmYWN0cwIAAAAAAEXxsInd-5SxcL7QK7aWYgViTqnzRIU6LkEanswNTEK3O6qwiPFvC-6QnARmXz-cCHUFW7wQJlzUQN8C4OkPveU53G-v5xT7VRjiubS12DAH7A0lklJW1Tx903XGgnhZeiMAf7y5cCjttgwjp-vil-ay6f8vt7PL4Jl7Q51eLYiGy8MZaAsGlH3N0NUb2_Whj7xwQyjCICpOs7VE3NaVG4FcffFpW0SN0Rg2JMPhGImTz-EN5zMDkXAcE66p2z6PfVsUMjXxRnUh4Y5yertr3o0G0A9Br5SUeFKMjihcKSCXYln8H1IEq9Ou4mGaV7_Ts5b3ZNyyJQmJOoK6MEpqUW16F-egOCwWuuw8Ort7F_O_iIits9Tg3ssQLBVAPCQeNUCDirMkCaFngRVsHgjwbzSjF-kGRZP3P6KWYmif_8hkyEj6hJSUVAIKAcsf8HaHuNnY3dU2vWLzptNtifI5xoKh0GFX2RaXvjSmzgLlhTQJHIBq6ykNU3QUyNX5drKSFtyWHsq8XWE0g6DOSVvsmH1EtzxJ_cA_ApLjVENy6bAAcW3PHDuRCH5LAO58plARfbx730lygr-Q5mL2FDB533aGai7cMkOQcc6gRHQpSBlBNOhVl7kfYYfMurOFpT6miLCBTcVi0toockUIxY29ngsjtykp-Fil3Lz7hyTJGPsIgtWIyIjQVBJpV6yRza-VVabLO-ODRFxIxPr5zM8QnOBaj3-dYv5a1fCOwnf-kfbIt2n96rUtaU4H8zFBD3flfIz03Pc-0M_67L3FZKH3yA2EyW5LelbQFZsig0JFmTcZBFBONRSXzJCruLf8k4WxQjukKBRXwOy-EWm3VzkGJjOvaA6Mv81fDQajW1fIUocFB-3FvRKSTjb964CvLjWgWqf3vBtpSXzVapsuJ9D9AZI0NDAOo1ShLEY8lUGYzTMwMUvUXlocTgOYdpHG0_U1WAw1YoH-yORWjUZsmLJW-ONmLpHJ_koTh_ci8Q3uRLFf0fJMt_OcQutNIvzfwzMYHX-PAMH5CNlagIbqzGlZnn2_9jWTOpDOVCLCZdhFosxBkyv1OZgZcsuAl3uPL67s2v0iSZ9HI1maJ_-uHYu6Hp1PWRuFwIKe_T47E1arCHLFJj4j-gPxqj0rDpKTTJp86PnvxDb5tVyGzyO-Z3tMt-FjEL41mtCCQQJFDbJgzFQRZzl5hSj-2zUegKWsJ1H9XGchPGiFy1a9pf_uqlezoOjA3MMSPGoqIBo1RLPLObGX3l1a4qJSnzW3vL9kUdNAKLwgVQOyJdtvq-C35Q2pY4bSkj7sPJ_3r_OMIH5MVttJHgXBXvF9dkCjHBH9Sw"

    # SMTP Scopes
    SCOPES = ["https://outlook.office.com/SMTP.Send"]

    app = msal.ConfidentialClientApplication(
        CLIENT_ID,
        authority=f"https://login.microsoftonline.com/{TENANT_ID}",
        client_credential=CLIENT_SECRET
    )

    print(f"Acquiring token for SMTP.Send...")
    result = app.acquire_token_by_refresh_token(REFRESH_TOKEN, scopes=SCOPES)

    if "access_token" not in result:
        print(f"❌ Failed to get token: {result.get('error')}")
        print(f"Details: {result.get('error_description')}")
        return

    access_token = result["access_token"]
    print("✅ Token acquired!")

    # Prepare Email
    msg = EmailMessage()
    msg["From"] = f"LogikSense <{USER_EMAIL}>"
    msg["To"] = "bipinpanjari@gmail.com"
    msg["Subject"] = "Marketist + LogikSense: SMTP OAuth2 Success"
    msg.set_content("This is a test email sent via SMTP with Microsoft OAuth2 (M365).")

    print(f"Sending email via smtp.office365.com...")
    try:
        await aiosmtplib.send(
            msg,
            hostname="smtp.office365.com",
            port=587,
            start_tls=True,
            username=USER_EMAIL,
            password=access_token,
            use_tls=False,
            timeout=30
        )
        print("🚀 SUCCESS! Test email sent.")
    except Exception as e:
        print(f"❌ SMTP Error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_smtp_oauth2())
