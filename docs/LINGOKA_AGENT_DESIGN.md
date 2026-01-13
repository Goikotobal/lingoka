# Lingoka - Agent Design Specifications

This document provides detailed specifications for each AI agent in the Lingoka system, including prompts, logic, and implementation guidance.

## Agent Design Principles

1. **Specialization**: Each agent focuses on a specific learning aspect
2. **Composability**: Agents work together seamlessly through the Director
3. **Adaptability**: Agents adjust to user's level and progress
4. **Context-Awareness**: Agents maintain conversation and learning context
5. **Pedagogically Sound**: Based on language learning best practices

## Director Agent

### Core Responsibilities
- Route user inputs to appropriate specialist agents
- Maintain conversation coherence across agent switches
- Track user state and learning progress
- Synthesize multi-agent responses
- Handle error recovery

### State Schema
```python
class DirectorState:
    user_id: str
    session_id: str
    language: str  # "japanese" or "hiligaynon"
    current_lesson: Optional[str]
    learning_level: str  # "beginner", "intermediate", "advanced"
    conversation_history: List[Message]
    active_skill: str  # "speaking", "listening", "reading", "writing"
    lesson_progress: float  # 0.0 to 1.0
    user_energy: int  # gamification (0-100)
    context: Dict[str, Any]
```

### System Prompt
```python
DIRECTOR_PROMPT = """You are the Director Agent for Lingoka, an AI language learning platform.

Your role is to:
1. Understand the user's learning intent and needs
2. Route requests to specialist agents (Conversation, Pronunciation, Reading, Writing, Progress)
3. Maintain conversation flow and context
4. Adapt to the user's learning level and progress
5. Ensure pedagogically sound learning experiences

Current Session Context:
- User: {user_name}
- Language: {language}
- Level: {level}
- Current Lesson: {lesson_title}
- Active Skill: {active_skill}
- Progress: {lesson_progress}%

Available Specialist Agents:
- ConversationAgent: For dialogue practice and Q&A
- PronunciationAgent: For speech analysis and feedback
- ReadingAgent: For comprehension and grammar
- WritingAgent: For character learning and composition
- ProgressAgent: For performance tracking and recommendations

Decision Guidelines:
- If user speaks/sends audio → invoke PronunciationAgent
- If user asks questions about grammar/vocabulary → invoke ConversationAgent
- If lesson mode is "reading" → invoke ReadingAgent
- If lesson mode is "writing" → invoke WritingAgent
- If user asks about progress/stats → invoke ProgressAgent
- Default → ConversationAgent

Always:
- Keep responses encouraging and motivating
- Adapt difficulty based on user performance
- Provide cultural context where relevant
- Maintain natural conversation flow

User Input: {user_input}
"""
```

### Routing Logic
```python
def route_to_agent(user_input, state):
    """Determine which agent(s) to invoke"""
    
    # Check input type
    if user_input.has_audio():
        return ["pronunciation"]
    
    # Check intent keywords
    intents = {
        "progress": ["how am i doing", "my progress", "stats", "achievements"],
        "grammar": ["what is", "how do you say", "explain", "grammar"],
        "practice": ["let's practice", "talk about", "conversation"],
        "reading": ["read", "text", "passage"],
        "writing": ["write", "characters", "kanji", "hiragana"]
    }
    
    detected_intent = detect_intent(user_input.text, intents)
    
    # Route based on intent and lesson mode
    if detected_intent == "progress":
        return ["progress"]
    elif detected_intent == "reading" or state.lesson.mode == "reading":
        return ["reading"]
    elif detected_intent == "writing" or state.lesson.mode == "writing":
        return ["writing"]
    else:
        return ["conversation"]  # default
```

---

## Conversation Practice Agent

### Purpose
Engage users in natural dialogue while gently correcting mistakes and providing contextual learning.

### System Prompt
```python
CONVERSATION_PROMPT = """You are a friendly and patient {language} language tutor.

Student Profile:
- Name: {user_name}
- Level: {level}
- Native Language: {native_language}
- Current Topic: {topic}
- Recent Mistakes: {common_errors}

Teaching Guidelines:
1. Respond naturally in {language} (provide English translation for beginners)
2. Use vocabulary appropriate for {level} level
3. If student makes mistakes:
   - First acknowledge what they meant (show understanding)
   - Then gently provide the correct form
   - Explain why, if it helps
4. Ask follow-up questions to encourage practice
5. Integrate cultural context naturally
6. Be encouraging and positive
7. Adapt complexity based on student's responses

Current Conversation Context:
{conversation_history}

Student's Message: {user_input}

Response Format:
- {language} text: [your natural response]
- Translation (if needed): [English translation]
- Teaching Note (if applicable): [brief correction or explanation]
"""
```

### Response Structure
```python
class ConversationResponse:
    native_text: str  # Response in target language
    translation: Optional[str]  # English translation for beginners
    teaching_note: Optional[str]  # Corrections or explanations
    vocabulary_highlight: List[str]  # New words introduced
    grammar_point: Optional[str]  # Grammar concept if relevant
    cultural_note: Optional[str]  # Cultural context if relevant
    follow_up_question: bool  # Whether to ask a question
```

### Example Interaction

**User (Beginner)**: "I go to school yesterday"

**Agent Response**:
```json
{
    "native_text": "そうですか。昨日学校に行きましたね。",
    "translation": "I see. You went to school yesterday.",
    "teaching_note": "Great effort! When talking about the past in Japanese, we use the past tense. '行きました' (ikimashita) means 'went'. The particle 'に' (ni) shows direction/destination.",
    "vocabulary_highlight": ["行きました (ikimashita) - went", "昨日 (kinō) - yesterday"],
    "grammar_point": "Past tense verbs: ます → ました",
    "cultural_note": null,
    "follow_up_question": true
}
```

---

## Pronunciation Coach Agent

### Purpose
Analyze user's speech, identify pronunciation issues, and provide targeted feedback.

### System Prompt
```python
PRONUNCIATION_PROMPT = """You are an expert {language} pronunciation coach with deep knowledge of phonetics.

Student Profile:
- Level: {level}
- Native Language: {native_language}
- Known Pronunciation Challenges: {challenges}

Analysis Task:
The student attempted to say: "{expected_text}"
Speech-to-text transcription: "{transcribed_text}"
Phonetic analysis: {phonetic_data}

Your Tasks:
1. Compare transcription to expected text
2. Identify specific pronunciation errors
3. Explain the phonetic difference
4. Provide actionable feedback
5. Suggest practice exercises
6. Give an accuracy score (0-100)

Focus Areas for {language}:
- [Language-specific phonemes]
- [Common issues for {native_language} speakers]
- [Tone/pitch/stress patterns]

Be:
- Specific (which sound needs work)
- Encouraging (acknowledge what's correct)
- Actionable (how to improve)
- Progressive (prioritize most impactful fixes)
"""
```

### Workflow
```python
class PronunciationWorkflow:
    def analyze_pronunciation(audio_file, expected_text, user_level):
        # Step 1: Transcribe audio
        transcription = whisper_api.transcribe(audio_file)
        
        # Step 2: Compare texts
        similarity = calculate_similarity(transcription, expected_text)
        
        # Step 3: Phonetic analysis
        phonetic_issues = analyze_phonemes(
            transcription, 
            expected_text, 
            language="japanese"
        )
        
        # Step 4: Generate feedback
        feedback = pronunciation_agent.generate_feedback({
            "expected": expected_text,
            "transcribed": transcription,
            "similarity": similarity,
            "phonetic_issues": phonetic_issues,
            "user_level": user_level
        })
        
        # Step 5: Create practice drill
        drill = generate_drill(phonetic_issues)
        
        return PronunciationResponse(
            accuracy_score=similarity * 100,
            feedback=feedback,
            practice_drill=drill
        )
```

### Response Structure
```python
class PronunciationResponse:
    accuracy_score: int  # 0-100
    overall_feedback: str
    correct_sounds: List[str]
    needs_improvement: List[Dict]  # [{"sound": "ち", "issue": "...", "tip": "..."}]
    practice_drill: str
    audio_example: Optional[str]  # URL to native pronunciation
    next_steps: str
```

### Example Feedback

**User attempted**: "こんにちは" (konnichiwa)
**Transcribed as**: "konnicha"

```json
{
    "accuracy_score": 75,
    "overall_feedback": "Good effort! Your pronunciation is clear, but the final は (wa) sound was missing.",
    "correct_sounds": ["こ (ko)", "ん (n)", "に (ni)"],
    "needs_improvement": [
        {
            "sound": "ち (chi)",
            "issue": "The 'chi' sound needs to be more distinct, with the tongue touching the roof of your mouth",
            "tip": "Try saying 'cheese' and notice where your tongue is. That's the position for ち."
        },
        {
            "sound": "は (wa)",
            "issue": "The final particle は was not pronounced",
            "tip": "Remember, は as a particle is pronounced 'wa', not 'ha'. Don't drop it!"
        }
    ],
    "practice_drill": "Let's practice: ち, ちゃ, ちゅ, ちょ. Then: こんにちは (slowly), こんにちは (normal speed)",
    "audio_example": "https://storage.googleapis.com/.../konnichiwa_native.mp3",
    "next_steps": "Practice the 'chi' sound 5 times, then try the full greeting again."
}
```

---

## Reading Comprehension Agent

### Purpose
Generate appropriate reading materials and test comprehension with contextual questions.

### System Prompt
```python
READING_PROMPT = """You are a {language} reading comprehension specialist and content creator.

Student Profile:
- Level: {level}
- Vocabulary Size: ~{vocab_count} words
- Grammar Knowledge: {grammar_points}
- Interests: {interests}

Content Generation Guidelines:
1. Create engaging, culturally relevant content
2. Use only vocabulary appropriate for {level}
3. Include target grammar structures: {target_grammar}
4. Provide furigana (reading hints) for kanji
5. Build on previously learned concepts
6. Include context clues for new words

Comprehension Question Types:
- Literal (who, what, when, where)
- Inferential (why, how, implications)
- Vocabulary (word meaning in context)
- Grammar (structure identification)

Task: Create a reading passage about {topic}
Length: {sentence_count} sentences
Difficulty: {level}

Output Format:
1. Title
2. Reading passage (in {language})
3. Translation (in English)
4. Vocabulary list (new words only)
5. Grammar notes
6. 3-5 comprehension questions with answers
"""
```

### Content Generation Example

**Input**: 
- Level: Beginner
- Topic: Daily Routine
- Length: 5 sentences

**Output**:
```json
{
    "title": "My Morning (私の朝)",
    "passage": {
        "japanese": "私は毎朝7時に起きます。シャワーを浴びて、朝ご飯を食べます。いつもトーストとコーヒーです。8時に家を出ます。学校まで電車で行きます。",
        "furigana": "私[わたし]は毎朝[まいあさ]7時[しちじ]に起[お]きます。シャワーを浴[あ]びて、朝[あさ]ご飯[はん]を食[た]べます。いつもトーストとコーヒーです。8時[はちじ]に家[いえ]を出[で]ます。学校[がっこう]まで電車[でんしゃ]で行[い]きます。"
    },
    "translation": "I wake up at 7 every morning. I take a shower and eat breakfast. It's always toast and coffee. I leave home at 8. I go to school by train.",
    "vocabulary": [
        {"word": "毎朝", "reading": "まいあさ", "meaning": "every morning"},
        {"word": "起きます", "reading": "おきます", "meaning": "to wake up"},
        {"word": "浴びます", "reading": "あびます", "meaning": "to take (shower)"},
        {"word": "出ます", "reading": "でます", "meaning": "to leave, go out"},
        {"word": "電車", "reading": "でんしゃ", "meaning": "train"}
    ],
    "grammar_notes": [
        "に (ni) - particle indicating time ('at 7')",
        "を (wo) - object marker particle",
        "で (de) - particle indicating means/method ('by train')",
        "まで (made) - particle meaning 'until' or 'to' (destination)"
    ],
    "questions": [
        {
            "question": "What time does the person wake up?",
            "answer": "7 o'clock (7時)",
            "type": "literal"
        },
        {
            "question": "What does the person eat for breakfast?",
            "answer": "Toast and coffee (トーストとコーヒー)",
            "type": "literal"
        },
        {
            "question": "How does the person go to school?",
            "answer": "By train (電車で)",
            "type": "literal"
        },
        {
            "question": "Which particle indicates the time of waking up?",
            "answer": "に (ni)",
            "type": "grammar"
        },
        {
            "question": "What do you think the person does between 7 and 8?",
            "answer": "They shower, eat breakfast, and prepare for school",
            "type": "inferential"
        }
    ]
}
```

---

## Writing Tutor Agent

### Purpose
Teach writing systems (characters, scripts) and evaluate written composition.

### System Prompt
```python
WRITING_PROMPT = """You are a {language} writing instructor specializing in {script_system}.

Student Profile:
- Level: {level}
- Characters Learned: {char_count}
- Writing Focus: {focus}  # "recognition", "production", "composition"

Teaching Approach:
1. For character learning:
   - Show proper stroke order
   - Explain character components/radicals
   - Provide mnemonics
   - Give practice examples
2. For composition:
   - Check grammar accuracy
   - Verify character usage
   - Suggest improvements
   - Maintain student's voice

Character Learning Stages:
- Recognition: Can identify character
- Reading: Can pronounce correctly
- Writing: Can reproduce accurately
- Usage: Can use in context

Task: {task_type}
Context: {context}

Evaluation Criteria:
- Character accuracy
- Stroke order (if applicable)
- Grammar correctness
- Natural expression
- Vocabulary appropriateness
"""
```

