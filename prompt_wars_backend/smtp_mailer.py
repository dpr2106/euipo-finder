import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

# Equipo Real SMTP Dispatch Service
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "auth.equipo.network@gmail.com")
SMTP_PASS = os.getenv("SMTP_PASS", "zqiy wcwm ovoe veqy")

def send_verification_smtp_email(to_email: str, recipient_name: str, verify_link: str) -> bool:
    """Sends HTML verification email to recipient inbox using Python SMTP"""
    subject = "Confirm your email — Equipo Team Formation Platform"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }}
        .container {{ max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 32px; border: 1px solid #e2e8f0; }}
        .btn {{ display: inline-block; background-color: #000000; color: #ffffff !important; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 700; margin-top: 16px; margin-bottom: 24px; }}
        .footer {{ font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px; }}
      </style>
    </head>
    <body>
      <div class="container">
        <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 12px;">Confirm your email</h1>
        <p style="font-size: 15px; color: #334155; line-height: 1.5;">Thanks for signing up for <strong>Equipo</strong>!</p>
        <p style="font-size: 14px; color: #475569; line-height: 1.5;">Please confirm your email address (<strong>{to_email}</strong>) below:</p>
        <a href="{verify_link}" class="btn">Verify Email</a>
        <p style="font-size: 12px; color: #64748b; margin-top: 16px;">Or click: <br><a href="{verify_link}" style="color: #6366f1;">{verify_link}</a></p>
        <div class="footer">If you didn't create an account, you can safely ignore this email.</div>
      </div>
    </body>
    </html>
    """

    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = f"Equipo Auth <{SMTP_USER}>"
    message["To"] = to_email
    message.attach(MIMEText(html_content, "html"))

    try:
        if SMTP_PASS:
            context = ssl.create_default_context()
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls(context=context)
                server.login(SMTP_USER, SMTP_PASS)
                server.sendmail(SMTP_USER, to_email, message.as_string())
            print(f"[SMTP SUCCESS] Verification email sent to {to_email}")
        else:
            print(f"[SMTP DISPATCH READY] Token link generated for {to_email}: {verify_link}")
        return True
    except Exception as e:
        print(f"[SMTP ERROR] {e}")
        return False