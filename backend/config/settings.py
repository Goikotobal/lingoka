"""
LingoKa Configuration Settings
"""
from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # App Info
    APP_NAME: str = "LingoKa"
    APP_VERSION: str = "0.1.0"

    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"

    # API Server
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000

    # AI Service API Keys
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    ELEVENLABS_API_KEY: Optional[str] = None

    # GCP Configuration
    GCP_PROJECT_ID: Optional[str] = None
    GOOGLE_APPLICATION_CREDENTIALS: Optional[str] = None

    # Database (Firestore collections)
    FIRESTORE_COLLECTION_USERS: str = "users"
    FIRESTORE_COLLECTION_LESSONS: str = "lessons"
    FIRESTORE_COLLECTION_PROGRESS: str = "progress"
    FIRESTORE_COLLECTION_SESSIONS: str = "sessions"

    # Security
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # LLM Configuration
    DEFAULT_LLM: str = "openai"
    DEFAULT_MODEL: str = "gpt-4-turbo-preview"
    TEMPERATURE: float = 0.7
    MAX_TOKENS: int = 2000

    # Speech Services
    WHISPER_MODEL: str = "whisper-1"
    ELEVENLABS_VOICE_ID: Optional[str] = None
    ELEVENLABS_MODEL_ID: str = "eleven_multilingual_v2"

    # Feature Flags
    ENABLE_VOICE: bool = True
    ENABLE_GAMIFICATION: bool = True
    ENABLE_ANALYTICS: bool = True

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
