from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, func, text, Enum as SQLEnum, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, declarative_base, declared_attr
import enum
from db.base import Base


class Provider(str, enum.Enum):
    GOOGLE = "google"
    EMAIL = "email"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    email = Column(String, unique=True, index=True, nullable=False)
    email_verified = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    user_type = Column(String, nullable=False)

    identities = relationship("AuthIdentity", back_populates="user", cascade="all, delete-orphan")
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")

    __mapper_args__ = {
        "polymorphic_identity": "user",
        "polymorphic_on": user_type,
    }


class Business(User):
    __tablename__ = "businesses"
    
    id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    
    company_name = Column(String)
    tax_id = Column(String)

    __mapper_args__ = {
        "polymorphic_identity": "business",
    }

class Creator(User):
    __tablename__ = "creators"
    
    id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    
    username = Column(String, unique=True)
    instagram_url = Column(String)
    youtube_url = Column(String)

    __mapper_args__ = {
        "polymorphic_identity": "creator",
    }


class AuthIdentity(Base):
    __tablename__ = "auth_identities"
    __table_args__ = (UniqueConstraint("provider", "provider_user_id", name="uq_auth_identity_provider_uid"),)
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    provider = Column(SQLEnum(Provider, name="provider_enum"), nullable=False)
    provider_user_id = Column(String, nullable=False)
    password_hashed = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="identities")

class Session(Base):
    __tablename__ = "sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    expired_at = Column(DateTime(timezone=True))
    revoked_at = Column(DateTime(timezone=True))
    ip_address = Column(String)

    user = relationship("User", back_populates="sessions")

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    token_hashed = Column(String, unique=True, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    expired_at = Column(DateTime(timezone=True))
    revoked_at = Column(DateTime(timezone=True))
    
    session_id = Column(UUID(as_uuid=True), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False, index=True)

    user = relationship("User", back_populates="refresh_tokens")