"""
LingoKa - AI-Powered Language Learning Platform
Main FastAPI Application
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Optional
import uuid
from datetime import datetime

from .config.settings import get_settings
from .models.user import UserProfile, UserSession, UserProgress
from .models.message import ChatRequest, ChatResponse, ChatMessage, MessageRole
from .agents.director import DirectorAgent, route_user_message
from .agents.conversation import ConversationAgent

# Initialize settings
settings = get_settings()

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-Powered Multi-Agent Language Learning Platform"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (replace with Firestore in production)
active_sessions: Dict[str, UserSession] = {}
user_profiles: Dict[str, UserProfile] = {}
conversation_histories: Dict[str, List[ChatMessage]] = {}

# Agent instances
director_agent = DirectorAgent()


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "active",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "agents": {
            "director": "active",
            "conversation": "active",
            "pronunciation": "not_implemented",
            "reading": "not_implemented",
            "writing": "not_implemented",
            "progress": "not_implemented"
        },
        "services": {
            "openai": "configured" if settings.OPENAI_API_KEY else "missing",
            "elevenlabs": "configured" if settings.ELEVENLABS_API_KEY else "missing"
        }
    }


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint - processes user messages through multi-agent system.
    
    Flow:
    1. Director Agent analyzes message
    2. Routes to appropriate specialist agent
    3. Specialist generates response
    4. Response returned to user
    """
    
    try:
        # Get or create session
        session_id = request.session_id or str(uuid.uuid4())
        
        if session_id not in active_sessions:
            active_sessions[session_id] = UserSession(
                session_id=session_id,
                user_id=request.user_id,
                conversation_history=[],
                current_agent="director"
            )
        
        session = active_sessions[session_id]
        
        # Get conversation history
        history = conversation_histories.get(session_id, [])
        
        # Get user context
        user_context = None
        if request.user_id in user_profiles:
            profile = user_profiles[request.user_id]
            user_context = {
                "level": profile.current_level,
                "target_language": profile.target_language,
                "known_words": [],  # Would come from UserProgress
                "current_streak": profile.current_streak
            }
        
        # Route message through Director Agent
        routing_decision = await director_agent.route_message(
            message=request.message,
            conversation_history=history,
            user_context=user_context
        )
        
        # Get response from appropriate specialist agent
        response = await _get_agent_response(
            agent_name=routing_decision.target_agent,
            message=request.message,
            conversation_history=history,
            user_context=user_context,
            session_id=session_id
        )
        
        # Update session
        session.current_agent = routing_decision.target_agent
        session.conversation_history.append({
            "role": "user",
            "content": request.message,
            "timestamp": datetime.utcnow().isoformat()
        })
        session.conversation_history.append({
            "role": "assistant",
            "content": response.message,
            "timestamp": datetime.utcnow().isoformat(),
            "agent": routing_decision.target_agent
        })
        
        # Update conversation history
        if session_id not in conversation_histories:
            conversation_histories[session_id] = []
        
        conversation_histories[session_id].extend([
            ChatMessage(role=MessageRole.USER, content=request.message),
            ChatMessage(role=MessageRole.ASSISTANT, content=response.message)
        ])
        
        # Set session ID in response
        response.session_id = session_id
        response.routed_to = routing_decision.target_agent
        response.confidence = routing_decision.confidence
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat processing error: {str(e)}")


async def _get_agent_response(
    agent_name: str,
    message: str,
    conversation_history: List[ChatMessage],
    user_context: Dict,
    session_id: str
) -> ChatResponse:
    """Route to appropriate specialist agent and get response"""
    
    # Currently only Conversation Agent is implemented
    if agent_name == "conversation":
        agent = ConversationAgent(
            target_language=user_context.get("target_language", "hiligaynon") if user_context else "hiligaynon",
            user_level=user_context.get("level", "beginner") if user_context else "beginner"
        )
        return await agent.respond(message, conversation_history, user_context)
    
    # Fallback to conversation agent for unimplemented agents
    elif agent_name in ["pronunciation", "reading", "writing", "progress"]:
        # Return placeholder response
        return ChatResponse(
            message=f"The {agent_name} agent is coming soon! For now, let's practice conversation. {message}",
            agent_type=agent_name,
            session_id=session_id,
            routed_to=agent_name,
            confidence=0.5,
            feedback={"status": "agent_not_implemented"}
        )
    
    else:
        # Unknown agent, fallback to conversation
        agent = ConversationAgent()
        return await agent.respond(message, conversation_history, user_context)


@app.post("/users", response_model=UserProfile)
async def create_user(
    email: str,
    name: str,
    native_language: str = "english",
    target_language: str = "hiligaynon"
):
    """Create a new user profile"""
    
    user_id = str(uuid.uuid4())
    
    profile = UserProfile(
        user_id=user_id,
        email=email,
        name=name,
        native_language=native_language,
        target_language=target_language
    )
    
    user_profiles[user_id] = profile
    
    return profile


@app.get("/users/{user_id}", response_model=UserProfile)
async def get_user(user_id: str):
    """Get user profile"""
    
    if user_id not in user_profiles:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user_profiles[user_id]


@app.get("/sessions/{session_id}")
async def get_session(session_id: str):
    """Get session details"""
    
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return active_sessions[session_id]


@app.get("/sessions/{session_id}/history")
async def get_session_history(session_id: str):
    """Get conversation history for a session"""
    
    if session_id not in conversation_histories:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "session_id": session_id,
        "messages": [
            {
                "role": msg.role,
                "content": msg.content,
                "timestamp": msg.timestamp.isoformat()
            }
            for msg in conversation_histories[session_id]
        ]
    }


@app.delete("/sessions/{session_id}")
async def end_session(session_id: str):
    """End a session"""
    
    if session_id in active_sessions:
        session = active_sessions[session_id]
        session.is_active = False
        session.ended_at = datetime.utcnow()
        
        return {"message": "Session ended", "session_id": session_id}
    
    raise HTTPException(status_code=404, detail="Session not found")


@app.get("/agents")
async def list_agents():
    """List all available agents and their status"""
    return {
        "director": {
            "name": "Director Agent",
            "status": "active",
            "description": "Routes messages to specialist agents"
        },
        "conversation": {
            "name": "Conversation Practice Agent",
            "status": "active",
            "description": "Handles dialogue practice and general conversation"
        },
        "pronunciation": {
            "name": "Pronunciation Coach Agent",
            "status": "planned",
            "description": "Provides pronunciation feedback and coaching"
        },
        "reading": {
            "name": "Reading Comprehension Agent",
            "status": "planned",
            "description": "Handles reading practice and comprehension"
        },
        "writing": {
            "name": "Writing Tutor Agent",
            "status": "planned",
            "description": "Provides writing feedback and exercises"
        },
        "progress": {
            "name": "Progress Tracker Agent",
            "status": "planned",
            "description": "Tracks and reports user progress"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )