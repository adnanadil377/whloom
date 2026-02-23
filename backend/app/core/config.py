from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str
    DATABASE_URL: str
    ALGORITHM: str
    SECRET_KEY: str
    REFRESH_KEY: str

    R2_ACCOUNT_ID: str
    R2_ACCESS_KEY: str
    R2_SECRET_KEY: str
    R2_BUCKET_NAME: str = "burner-video"

    # Email address used as the sender for outbound application emails
    EMAIL_ADDRESS: str
    # Password or app-specific token for authenticating with the SMTP server
    EMAIL_PASSWORD: str
    # Hostname of the SMTP server used to send emails
    SMTP_SERVER: str
    # Port of the SMTP server (e.g. 587 for STARTTLS, 465 for SSL)
    SMTP_PORT: int

    # Base URL of the frontend application used when generating links in emails or redirects
    FRONTEND_URI: str
    # Set to True in production with HTTPS to enable secure cookie flag
    COOKIE_SECURE: bool = False

    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/v1/auth/google/callback"

    # Token expiry
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    EMAIL_VERIFICATION_EXPIRE_HOURS: int = 24
    PASSWORD_RESET_EXPIRE_MINUTES: int = 30

    GOOGLE_TOKEN_URL: str = "https://oauth2.googleapis.com/token"
    GOOGLE_USERINFO_URL: str = "https://www.googleapis.com/oauth2/v2/userinfo"

    class Config:
        env_file = "../.env.local"

settings = Settings()