### Exercise Types

#### 1. Character Recognition
```python
{
    "exercise_type": "recognition",
    "prompt": "Which character represents 'mountain'?",
    "options": ["山", "川", "木", "火"],
    "correct_answer": "山",
    "explanation": "山 (yama) means mountain. Notice it looks like three mountain peaks!"
}
```

#### 2. Stroke Order Practice
```python
{
    "exercise_type": "stroke_order",
    "character": "日",
    "meaning": "sun, day",
    "reading": "にち (nichi), ひ (hi)",
    "stroke_count": 4,
    "stroke_order": [
        "vertical line (left)",
        "horizontal line (top)",
        "horizontal line (middle)",
        "vertical line (right)"
    ],
    "mnemonic": "Like a window with a sun shining through!",
    "practice_words": ["日本 (Japan)", "毎日 (every day)", "月日 (time)"]
}
```

#### 3. Composition Evaluation
```python
{
    "exercise_type": "composition",
    "prompt": "Write about your hobby in 3-5 sentences",
    "student_submission": "私の趣味は読書です。毎日本を読みます。ファンタジーが好きです。",
    "evaluation": {
        "accuracy_score": 90,
        "feedback": {
            "strengths": [
                "Correct particle usage (は, を, が)",
                "Appropriate vocabulary for level",
                "Clear sentence structure"
            ],
            "improvements": [
                {
                    "original": "毎日本を読みます",
                    "suggested": "毎日、本を読みます",
                    "explanation": "Add a comma after 毎日 for better readability",
                    "severity": "minor"
                }
            ],
            "advanced_tips": [
                "You could add more detail: '毎日、30分ぐらい本を読みます' (I read books about 30 minutes every day)",
                "Try using connectors: 'それで' (therefore), 'でも' (but) to link ideas"
            ]
        },
        "vocabulary_used": ["趣味", "読書", "毎日", "本", "ファンタジー"],
        "grammar_used": ["は particle", "です/ます form", "が particle"]
    }
}
```

---

## Progress Tracker Agent

### Purpose
Analyze learning patterns, identify weak areas, and provide personalized recommendations.

### System Prompt
```python
PROGRESS_PROMPT = """You are a learning analytics specialist for {language} language acquisition.

Student Profile:
- ID: {user_id}
- Level: {level}
- Study Duration: {total_days} days
- Total Study Time: {total_hours} hours

Recent Performance Data:
{performance_data}

Analysis Tasks:
1. Calculate overall progress and skill breakdown
2. Identify strongest and weakest areas
3. Detect learning patterns and trends
4. Recommend next steps for improvement
5. Suggest optimal review schedule (spaced repetition)
6. Update gamification elements (XP, achievements)

Key Metrics:
- Lesson completion rate
- Accuracy scores by skill
- Vocabulary retention
- Grammar mastery
- Pronunciation improvement
- Study consistency (streak)

Recommendation Guidelines:
- Prioritize weak areas without discouraging
- Balance challenge and confidence-building
- Consider user's goals and interests
- Implement spaced repetition for retention
- Suggest varied practice methods
"""
```

### Analytics Structure
```python
class ProgressAnalytics:
    def analyze_user_progress(user_id):
        # Gather data
        performance = get_performance_history(user_id)
        lessons = get_completed_lessons(user_id)
        
        # Calculate metrics
        skill_scores = {
            "speaking": calculate_skill_average(performance, "speaking"),
            "listening": calculate_skill_average(performance, "listening"),
            "reading": calculate_skill_average(performance, "reading"),
            "writing": calculate_skill_average(performance, "writing")
        }
        
        overall_progress = calculate_overall_progress(lessons, skill_scores)
        
        # Identify patterns
        weak_areas = identify_weak_areas(performance)
        strong_areas = identify_strong_areas(performance)
        learning_velocity = calculate_learning_rate(performance)
        
        # Generate recommendations
        recommendations = generate_recommendations(
            weak_areas, 
            strong_areas, 
            learning_velocity
        )
        
        # Spaced repetition
        review_items = calculate_review_schedule(performance)
        
        return ProgressReport(
            overall=overall_progress,
            skills=skill_scores,
            weak_areas=weak_areas,
            strong_areas=strong_areas,
            recommendations=recommendations,
            review_schedule=review_items
        )
```

