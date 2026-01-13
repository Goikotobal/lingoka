"""
LingoKa Director Agent
Routes user messages to the appropriate specialist agent.
"""
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from openai import AsyncOpenAI
from ..config.settings import get_settings
from ..models.message import ChatMessage

settings = get_settings()


class RoutingDecision(BaseModel):
    """Decision about which agent should handle a message"""
    target_agent: str
    confidence: float
    reasoning: str


class DirectorAgent:
    """
    Director Agent - The orchestrator of the multi-agent system.

    Responsibilities:
    - Analyze user intent
    - Route to appropriate specialist agent
    - Maintain conversation context
    - Handle agent handoffs
    """

    AGENT_DESCRIPTIONS = {
        "conversation": "General dialogue practice, greetings, casual conversation, and basic language practice",
        "pronunciation": "Pronunciation practice, accent training, phonetic feedback, speaking exercises",
        "reading": "Reading comprehension, text analysis, vocabulary in context, grammar from texts",
        "writing": "Writing practice, character writing (kanji/hiragana/katakana), composition, typing",
        "progress": "Progress tracking, statistics, achievements, learning recommendations"
    }

    ROUTING_PROMPT = """You are a routing agent for LingoKa, an AI language learning platform.
Your job is to analyze the user's message and decide which specialist agent should handle it.

Available agents:
- conversation: General dialogue practice, greetings, casual conversation, basic language practice
- pronunciation: Pronunciation practice, accent training, phonetic feedback, speaking exercises
- reading: Reading comprehension, text analysis, vocabulary in context, grammar from texts
- writing: Writing practice, character writing, composition, typing exercises
- progress: Progress tracking, statistics, achievements, learning recommendations

User message: {message}

Previous conversation context: {context}

Respond with ONLY the agent name (one of: conversation, pronunciation, reading, writing, progress).
If unsure, default to "conversation"."""

    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

    async def route_message(
        self,
        message: str,
        conversation_history: List[ChatMessage] = None,
        user_context: Dict[str, Any] = None
    ) -> RoutingDecision:
        """
        Analyze user message and determine which specialist agent should handle it.

        Strategy: Use keyword routing first for reliability, fall back to LLM for ambiguous cases.
        Since most specialist agents aren't implemented yet, we route most things to conversation.
        """
        # First, try keyword-based routing - more reliable for language learning requests
        keyword_result = self._keyword_routing(message)

        # If we got a confident keyword match, use it
        if keyword_result.confidence >= 0.7:
            return keyword_result

        # For low confidence, could use LLM, but for now just use conversation
        # since most specialist agents aren't implemented yet
        return RoutingDecision(
            target_agent="conversation",
            confidence=0.7,
            reasoning="Default routing to conversation agent"
        )

    def _keyword_routing(self, message: str) -> RoutingDecision:
        """Simple keyword-based routing as fallback"""
        message_lower = message.lower()

        # Learning/teaching keywords - route to conversation for language teaching
        # This catches most common learning requests
        if any(word in message_lower for word in [
            "teach", "learn", "how do you say", "what is", "translate",
            "greeting", "greetings", "hello", "number", "numbers", "count", "counting",
            "phrase", "phrases", "vocabulary", "word", "words", "mean", "meaning",
            "culture", "cultural", "exercise", "practice", "quiz", "lesson",
            "hiligaynon", "ilonggo", "kumusta", "maayong", "salamat"
        ]):
            return RoutingDecision(
                target_agent="conversation",
                confidence=0.85,
                reasoning="Keyword match: learning/teaching request"
            )

        # Progress keywords - specific progress tracking requests
        if any(word in message_lower for word in ["my progress", "my stats", "my score", "my level", "my streak", "achievement", "how am i doing"]):
            return RoutingDecision(
                target_agent="progress",
                confidence=0.7,
                reasoning="Keyword match: progress-related"
            )

        # Pronunciation keywords - specific pronunciation practice
        if any(word in message_lower for word in ["pronounce", "pronunciation guide", "accent", "how to say"]):
            return RoutingDecision(
                target_agent="conversation",  # Route to conversation since it handles pronunciation teaching
                confidence=0.8,
                reasoning="Keyword match: pronunciation-related (handled by conversation)"
            )

        # Default to conversation for all other cases
        return RoutingDecision(
            target_agent="conversation",
            confidence=0.7,
            reasoning="Default routing to conversation agent"
        )


async def route_user_message(
    message: str,
    conversation_history: List[ChatMessage] = None,
    user_context: Dict[str, Any] = None
) -> RoutingDecision:
    """Convenience function to route a message"""
    director = DirectorAgent()
    return await director.route_message(message, conversation_history, user_context)
