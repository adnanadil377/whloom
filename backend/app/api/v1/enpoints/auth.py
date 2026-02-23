"""
Authentication endpoints — stateful JWT with HTTP-only cookies + Google OAuth.
"""

from urllib.parse import urlencode
from uuid import UUID

from fastapi import APIRouter, Depends, Request, Response
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from core.config import settings
from core.dependencies import get_current_user
from db.session import get_db
from models.user import User
from schemas.user import (
    AuthResponse,
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    ResendVerificationRequest,
    ResetPasswordRequest,
    SessionResponse,
    SignupRequest,
    UserResponse,
    VerifyEmailRequest,
)
from services import auth_service

router = APIRouter()


# ---------------------------------------------------------------------------
# Cookie helpers
# ---------------------------------------------------------------------------

def _set_auth_cookies(response: Response, access_token: str, refresh_token: str) -> None:
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        path="/api",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        path="/api/v1/auth/refresh",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
    )


def _clear_auth_cookies(response: Response) -> None:
    response.delete_cookie("access_token", path="/api")
    response.delete_cookie("refresh_token", path="/api/v1/auth/refresh")


# ---------------------------------------------------------------------------
# Public endpoints
# ---------------------------------------------------------------------------

@router.post("/signup", response_model=AuthResponse)
def signup(data: SignupRequest, request: Request, response: Response, db: Session = Depends(get_db)):
    ip = request.client.host if request.client else None
    user_data, access, refresh = auth_service.signup(db, data, ip)
    _set_auth_cookies(response, access, refresh)
    return AuthResponse(user=UserResponse(**user_data), message="Account created successfully")


@router.post("/login", response_model=AuthResponse)
def login(data: LoginRequest, request: Request, response: Response, db: Session = Depends(get_db)):
    ip = request.client.host if request.client else None
    user_data, access, refresh = auth_service.login(db, data.email, data.password, ip)
    _set_auth_cookies(response, access, refresh)
    return AuthResponse(user=UserResponse(**user_data), message="Logged in successfully")


@router.post("/refresh", response_model=MessageResponse)
def refresh(request: Request, response: Response, db: Session = Depends(get_db)):
    token = request.cookies.get("refresh_token")
    if not token:
        _clear_auth_cookies(response)
        return MessageResponse(message="No refresh token")

    new_access, new_refresh = auth_service.refresh(db, token)
    _set_auth_cookies(response, new_access, new_refresh)
    return MessageResponse(message="Tokens refreshed")


@router.post("/logout", response_model=MessageResponse)
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    # Best-effort: try to read session from access token and revoke it
    from core.security import decode_access_token
    token = request.cookies.get("access_token")
    if token:
        try:
            payload = decode_access_token(token)
            sid = payload.get("sid")
            if sid:
                auth_service.logout(db, UUID(sid))
        except Exception:
            pass  # token might already be expired — just clear cookies

    _clear_auth_cookies(response)
    return MessageResponse(message="Logged out")


@router.post("/verify-email", response_model=MessageResponse)
def verify_email(data: VerifyEmailRequest, db: Session = Depends(get_db)):
    auth_service.verify_user_email(db, data.token)
    return MessageResponse(message="Email verified successfully")


@router.post("/resend-verification", response_model=MessageResponse)
def resend_email_verification(data: ResendVerificationRequest, db: Session = Depends(get_db)):
    auth_service.resend_verification(db, data.email)
    return MessageResponse(message="If an account with that email exists, a verification email has been sent")


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    auth_service.forgot_password(db, data.email)
    return MessageResponse(message="If an account with that email exists, a password reset link has been sent")


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    auth_service.reset_password(db, data.token, data.new_password)
    return MessageResponse(message="Password reset successfully. Please log in again.")


# ---------------------------------------------------------------------------
# Google OAuth  (backend redirect flow)
# ---------------------------------------------------------------------------

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"


@router.get("/google")
def google_redirect():
    """Redirect user to Google's OAuth consent screen."""
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
    }
    return RedirectResponse(url=f"{GOOGLE_AUTH_URL}?{urlencode(params)}")


@router.get("/google/callback")
def google_callback(code: str, request: Request, db: Session = Depends(get_db)):
    """Handle Google's redirect back with an authorization code."""
    ip = request.client.host if request.client else None
    user_data, access, refresh = auth_service.google_login(db, code, ip)

    # Redirect to frontend with cookies set
    redirect = RedirectResponse(url=f"{settings.FRONTEND_URI}/auth/callback", status_code=302)
    _set_auth_cookies(redirect, access, refresh)
    return redirect


# ---------------------------------------------------------------------------
# Protected endpoints
# ---------------------------------------------------------------------------

@router.get("/me", response_model=UserResponse)
def me(user: User = Depends(get_current_user)):
    return auth_service._build_user_response(user)


@router.get("/sessions", response_model=list[SessionResponse])
def list_sessions(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    session_id = request.state.session_id
    return auth_service.get_user_sessions(db, user.id, session_id)


@router.delete("/sessions/{session_id}", response_model=MessageResponse)
def delete_session(
    session_id: UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    auth_service.revoke_session(db, session_id, user.id)
    return MessageResponse(message="Session revoked")