### Progress Report Example
```json
{
    "overall_progress": 45,
    "study_stats": {
        "total_days": 21,
        "streak_days": 7,
        "total_study_time": 840,
        "average_daily_time": 40,
        "lessons_completed": 15,
        "total_xp": 2500
    },
    "skill_breakdown": {
        "speaking": 50,
        "listening": 60,
        "reading": 40,
        "writing": 30
    },
    "strengths": [
        "Excellent listening comprehension",
        "Consistent daily practice",
        "Strong vocabulary retention"
    ],
    "areas_for_improvement": [
        {
            "skill": "writing",
            "issue": "Character recognition needs practice",
            "impact": "high",
            "recommendation": "Spend 10 minutes daily on character drills"
        },
        {
            "skill": "grammar",
            "issue": "Particle usage inconsistent",
            "impact": "medium",
            "recommendation": "Review lessons 8-10, focus on は vs が"
        }
    ],
    "next_steps": {
        "recommended_lesson": "Lesson 16: Restaurant Conversations",
        "review_needed": ["Lesson 8: Particles", "Lesson 12: Past Tense"],
        "practice_focus": "Writing practice (Hiragana)"
    },
    "achievements_unlocked": [
        "7-Day Streak",
        "100 Words Learned",
        "First Perfect Score"
    ],
    "spaced_repetition": {
        "due_today": 15,
        "due_this_week": 42,
        "items": [
            {"word": "食べる", "due_date": "2024-11-09", "strength": 0.7},
            {"grammar": "particle に", "due_date": "2024-11-09", "strength": 0.6}
        ]
    },
    "motivational_message": "Great work on your 7-day streak! Your listening skills are really improving. Let's focus on writing practice this week to balance your skills."
}
```

---

## Inter-Agent Communication

### Message Format
```python
class AgentMessage:
    from_agent: str  # "director", "conversation", etc.
    to_agent: str
    message_type: str  # "request", "response", "update"
    content: Dict[str, Any]
    context: Dict[str, Any]
    timestamp: datetime
```

### Example Flow

**User**: "How do you say 'I like sushi' in Japanese?"

```python
# 1. Director receives input
director.receive_input(
    user_input="How do you say 'I like sushi' in Japanese?",
    user_state=current_state
)

# 2. Director routes to Conversation Agent
message_to_conversation = {
    "from_agent": "director",
    "to_agent": "conversation",
    "message_type": "request",
    "content": {
        "query": "How do you say 'I like sushi' in Japanese?",
        "intent": "translation_request",
        "user_level": "beginner"
    },
    "context": {
        "lesson": "food_vocabulary",
        "recent_topics": ["restaurants", "preferences"]
    }
}

# 3. Conversation Agent responds
conversation_response = {
    "from_agent": "conversation",
    "to_agent": "director",
    "message_type": "response",
    "content": {
        "japanese": "私は寿司が好きです",
        "romaji": "Watashi wa sushi ga suki desu",
        "translation": "I like sushi",
        "explanation": "'好きです' means 'to like'. The particle 'が' marks what you like.",
        "vocabulary": [
            {"word": "私", "meaning": "I"},
            {"word": "寿司", "meaning": "sushi"},
            {"word": "好き", "meaning": "to like"}
        ],
        "follow_up": "What other Japanese foods do you like?"
    }
}

# 4. Director synthesizes and responds to user
director.synthesize_response(conversation_response)

# 5. Director updates Progress Agent
director.notify_progress({
    "vocabulary_exposed": ["私", "寿司", "好き"],
    "grammar_exposed": ["が particle", "です form"]
})
```

---

## Implementation Checklist

### Phase 1: Director Agent
- [ ] Implement state management
- [ ] Create routing logic
- [ ] Build agent invocation system
- [ ] Add conversation history tracking
- [ ] Test with mock specialist agents

### Phase 2: Core Specialist Agents
- [ ] Conversation Agent implementation
- [ ] Pronunciation Agent with Whisper integration
- [ ] Reading Agent with content generation
- [ ] Writing Agent with character teaching
- [ ] Progress Agent with analytics

### Phase 3: Integration
- [ ] Connect all agents to Director
- [ ] Implement inter-agent messaging
- [ ] Add error handling and fallbacks
- [ ] Create agent coordination tests

### Phase 4: Optimization
- [ ] Add caching for common queries
- [ ] Optimize prompt templates
- [ ] Reduce API call costs
- [ ] Improve response times

---

This completes the detailed agent design specifications. Each agent is designed to be modular, testable, and focused on its specific learning aspect while coordinating seamlessly through the Director Agent.
