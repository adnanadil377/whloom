"""
FastAPI dependencies for extracting and validating the current user
from HTTP-only cookies (stateful JWT).
"""

from uuid import UUID

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session as DBSession

from core.security import decode_access_token
from db.session import get_db
from models.user import Session as SessionModel, User


def get_current_user(
    request: Request,
    db: DBSession = Depends(get_db),
) -> User:
    """
    Read the access_token cookie → decode JWT → verify the session is
    still active in the DB → return the User ORM object.
    """
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")

    try:
        payload = decode_access_token(token)
    except Exception:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token")

    user_id = payload.get("sub")
    session_id = payload.get("sid")
    if not user_id or not session_id:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Malformed token")

    # Stateful check: session must still be active
    session = db.query(SessionModel).filter(SessionModel.id == UUID(session_id)).first()
    if not session or session.revoked_at is not None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Session revoked")

    user = db.query(User).filter(User.id == UUID(user_id)).first()
    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not found")

    # Stash session_id on the request so endpoints can use it
    request.state.session_id = UUID(session_id)
    return user


def get_current_verified_user(
    user: User = Depends(get_current_user),
) -> User:
    """Ensures the current user has verified their email."""
    if not user.email_verified:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            "Email not verified. Please verify your email first.",
        )
    return user
