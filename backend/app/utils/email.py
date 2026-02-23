"""
SMTP email utilities for verification and password-reset emails.
"""

import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from core.config import settings

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Low-level sender
# ---------------------------------------------------------------------------

def send_email(to: str, subject: str, html_body: str) -> None:
    """Send an HTML email via SMTP."""
    msg = MIMEMultipart("alternative")
    msg["From"] = settings.EMAIL_ADDRESS
    msg["To"] = to
    msg["Subject"] = subject
    msg.attach(MIMEText(html_body, "html"))

    try:
        if settings.SMTP_PORT == 465:
            # SSL from the start (SMTPS)
            with smtplib.SMTP_SSL(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
                server.login(settings.EMAIL_ADDRESS, settings.EMAIL_PASSWORD)
                server.sendmail(settings.EMAIL_ADDRESS, to, msg.as_string())
        else:
            # Plain → STARTTLS upgrade (typically port 587)
            with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
                server.ehlo()
                server.starttls()
                server.ehlo()
                server.login(settings.EMAIL_ADDRESS, settings.EMAIL_PASSWORD)
                server.sendmail(settings.EMAIL_ADDRESS, to, msg.as_string())

        logger.info("Email sent to %s: %s", to, subject)
    except Exception as exc:
        logger.error("Failed to send email to %s: %s", to, exc)
        raise


# ---------------------------------------------------------------------------
# High-level helpers
# ---------------------------------------------------------------------------

def send_verification_email(email: str, token: str) -> None:
    link = f"{settings.FRONTEND_URI}/verify-email?token={token}"
    html = f"""\
    <html>
    <body style="font-family: Arial, sans-serif; color: #333;">
        <h2>Welcome to CreatorStop!</h2>
        <p>Please verify your email address by clicking the button below:</p>
        <p style="margin: 24px 0;">
            <a href="{link}"
               style="background-color: #6366f1; color: #fff; padding: 12px 24px;
                      text-decoration: none; border-radius: 6px; font-weight: 600;">
                Verify Email
            </a>
        </p>
        <p style="font-size: 13px; color: #888;">
            If the button doesn't work, copy and paste this link:<br>
            <a href="{link}">{link}</a>
        </p>
        <p style="font-size: 13px; color: #888;">
            This link expires in {settings.EMAIL_VERIFICATION_EXPIRE_HOURS} hours.
        </p>
    </body>
    </html>
    """
    send_email(email, "Verify your CreatorStop email", html)


def send_password_reset_email(email: str, token: str) -> None:
    link = f"{settings.FRONTEND_URI}/reset-password?token={token}"
    html = f"""\
    <html>
    <body style="font-family: Arial, sans-serif; color: #333;">
        <h2>Password Reset</h2>
        <p>We received a request to reset your password. Click the button below to set a new one:</p>
        <p style="margin: 24px 0;">
            <a href="{link}"
               style="background-color: #6366f1; color: #fff; padding: 12px 24px;
                      text-decoration: none; border-radius: 6px; font-weight: 600;">
                Reset Password
            </a>
        </p>
        <p style="font-size: 13px; color: #888;">
            If you didn't request this, you can safely ignore this email.<br>
            This link expires in {settings.PASSWORD_RESET_EXPIRE_MINUTES} minutes.
        </p>
        <p style="font-size: 13px; color: #888;">
            Or copy and paste:<br>
            <a href="{link}">{link}</a>
        </p>
    </body>
    </html>
    """
    send_email(email, "Reset your CreatorStop password", html)
