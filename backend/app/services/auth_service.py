"""
Authentication business-logic layer.

All database mutations and token operations live here so the endpoint
layer stays thin.
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from uuid import UUID

import httpx
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from core.config import settings
from core.security import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    generate_email_token,
    hash_password,
    hash_token,
    verify_email_token,
    verify_password,
)
from models.user import (
    AuthIdentity,
    Business,
    Creator,
    Provider,
    RefreshToken,
    Session as SessionModel,
    User,
)
from schemas.user import SignupRequest
from utils.email import send_password_reset_email, send_verification_email


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _build_user_response(user: User) -> dict:
    """Produce a dict suitable for UserResponse from a polymorphic User."""
    data = {
        "id": user.id,
        "email": user.email,
        "email_verified": user.email_verified,
        "user_type": user.user_type,
        "created_at": user.created_at,
    }
    if isinstance(user, Creator):
        data.update(username=user.username, instagram_url=user.instagram_url, youtube_url=user.youtube_url)
    elif isinstance(user, Business):
        data.update(company_name=user.company_name, tax_id=user.tax_id)
    return data


def _create_session_and_tokens(
    db: Session, user: User, ip: str | None = None
) -> tuple[dict, str, str]:
    """
    Create a Session row + RefreshToken row, issue JWT pair.
    Returns (user_dict, access_token, refresh_token_jwt).
    """
    session = SessionModel(user_id=user.id, ip_address=ip)
    db.add(session)
    db.flush()  # get session.id

    access = create_access_token(user.id, session.id)
    refresh_jwt, jti = create_refresh_token(user.id, session.id)

    refresh_row = RefreshToken(
        user_id=user.id,
        session_id=session.id,
        token_hashed=hash_token(jti),
        expired_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    db.add(refresh_row)
    db.commit()
    db.refresh(user)

    return _build_user_response(user), access, refresh_jwt


# ---------------------------------------------------------------------------
# Signup
# ---------------------------------------------------------------------------

def signup(db: Session, data: SignupRequest, ip: str | None = None) -> tuple[dict, str, str]:
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, "Email already registered")

    # Create the correct subclass
    if data.user_type == "creator":
        user = Creator(
            email=data.email,
            username=data.username,
            instagram_url=data.instagram_url,
            youtube_url=data.youtube_url,
        )
    else:
        user = Business(
            email=data.email,
            company_name=data.company_name,
            tax_id=data.tax_id,
        )

    db.add(user)
    db.flush()

    identity = AuthIdentity(
        user_id=user.id,
        provider=Provider.EMAIL,
        provider_user_id=data.email,
        password_hashed=hash_password(data.password),
    )
    db.add(identity)
    db.flush()

    # Send verification email (best-effort — don't block signup on SMTP failure)
    try:
        token = generate_email_token(data.email, salt="email-confirm")
        send_verification_email(data.email, token)
    except Exception:
        pass  # logged elsewhere; user can resend later

    return _create_session_and_tokens(db, user, ip)


# ---------------------------------------------------------------------------
# Login
# ---------------------------------------------------------------------------

def login(db: Session, email: str, password: str, ip: str | None = None) -> tuple[dict, str, str]:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")

    identity = (
        db.query(AuthIdentity)
        .filter(AuthIdentity.user_id == user.id, AuthIdentity.provider == Provider.EMAIL)
        .first()
    )
    if not identity or not identity.password_hashed:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            "This account uses Google sign-in. Please log in with Google.",
        )

    if not verify_password(password, identity.password_hashed):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")

    return _create_session_and_tokens(db, user, ip)


# ---------------------------------------------------------------------------
# Refresh
# ---------------------------------------------------------------------------

def refresh(db: Session, refresh_token_jwt: str) -> tuple[str, str]:
    """
    Rotate the refresh token.
    Returns (new_access_jwt, new_refresh_jwt).
    """
    try:
        payload = decode_refresh_token(refresh_token_jwt)
    except Exception:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired refresh token")

    jti = payload.get("jti")
    session_id = payload.get("sid")

    if not jti or not session_id:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Malformed token")

    hashed = hash_token(jti)
    token_row = db.query(RefreshToken).filter(RefreshToken.token_hashed == hashed).first()

    if not token_row or token_row.revoked_at is not None:
        # Possible replay — revoke entire session as precaution
        if token_row:
            _revoke_session(db, UUID(session_id))
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token revoked or not found")

    # Check session still valid
    session = db.query(SessionModel).filter(SessionModel.id == UUID(session_id)).first()
    if not session or session.revoked_at is not None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Session revoked")

    # Revoke old token
    token_row.revoked_at = datetime.now(timezone.utc)

    # Issue new pair
    user_id = UUID(payload["sub"])
    new_access = create_access_token(user_id, session.id)
    new_refresh_jwt, new_jti = create_refresh_token(user_id, session.id)

    new_token_row = RefreshToken(
        user_id=user_id,
        session_id=session.id,
        token_hashed=hash_token(new_jti),
        expired_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    db.add(new_token_row)
    db.commit()

    return new_access, new_refresh_jwt


# ---------------------------------------------------------------------------
# Logout
# ---------------------------------------------------------------------------

def _revoke_session(db: Session, session_id: UUID) -> None:
    """Revoke a session and all its refresh tokens."""
    now = datetime.now(timezone.utc)
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if session:
        session.revoked_at = now
    db.query(RefreshToken).filter(
        RefreshToken.session_id == session_id,
        RefreshToken.revoked_at.is_(None),
    ).update({"revoked_at": now}, synchronize_session="fetch")
    db.commit()


def logout(db: Session, session_id: UUID) -> None:
    _revoke_session(db, session_id)


# ---------------------------------------------------------------------------
# Email verification
# ---------------------------------------------------------------------------

def verify_user_email(db: Session, token: str) -> None:
    max_age = settings.EMAIL_VERIFICATION_EXPIRE_HOURS * 3600
    email = verify_email_token(token, salt="email-confirm", max_age=max_age)
    if not email:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid or expired verification link")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")

    if user.email_verified:
        return  # already verified — idempotent

    user.email_verified = True
    db.commit()


def resend_verification(db: Session, email: str) -> None:
    user = db.query(User).filter(User.email == email).first()
    # Always return 200 to prevent email enumeration
    if not user or user.email_verified:
        return

    token = generate_email_token(email, salt="email-confirm")
    try:
        send_verification_email(email, token)
    except Exception:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Failed to send email")


# ---------------------------------------------------------------------------
# Password reset
# ---------------------------------------------------------------------------

def forgot_password(db: Session, email: str) -> None:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return  # silent — prevent enumeration

    # Only users with EMAIL provider can reset password
    identity = (
        db.query(AuthIdentity)
        .filter(AuthIdentity.user_id == user.id, AuthIdentity.provider == Provider.EMAIL)
        .first()
    )
    if not identity:
        return

    token = generate_email_token(email, salt="password-reset")
    try:
        send_password_reset_email(email, token)
    except Exception:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Failed to send email")


def reset_password(db: Session, token: str, new_password: str) -> None:
    max_age = settings.PASSWORD_RESET_EXPIRE_MINUTES * 60
    email = verify_email_token(token, salt="password-reset", max_age=max_age)
    if not email:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid or expired reset link")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")

    identity = (
        db.query(AuthIdentity)
        .filter(AuthIdentity.user_id == user.id, AuthIdentity.provider == Provider.EMAIL)
        .first()
    )
    if not identity:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Account does not use email/password login")

    identity.password_hashed = hash_password(new_password)

    # Revoke ALL sessions (force re-login everywhere)
    now = datetime.now(timezone.utc)
    db.query(SessionModel).filter(
        SessionModel.user_id == user.id,
        SessionModel.revoked_at.is_(None),
    ).update({"revoked_at": now}, synchronize_session="fetch")

    db.query(RefreshToken).filter(
        RefreshToken.user_id == user.id,
        RefreshToken.revoked_at.is_(None),
    ).update({"revoked_at": now}, synchronize_session="fetch")

    db.commit()


# ---------------------------------------------------------------------------
# Google OAuth
# ---------------------------------------------------------------------------

def google_exchange_code(code: str) -> dict:
    """Exchange an authorization code for Google user info."""
    token_resp = httpx.post(
        settings.GOOGLE_TOKEN_URL,
        data={
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": settings.GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code",
        },
        headers={"Accept": "application/json"},
        timeout=10.0,
    )
    if token_resp.status_code != 200:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Failed to exchange Google authorization code")

    tokens = token_resp.json()
    access_token = tokens.get("access_token")
    if not access_token:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "No access token from Google")

    userinfo_resp = httpx.get(
        settings.GOOGLE_USERINFO_URL,
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=10.0,
    )
    if userinfo_resp.status_code != 200:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Failed to fetch Google user info")

    return userinfo_resp.json()


def google_login(db: Session, code: str, ip: str | None = None) -> tuple[dict, str, str]:
    """
    Handle Google OAuth callback.
    - Existing Google identity → log in
    - Email exists (email signup) → link Google identity + log in
    - New user → create Creator account + log in
    """
    ginfo = google_exchange_code(code)
    google_id: str = ginfo["id"]
    google_email: str = ginfo.get("email", "")

    if not google_email:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Google account has no email")

    # Case 1: existing Google identity
    identity = (
        db.query(AuthIdentity)
        .filter(AuthIdentity.provider == Provider.GOOGLE, AuthIdentity.provider_user_id == google_id)
        .first()
    )
    if identity:
        user = identity.user
        # Ensure email is marked verified (Google guarantees it)
        if not user.email_verified:
            user.email_verified = True
            db.flush()
        return _create_session_and_tokens(db, user, ip)

    # Case 2: email already registered (via email signup) — link Google
    user = db.query(User).filter(User.email == google_email).first()
    if user:
        new_identity = AuthIdentity(
            user_id=user.id,
            provider=Provider.GOOGLE,
            provider_user_id=google_id,
        )
        db.add(new_identity)
        if not user.email_verified:
            user.email_verified = True
        db.flush()
        return _create_session_and_tokens(db, user, ip)

    # Case 3: brand-new user — create as Creator by default
    user = Creator(
        email=google_email,
        email_verified=True,
        username=google_email.split("@")[0],  # default username from email
    )
    db.add(user)
    db.flush()

    new_identity = AuthIdentity(
        user_id=user.id,
        provider=Provider.GOOGLE,
        provider_user_id=google_id,
    )
    db.add(new_identity)
    db.flush()

    return _create_session_and_tokens(db, user, ip)


# ---------------------------------------------------------------------------
# Session management
# ---------------------------------------------------------------------------

def get_user_sessions(db: Session, user_id: UUID, current_session_id: UUID) -> list[dict]:
    sessions = (
        db.query(SessionModel)
        .filter(SessionModel.user_id == user_id, SessionModel.revoked_at.is_(None))
        .order_by(SessionModel.created_at.desc())
        .all()
    )
    return [
        {
            "id": s.id,
            "created_at": s.created_at,
            "ip_address": s.ip_address,
            "is_current": s.id == current_session_id,
        }
        for s in sessions
    ]


def revoke_session(db: Session, session_id: UUID, user_id: UUID) -> None:
    session = db.query(SessionModel).filter(
        SessionModel.id == session_id,
        SessionModel.user_id == user_id,
    ).first()
    if not session:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Session not found")
    if session.revoked_at is not None:
        return  # already revoked
    _revoke_session(db, session_id)
