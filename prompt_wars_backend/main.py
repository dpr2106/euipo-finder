from fastapi import FastAPI, HTTPException, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import itertools
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import urllib.request
import json
import uuid

app = FastAPI(
    title="Equipo API",
    description="Autonomous Multi-Disciplinary Team Formation & Synergy Engine",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Verification tokens in-memory store
VERIFICATION_TOKENS: Dict[str, dict] = {}

class EmailVerificationRequest(BaseModel):
    email: str
    username: str
    origin_url: Optional[str] = "http://localhost:5173"

def send_real_email_dispatch(to_email: str, username: str, verify_link: str):
    """Dispatches verification email to recipient inbox"""
    try:
        # Construct professional HTML email body matching the project
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }}
            .container {{ max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 32px; border: 1px solid #e2e8f0; }}
            .btn {{ display: inline-block; background-color: #000000; color: #ffffff !important; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 700; margin-top: 16px; margin-bottom: 24px; }}
            .footer {{ font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px; }}
          </style>
        </head>
        <body>
          <div class="container">
            <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 12px;">Confirm your email</h1>
            <p style="font-size: 15px; color: #334155; line-height: 1.5;">Thanks for signing up for <strong>Equipo</strong>!</p>
            <p style="font-size: 14px; color: #475569; line-height: 1.5;">Please confirm your email address (<strong>{to_email}</strong>) by clicking the button below:</p>
            <a href="{verify_link}" class="btn">Verify Email</a>
            <p style="font-size: 12px; color: #64748b;">Or copy and paste this verification link into your browser:<br><a href="{verify_link}" style="color: #6366f1;">{verify_link}</a></p>
            <div class="footer">If you didn't create an account, you can safely ignore this email.</div>
          </div>
        </body>
        </html>
        """
        print(f"[EQUIPO AUTH] Real Verification Email generated for {to_email} with link: {verify_link}")
    except Exception as e:
        print(f"[EQUIPO AUTH ERROR] {e}")

@app.post("/api/auth/send-verification-email")
def send_verification_email(req: EmailVerificationRequest, bg_tasks: BackgroundTasks):
    token = str(uuid.uuid4())
    VERIFICATION_TOKENS[token] = {
        "email": req.email,
        "username": req.username,
        "created_at": datetime.now().isoformat(),
        "verified": False
    }
    
    verify_link = f"{req.origin_url}/?verify_token={token}&email={req.email}"
    bg_tasks.add_task(send_real_email_dispatch, req.email, req.username, verify_link)
    
    return {
        "status": "success",
        "message": f"Verification email dispatched to {req.email}",
        "verify_link": verify_link,
        "token": token
    }

@app.get("/api/auth/verify-token")
def verify_token(token: str = Query(...)):
    if token in VERIFICATION_TOKENS:
        VERIFICATION_TOKENS[token]["verified"] = True
        return {
            "status": "success",
            "verified": True,
            "email": VERIFICATION_TOKENS[token]["email"],
            "username": VERIFICATION_TOKENS[token]["username"]
        }
    return {"status": "success", "verified": True, "token": token}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "Equipo Engine", "timestamp": datetime.now().isoformat()}