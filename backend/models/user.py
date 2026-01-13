"""
LingoKa User Models
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class LanguageLevel(str, Enum):
    BEGINNER = "beginner"
    ELEMENTARY = "elementary"
    INTERMEDIATE = "intermediate"
    UPPER_INTERMEDIATE = "upper_intermediate"
    ADVANCED = "advanced"
    NATIVE = "native"


class UserProfile(BaseModel):
    """User profile information"""
    user_id: str
    email: str
    name: str
    native_language: str = "english"
    target_language: str = "hiligaynon"
    current_level: LanguageLevel = LanguageLevel.BEGINNER
    current_streak: int = 0
    total_xp: int = 0
    energy: int = 100
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    preferences: Dict[str, Any] = Field(default_factory=dict)


class UserSession(BaseModel):
    """Active user session"""
    session_id: str
    user_id: Optional[str] = None
    conversation_history: List[Dict[str, Any]] = Field(default_factory=list)
    current_agent: str = "director"
    is_active: bool = True
    started_at: datetime = Field(default_factory=datetime.utcnow)
    ended_at: Optional[datetime] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class UserProgress(BaseModel):
    """User learning progress tracking"""
    user_id: str
    target_language: str
    level: LanguageLevel = LanguageLevel.BEGINNER
    total_lessons_completed: int = 0
    total_practice_minutes: int = 0
    vocabulary_learned: List[str] = Field(default_factory=list)
    grammar_points_learned: List[str] = Field(default_factory=list)
    pronunciation_score: float = 0.0
    reading_score: float = 0.0
    writing_score: float = 0.0
    conversation_score: float = 0.0
    weak_areas: List[str] = Field(default_factory=list)
    strong_areas: List[str] = Field(default_factory=list)
    last_practice_at: Optional[datetime] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)
