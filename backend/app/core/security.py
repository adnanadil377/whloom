"""
JWT token management, password hashing, and email token utilities.
"""

from datetime import datetime, timedelta, timezone
from uuid import uuid4, UUID
import hashlib

from jose import jwt, JWTError, ExpiredSignatureError
from passlib.context import CryptContext
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired

from core.config import settings

# ---------------------------------------------------------------------------
# Password hashing (bcrypt)
# ---------------------------------------------------------------------------

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# ---------------------------------------------------------------------------
# JWT – Access Token
# ---------------------------------------------------------------------------

def create_access_token(user_id: UUID, session_id: UUID) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),
        "sid": str(session_id),
        "type": "access",
        "iat": now,
        "exp": now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> dict:
    """Decode an access JWT. Raises JWTError / ExpiredSignatureError on failure."""
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    if payload.get("type") != "access":
        raise JWTError("Invalid token type")
    return payload


# ---------------------------------------------------------------------------
# JWT – Refresh Token
# ---------------------------------------------------------------------------

def create_refresh_token(user_id: UUID, session_id: UUID) -> tuple[str, str]:
    """
    Returns (encoded_jwt, jti).
    The caller should hash `jti` before storing in the database.
    """
    jti = uuid4().hex
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),
        "sid": str(session_id),
        "jti": jti,
        "type": "refresh",
        "iat": now,
        "exp": now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    }
    encoded = jwt.encode(payload, settings.REFRESH_KEY, algorithm=settings.ALGORITHM)
    return encoded, jti


def decode_refresh_token(token: str) -> dict:
    """Decode a refresh JWT. Raises JWTError / ExpiredSignatureError on failure."""
    payload = jwt.decode(token, settings.REFRESH_KEY, algorithms=[settings.ALGORITHM])
    if payload.get("type") != "refresh":
        raise JWTError("Invalid token type")
    return payload


# ---------------------------------------------------------------------------
# Token hashing (SHA-256 for storing refresh token fingerprints)
# ---------------------------------------------------------------------------

def hash_token(raw: str) -> str:
    return hashlib.sha256(raw.encode()).hexdigest()


# ---------------------------------------------------------------------------
# Signed email tokens (verification & password reset)
# ---------------------------------------------------------------------------

_serializer = URLSafeTimedSerializer(settings.SECRET_KEY)


def generate_email_token(email: str, salt: str = "email-confirm") -> str:
    return _serializer.dumps(email, salt=salt)


def verify_email_token(token: str, salt: str = "email-confirm", max_age: int = 86400) -> str | None:
    """
    Returns the email address if valid, or None.
    max_age is in seconds (default 24 h).
    """
    try:
        return _serializer.loads(token, salt=salt, max_age=max_age)
    except (BadSignature, SignatureExpired):
        return None
