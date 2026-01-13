"""
LingoKa Message Models
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum


class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class ChatMessage(BaseModel):
    """Individual chat message"""
    role: MessageRole
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ChatRequest(BaseModel):
    """Incoming chat request"""
    message: str
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    language: str = "japanese"
    include_audio: bool = False
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ChatResponse(BaseModel):
    """Chat response from agent"""
    message: str
    agent_type: str = "conversation"
    session_id: Optional[str] = None
    routed_to: Optional[str] = None
    confidence: float = 1.0
    audio_url: Optional[str] = None
    feedback: Dict[str, Any] = Field(default_factory=dict)
    suggestions: List[str] = Field(default_factory=list)
    vocabulary: List[Dict[str, str]] = Field(default_factory=list)
    grammar_notes: List[str] = Field(default_factory=list)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
