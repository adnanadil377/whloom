"""
Pydantic request / response schemas for authentication.
"""

from __future__ import annotations

import re
from datetime import datetime
from typing import Literal, Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, field_validator, model_validator


# ---------------------------------------------------------------------------
# Requests
# ---------------------------------------------------------------------------

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    user_type: Literal["creator", "business"]

    # Creator-specific
    username: Optional[str] = None
    instagram_url: Optional[str] = None
    youtube_url: Optional[str] = None

    # Business-specific
    company_name: Optional[str] = None
    tax_id: Optional[str] = None

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise ValueError("Password must contain at least one special character")
        return v

    @model_validator(mode="after")
    def check_type_fields(self) -> SignupRequest:
        if self.user_type == "creator" and not self.username:
            raise ValueError("username is required for creator accounts")
        if self.user_type == "business" and not self.company_name:
            raise ValueError("company_name is required for business accounts")
        return self


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise ValueError("Password must contain at least one special character")
        return v


class VerifyEmailRequest(BaseModel):
    token: str


class ResendVerificationRequest(BaseModel):
    email: EmailStr


# ---------------------------------------------------------------------------
# Responses
# ---------------------------------------------------------------------------

class UserResponse(BaseModel):
    id: UUID
    email: str
    email_verified: bool
    user_type: str
    created_at: datetime

    # Creator fields
    username: Optional[str] = None
    instagram_url: Optional[str] = None
    youtube_url: Optional[str] = None

    # Business fields
    company_name: Optional[str] = None
    tax_id: Optional[str] = None

    model_config = {"from_attributes": True}


class AuthResponse(BaseModel):
    user: UserResponse
    message: str


class MessageResponse(BaseModel):
    message: str


class SessionResponse(BaseModel):
    id: UUID
    created_at: datetime
    ip_address: Optional[str] = None
    is_current: bool = False

    model_config = {"from_attributes": True}
