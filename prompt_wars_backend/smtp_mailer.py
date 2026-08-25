import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "preetlassipeele@gmail.com"
SMTP_PASS = "zqiy wcwm ovoe veqy"

def send_verification_smtp_email(to_email: str, recipient_name: str, verify_link: str) -> bool:
    subject = "Confirm your email — Equipo Team Platform"
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: sans-serif; background-color: #f8fafc; padding: 24px;">
      <div style="max-width: 500px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <h1 style="color: #0f172a; font-size: 24px; font-weight: 800;">Confirm your email</h1>
        <p style="color: #334155; font-size: 15px;">Thanks for signing up for <strong>Equipo</strong>!</p>
        <p style="color: #475569; font-size: 14px;">Please confirm your email address (<strong>{to_email}</strong>) below:</p>
        <a href="{verify_link}" style="display: inline-block; background: #000; color: #fff !important; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 700; margin: 16px 0;">Verify Email</a>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 12px;">If you didn't create an account, you can safely ignore this email.</p>
      </div>
    </body>
    </html>
    """

    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = f"Equipo <{SMTP_USER}>"
    message["To"] = to_email
    message.attach(MIMEText(html_content, "html"))

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls(context=context)
            server.login(SMTP_USER, SMTP_PASS.replace(" ", ""))
            server.sendmail(SMTP_USER, to_email, message.as_string())
        print(f"[SMTP DISPATCH SUCCESS] Real email sent to {to_email}")
        return True
    except Exception as e:
        print(f"[SMTP NOTICE] Token ready for {to_email}: {verify_link}")
        return False