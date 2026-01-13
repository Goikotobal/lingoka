"""
LingoKa Conversation Practice Agent
Handles natural dialogue practice in the target language.
Updated for Hiligaynon as the primary language.
"""
from typing import Optional, List, Dict, Any
from openai import AsyncOpenAI
from ..config.settings import get_settings
from ..models.message import ChatMessage, ChatResponse
from ..languages.hiligaynon import HiligaynonModule, get_hiligaynon_module

settings = get_settings()


class ConversationAgent:
    """
    Conversation Practice Agent

    Responsibilities:
    - Engage in natural dialogue in Hiligaynon (Ilonggo)
    - Provide gentle corrections without breaking conversation flow
    - Adapt to user's proficiency level
    - Include cultural context and explanations
    - Use the Hiligaynon language module for accurate content
    """

    HILIGAYNON_SYSTEM_PROMPT = """You are a friendly and patient Hiligaynon (Ilonggo) language tutor for LingoKa.

## About Hiligaynon
Hiligaynon is spoken by 9-10 million people in the Western Visayas region of the Philippines (Iloilo, Negros Occidental, Guimaras, Capiz). It's known as one of the sweetest, most melodic Philippine languages.

## Current User Level: {user_level}

## Your Teaching Approach:

### For BEGINNERS:
- Always provide translations in parentheses
- Use simple sentences
- Introduce one or two new words per response
- Include pronunciation guides: "Maayong aga (mah-AH-yong AH-gah) - Good morning"
- Explain the 'gid' emphasis particle (adds "very/really")
- Focus on greetings, basic questions, numbers, and essential phrases

### For INTERMEDIATE:
- Mix Hiligaynon and English more naturally
- Introduce more complex grammar
- Use common expressions and idioms
- Reduce translations for previously learned words
- Introduce cultural context more deeply

### For ADVANCED:
- Primarily use Hiligaynon
- Include regional variations and colloquialisms
- Discuss nuanced cultural topics
- Challenge with complex sentences and expressions

## Key Hiligaynon Features to Teach:

1. **Greetings** (time-based):
   - Maayong aga (Good morning)
   - Maayong udto (Good noon)
   - Maayong hapon (Good afternoon)
   - Maayong gab-i (Good evening)

2. **Essential Phrases**:
   - Kumusta ka? (How are you? - informal)
   - Kumusta kamo? (How are you? - formal/plural)
   - Maayo man (I'm fine)
   - Salamat / Salamat gid (Thank you / Thank you very much)
   - Palihog (Please)
   - Pasensya na (I'm sorry/Excuse me)
   - Paalam na (Goodbye)

3. **The 'Gid' Emphasis**:
   - 'Gid' adds emphasis like "very" or "really"
   - Maayo gid (Very good), Salamat gid (Thank you very much)

4. **Respect Markers**:
   - Use 'kamo' instead of 'ka' for elders/respect
   - The 'mano po' blessing gesture

5. **Pronunciation Tips**:
   - Vowels: a=ah, e=eh, i=ee, o=oh, u=oo
   - 'ng' can start words (ngalan = name)
   - Stress usually on second-to-last syllable
   - Gentle, melodic flow

6. **Cultural Context**:
   - "Kaon na ta!" (Let's eat!) - common hospitality phrase
   - Ilonggos are known for warmth and hospitality
   - Food sharing is a key cultural value

## Response Guidelines:
1. Be encouraging and supportive - celebrate small wins!
2. Correct mistakes gently by modeling correct usage
3. Always include pronunciation for new words
4. Share cultural insights when relevant
5. End responses with a question or prompt to continue learning
6. Use the phrase "Maayo gid!" (Very good!) for encouragement

Remember: Make learning fun and engaging! Hiligaynon is called the "language of love" for its sweet sound - help learners appreciate its beauty."""

    PRACTICE_PROMPTS = {
        "beginner": [
            "Let's practice greetings! How would you greet someone in the morning?",
            "Try introducing yourself. Say: 'Ang ngalan ko si [your name]' (My name is...)",
            "Let's count! Can you say the numbers 1-5? Isa, duha, tatlo, apat, lima!",
            "How do you say 'Thank you very much' in Hiligaynon?",
            "Practice asking: 'Kumusta ka?' (How are you?)"
        ],
        "intermediate": [
            "Describe your day using Hiligaynon phrases you've learned.",
            "Practice ordering food: 'Pila ini?' (How much is this?)",
            "Tell me about your family using: nanay, tatay, utod",
            "Use 'Pwede bala...?' to ask for permission politely."
        ],
        "advanced": [
            "Discuss a Filipino festival in Hiligaynon.",
            "Share a story using past and future tenses.",
            "Explain a cultural difference you've noticed."
        ]
    }

    def __init__(
        self,
        target_language: str = "hiligaynon",
        user_level: str = "beginner"
    ):
        self.target_language = target_language
        self.user_level = user_level
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
        self.hiligaynon = get_hiligaynon_module()

    async def respond(
        self,
        message: str,
        conversation_history: List[ChatMessage] = None,
        user_context: Dict[str, Any] = None
    ) -> ChatResponse:
        """Generate a conversational response for Hiligaynon learning"""

        # Update context if provided
        if user_context:
            self.target_language = user_context.get("target_language", self.target_language)
            self.user_level = user_context.get("level", self.user_level)

        # Check for specific learning requests
        message_lower = message.lower()

        # Handle specific learning queries with the language module
        # Order matters: check more specific keywords before generic ones

        # Pronunciation - check first as it's specific
        if any(word in message_lower for word in ["pronounce", "pronunciation", "how to say", "sound like"]):
            return await self._teach_pronunciation(message, conversation_history, user_context)

        # Culture - specific topic
        if any(word in message_lower for word in ["culture", "cultural", "tradition", "festival", "custom"]):
            return await self._teach_culture(message, conversation_history, user_context)

        # Exercise/Quiz - specific request
        if any(word in message_lower for word in ["exercise", "quiz", "test me", "practice quiz"]):
            return await self._give_exercise(message, conversation_history, user_context)

        # Numbers - specific topic
        if any(word in message_lower for word in ["number", "count", "counting", "how many", "pila"]):
            return await self._teach_numbers(message, conversation_history, user_context)

        # Phrases - specific topic
        if any(word in message_lower for word in ["phrase", "phrases", "useful phrase", "common phrase", "expression"]):
            return await self._teach_phrases(message, conversation_history, user_context)

        # Greetings - check after other specific topics
        if any(word in message_lower for word in ["greeting", "greetings", "hello", "hi ", "good morning", "maayong", "kumusta"]):
            return await self._teach_greetings(message, conversation_history, user_context)

        # General conversation - use LLM
        return await self._general_conversation(message, conversation_history, user_context)

    async def _general_conversation(
        self,
        message: str,
        conversation_history: List[ChatMessage] = None,
        user_context: Dict[str, Any] = None
    ) -> ChatResponse:
        """Handle general conversation using LLM"""

        # Build conversation messages
        messages = [
            {
                "role": "system",
                "content": self.HILIGAYNON_SYSTEM_PROMPT.format(user_level=self.user_level)
            }
        ]

        # Add conversation history
        if conversation_history:
            for msg in conversation_history[-10:]:
                messages.append({
                    "role": msg.role.value if hasattr(msg.role, 'value') else msg.role,
                    "content": msg.content
                })

        # Add current message
        messages.append({"role": "user", "content": message})

        if not self.client:
            return self._fallback_response(message)

        try:
            response = await self.client.chat.completions.create(
                model=settings.DEFAULT_MODEL,
                messages=messages,
                max_tokens=settings.MAX_TOKENS,
                temperature=settings.TEMPERATURE
            )

            assistant_message = response.choices[0].message.content

            return ChatResponse(
                message=assistant_message,
                agent_type="conversation",
                confidence=0.9,
                feedback={"level": self.user_level, "language": "hiligaynon"}
            )

        except Exception as e:
            return self._fallback_response(message)

    async def _teach_greetings(
        self,
        message: str,
        conversation_history: List[ChatMessage] = None,
        user_context: Dict[str, Any] = None
    ) -> ChatResponse:
        """Teach Hiligaynon greetings"""

        greetings = self.hiligaynon.GREETINGS[:8]  # Main greetings

        response_text = "**Maayong aga! Let's learn Hiligaynon greetings!** 🌅\n\n"
        response_text += "Hiligaynon greetings change based on the time of day:\n\n"

        for g in greetings:
            response_text += f"**{g.hiligaynon}** - {g.english}\n"
            response_text += f"   *Pronunciation: {g.pronunciation}*\n"
            if g.context:
                response_text += f"   _{g.context}_\n"
            response_text += "\n"

        response_text += "---\n"
        response_text += "**Cultural Tip:** 'Gid' adds emphasis! 'Salamat gid' = Thank you VERY much!\n\n"
        response_text += "**Try it:** How would you greet someone in the afternoon? 🤔"

        vocabulary = [
            {"word": g.hiligaynon, "translation": g.english}
            for g in greetings[:5]
        ]

        return ChatResponse(
            message=response_text,
            agent_type="conversation",
            confidence=0.95,
            vocabulary=vocabulary,
            feedback={"topic": "greetings", "level": self.user_level}
        )

    async def _teach_numbers(
        self,
        message: str,
        conversation_history: List[ChatMessage] = None,
        user_context: Dict[str, Any] = None
    ) -> ChatResponse:
        """Teach Hiligaynon numbers"""

        numbers = self.hiligaynon.VOCABULARY["numbers"]

        response_text = "**Let's count in Hiligaynon!** 🔢\n\n"
        response_text += "Numbers 1-10:\n\n"

        for num in numbers:
            response_text += f"**{num.word}** ({num.pronunciation}) = {num.english}\n"

        response_text += "\n---\n"
        response_text += "**Useful phrase:** 'Pila ini?' (PEE-lah ee-NEE) = How much is this?\n\n"
        response_text += "**Practice:** Try counting from isa to lima (1 to 5)! 🎯"

        vocabulary = [
            {"word": n.word, "translation": n.english}
            for n in numbers
        ]

        return ChatResponse(
            message=response_text,
            agent_type="conversation",
            confidence=0.95,
            vocabulary=vocabulary,
            feedback={"topic": "numbers", "level": self.user_level}
        )

    async def _teach_pronunciation(
        self,
        message: str,
        conversation_history: List[ChatMessage] = None,
        user_context: Dict[str, Any] = None
    ) -> ChatResponse:
        """Teach Hiligaynon pronunciation"""

        guide = self.hiligaynon.PRONUNCIATION_GUIDE

        response_text = "**Hiligaynon Pronunciation Guide** 🗣️\n\n"

        response_text += "**Vowels:**\n"
        for vowel, info in guide["vowels"].items():
            response_text += f"- **{vowel}** = '{info['sound']}' ({info['example']})\n"
            response_text += f"  Example: *{info['hiligaynon_example']}*\n"

        response_text += "\n**Special Consonants:**\n"
        for cons, info in guide["consonants"].items():
            response_text += f"- **{cons}** = {info['example']}\n"
            response_text += f"  Example: *{info['hiligaynon_example']}*\n"

        response_text += "\n**Key Tips:**\n"
        for tip in guide["tips"]:
            response_text += f"- {tip}\n"

        response_text += "\n**Fun fact:** Hiligaynon is called the 'language of love' because of its sweet, melodic sound! 💕"

        return ChatResponse(
            message=response_text,
            agent_type="conversation",
            confidence=0.95,
            feedback={"topic": "pronunciation", "level": self.user_level}
        )

    async def _teach_culture(
        self,
        message: str,
        conversation_history: List[ChatMessage] = None,
        user_context: Dict[str, Any] = None
    ) -> ChatResponse:
        """Teach cultural context"""

        notes = self.hiligaynon.CULTURAL_NOTES
        import random
        note = random.choice(notes)

        response_text = f"**Cultural Insight: {note.title}** 🇵🇭\n\n"
        response_text += f"{note.content}\n\n"

        if note.related_phrases:
            response_text += "**Related phrases:**\n"
            for phrase in note.related_phrases:
                # Find the phrase details
                for p in self.hiligaynon.GREETINGS + self.hiligaynon.COMMON_PHRASES:
                    if p.hiligaynon == phrase:
                        response_text += f"- **{p.hiligaynon}** ({p.pronunciation}) - {p.english}\n"
                        break
                else:
                    response_text += f"- **{phrase}**\n"

        response_text += "\n---\n"
        response_text += "Understanding culture makes language learning richer! Want to learn about another cultural aspect? 🌺"

        return ChatResponse(
            message=response_text,
            agent_type="conversation",
            confidence=0.95,
            feedback={"topic": "culture", "cultural_note": note.title}
        )

    async def _give_exercise(
        self,
        message: str,
        conversation_history: List[ChatMessage] = None,
        user_context: Dict[str, Any] = None
    ) -> ChatResponse:
        """Give a practice exercise"""

        from ..languages.hiligaynon import DifficultyLevel

        # Map user level to difficulty
        difficulty_map = {
            "beginner": DifficultyLevel.BEGINNER,
            "elementary": DifficultyLevel.ELEMENTARY,
            "intermediate": DifficultyLevel.INTERMEDIATE,
            "advanced": DifficultyLevel.ADVANCED
        }
        difficulty = difficulty_map.get(self.user_level, DifficultyLevel.BEGINNER)

        exercise = self.hiligaynon.get_random_exercise(difficulty)

        response_text = f"**Practice Time!** 📝\n\n"
        response_text += f"**Type:** {exercise.exercise_type.replace('_', ' ').title()}\n"
        response_text += f"**Difficulty:** {exercise.difficulty.value.title()}\n\n"
        response_text += f"**Question:** {exercise.question}\n\n"

        if exercise.options:
            response_text += "**Options:**\n"
            for i, opt in enumerate(exercise.options, 1):
                response_text += f"  {i}. {opt}\n"

        response_text += "\n*Take your time and try to answer! I'll help if you need hints.* 💪"

        return ChatResponse(
            message=response_text,
            agent_type="conversation",
            confidence=0.95,
            feedback={
                "topic": "exercise",
                "exercise_type": exercise.exercise_type,
                "correct_answer": exercise.correct_answer,
                "explanation": exercise.explanation
            }
        )

    async def _teach_phrases(
        self,
        message: str,
        conversation_history: List[ChatMessage] = None,
        user_context: Dict[str, Any] = None
    ) -> ChatResponse:
        """Teach common phrases"""

        import random
        phrases = random.sample(self.hiligaynon.COMMON_PHRASES, min(6, len(self.hiligaynon.COMMON_PHRASES)))

        response_text = "**Useful Hiligaynon Phrases** 💬\n\n"

        for p in phrases:
            response_text += f"**{p.hiligaynon}**\n"
            response_text += f"*{p.pronunciation}*\n"
            response_text += f"English: {p.english}\n"
            if p.literal:
                response_text += f"Literal: {p.literal}\n"
            if p.context:
                response_text += f"_{p.context}_\n"
            response_text += "\n"

        response_text += "---\n"
        response_text += "**Tip:** Try using 'Palihog' (please) to make requests more polite!\n\n"
        response_text += "Which phrase would you like to practice? 🎯"

        vocabulary = [
            {"word": p.hiligaynon, "translation": p.english}
            for p in phrases
        ]

        return ChatResponse(
            message=response_text,
            agent_type="conversation",
            confidence=0.95,
            vocabulary=vocabulary,
            feedback={"topic": "common_phrases", "level": self.user_level}
        )

    def _fallback_response(self, message: str) -> ChatResponse:
        """Provide a fallback response when API is unavailable"""

        message_lower = message.lower()

        if any(word in message_lower for word in ["hello", "hi", "hey", "kumusta", "maayong"]):
            response = (
                "**Maayong aga!** (mah-AH-yong AH-gah) - Good morning!\n\n"
                "Welcome to Hiligaynon learning! Here are some basic greetings:\n\n"
                "- **Kumusta ka?** (koo-MOOS-tah kah) - How are you?\n"
                "- **Maayo man** (mah-AH-yoh mahn) - I'm fine\n"
                "- **Salamat** (sah-LAH-maht) - Thank you\n\n"
                "Try responding to 'Kumusta ka?' with 'Maayo man, salamat!'"
            )
        elif any(word in message_lower for word in ["thank", "salamat"]):
            response = (
                "**Wala sapayan!** (wah-LAH sah-PAH-yahn) - You're welcome!\n\n"
                "Great job using Hiligaynon! Remember:\n"
                "- **Salamat** = Thank you\n"
                "- **Salamat gid** = Thank you very much (gid adds emphasis!)\n\n"
                "Keep practicing! Maayo gid! (Very good!)"
            )
        elif any(word in message_lower for word in ["bye", "goodbye", "paalam"]):
            response = (
                "**Paalam na!** (pah-AH-lahm nah) - Goodbye!\n\n"
                "Great practice today! Remember:\n"
                "- **Paalam na** = Goodbye (literally: 'asking permission to leave')\n"
                "- **Hasta la byernes** = See you on Friday (Spanish influence!)\n\n"
                "See you next time! Maayo gid ang practice mo! (Your practice was very good!)"
            )
        else:
            response = (
                "**Maayo gid!** Let's learn Hiligaynon together!\n\n"
                "I can help you with:\n"
                "- **Greetings** - Say 'teach me greetings'\n"
                "- **Numbers** - Say 'teach me numbers'\n"
                "- **Pronunciation** - Say 'how do I pronounce...'\n"
                "- **Common phrases** - Say 'useful phrases'\n"
                "- **Practice exercises** - Say 'give me an exercise'\n"
                "- **Culture** - Say 'tell me about culture'\n\n"
                "Ano ang gusto mo mahibal-an? (What would you like to learn?)"
            )

        return ChatResponse(
            message=response,
            agent_type="conversation",
            confidence=0.7,
            feedback={"mode": "fallback", "api_available": False, "language": "hiligaynon"}
        )
