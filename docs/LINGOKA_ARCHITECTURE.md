# Lingoka - System Architecture

## Architecture Overview

Lingoka uses a **multi-agent AI architecture** where specialized agents coordinate to provide personalized language learning experiences. This document describes the complete system design.

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Chat   │  │  Voice   │  │ Progress │  │ Lessons  │   │
│  │Interface │  │ Recorder │  │Dashboard │  │   View   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (FastAPI)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │               RESTful Endpoints                       │   │
│  │  /chat  /speak  /listen  /progress  /lessons         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                  Director Agent (Orchestrator)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  • Conversation Flow Management                       │   │
│  │  • Agent Selection & Coordination                     │   │
│  │  │  • User State & Context Tracking                   │   │
│  │  • Learning Path Adaptation                          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Specialist Agents Layer                   │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │Conversation  │  │Pronunciation │  │   Reading    │      │
│  │   Agent      │  │    Coach     │  │Comprehension │      │
│  │              │  │    Agent     │  │    Agent     │      │
│  │• Dialogue    │  │• STT Analysis│  │• Text Gen    │      │
│  │• Corrections │  │• Feedback    │  │• Questions   │      │
│  │• Context     │  │• Drills      │  │• Grammar     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │   Writing    │  │   Progress   │                         │
│  │    Tutor     │  │   Tracker    │                         │
│  │    Agent     │  │    Agent     │                         │
│  │              │  │              │                         │
│  │• Characters  │  │• Analytics   │                         │
│  │• Exercises   │  │• Weak Spots  │                         │
│  │• Evaluation  │  │• Gamification│                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      Services Layer                          │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   OpenAI     │  │  ElevenLabs  │  │   Whisper    │      │
│  │  GPT-4/Claude│  │     TTS      │  │     STT      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer (GCP)                       │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Firestore   │  │Cloud Storage │  │  Cloud Logs  │      │
│  │   (NoSQL)    │  │   (Audio)    │  │ (Monitoring) │      │
│  │              │  │              │  │              │      │
│  │• User Data   │  │• Voice Files │  │• Agent Logs  │      │
│  │• Progress    │  │• Recordings  │  │• Performance │      │
│  │• Lessons     │  │• TTS Cache   │  │• Errors      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Agent Communication Flow

### Typical Learning Session Flow

```
User Message → FastAPI → Director Agent
                              ↓
                    [Analyzes Intent & Context]
                              ↓
                    ┌─────────┴─────────┐
                    │   Decision Tree    │
                    └─────────┬─────────┘
                              ↓
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
   Conversation          Pronunciation          Reading
      Agent                 Agent                Agent
        ↓                     ↓                     ↓
   [Response]            [Analysis]            [Questions]
        ↓                     ↓                     ↓
        └─────────────────────┼─────────────────────┘
                              ↓
                       Director Agent
                              ↓
                    [Synthesizes Response]
                              ↓
                       Progress Tracker
                              ↓
                         [Updates DB]
                              ↓
                       FastAPI Response
                              ↓
                         User Interface
```

## Agent Specifications

### 1. Director Agent (Orchestrator)

**Purpose**: Central coordinator that manages conversation flow and delegates tasks to specialist agents.

**Responsibilities**:
- Parse user input and determine intent
- Select appropriate specialist agent(s)
- Maintain conversation context and learning state
- Synthesize responses from multiple agents
- Adapt difficulty based on user performance
- Handle error recovery and fallback scenarios

**State Management**:
```python
{
    "user_id": "uuid",
    "session_id": "uuid",
    "current_lesson": "lesson_id",
    "learning_level": "beginner|intermediate|advanced",
    "conversation_history": [],
    "current_topic": "greetings",
    "active_agents": ["conversation", "pronunciation"],
    "user_state": {
        "energy": 85,  # gamification
        "streak": 7,
        "current_skill": "speaking"
    }
}
```

**Decision Logic**:
```python
if user_input.contains_audio():
    invoke(pronunciation_agent)
elif user_input.is_question():
    invoke(conversation_agent)
elif lesson.mode == "reading":
    invoke(reading_agent)
elif lesson.mode == "writing":
    invoke(writing_agent)
else:
    invoke(conversation_agent)  # default
```

### 2. Conversation Practice Agent

**Purpose**: Simulates natural conversations and provides contextual corrections.

**Responsibilities**:
- Generate contextually appropriate responses
- Maintain conversation coherence
- Provide gentle corrections without breaking flow
- Adapt to user's fluency level
- Inject cultural context naturally

**Prompt Template**:
```
You are a patient Japanese language tutor having a conversation with a {level} student.

Current Topic: {topic}
User's Recent Mistakes: {common_errors}
Learning Goal: {current_goal}

Guidelines:
- Respond naturally in Japanese (with English translation if needed)
- If user makes mistakes, acknowledge understanding first, then gently correct
- Use vocabulary appropriate for {level} level
- Ask follow-up questions to encourage practice
- Provide cultural context when relevant

User message: {user_input}
```

### 3. Pronunciation Coach Agent

**Purpose**: Analyzes speech and provides targeted pronunciation feedback.

**Responsibilities**:
- Process audio input via Whisper API
- Compare user pronunciation to native speech patterns
- Identify specific phonetic issues
- Generate targeted pronunciation exercises
- Track pronunciation improvement over time

**Workflow**:
```python
1. Receive audio file from frontend
2. Transcribe using Whisper API
3. Compare transcription to expected text
4. Analyze phonetic differences
5. Generate feedback:
   - What was said correctly
   - What needs improvement
   - Specific phonemes to practice
6. Suggest drill exercises
7. Update pronunciation score in database
```

**Feedback Format**:
```json
{
    "accuracy_score": 85,
    "transcription": "こんにちは",
    "expected": "こんにちは",
    "feedback": {
        "correct": ["こん", "は"],
        "needs_work": ["にち"],
        "phonetic_issues": ["n/ɲ/ sound needs more nasal quality"],
        "practice_drill": "Practice: に、ぬ、ね、の"
    }
}
```

### 4. Reading Comprehension Agent

**Purpose**: Creates reading materials and tests understanding.

**Responsibilities**:
- Generate contextual reading passages
- Create comprehension questions
- Provide grammar explanations
- Adjust text complexity to user level
- Track reading speed and accuracy

**Content Generation**:
```python
def generate_reading_passage(level, topic, length):
    """
    Generate reading passage with appropriate:
    - Vocabulary (JLPT N5/N4/N3 for Japanese)
    - Grammar structures
    - Cultural context
    - Difficulty progression
    """
    prompt = f"""
    Create a {length}-sentence reading passage in Japanese for {level} learners.
    
    Topic: {topic}
    Vocabulary: Use only JLPT {level} vocabulary
    Grammar: Include {grammar_points}
    
    Format:
    1. Japanese text with furigana
    2. English translation
    3. Vocabulary list
    4. 3-5 comprehension questions
    """
```

### 5. Writing Tutor Agent

**Purpose**: Teaches writing systems and evaluates written work.

**Responsibilities**:
- Teach character recognition (Hiragana, Katakana, Kanji)
- Provide stroke order guidance
- Generate writing exercises
- Evaluate user's written responses
- Track writing progress

**Exercise Types**:
- Character tracing (with stroke order)
- Fill-in-the-blank with appropriate characters
- Sentence construction
- Short paragraph writing

### 6. Progress Tracker Agent

**Purpose**: Analyzes learning patterns and provides personalized recommendations.

**Responsibilities**:
- Track performance across all skills
- Identify weak areas
- Suggest review sessions
- Implement spaced repetition
- Generate progress reports
- Handle gamification (XP, achievements, streaks)

**Analytics**:
```python
{
    "overall_progress": 45,  # percentage
    "skills": {
        "speaking": 50,
        "listening": 60,
        "reading": 40,
        "writing": 30
    },
    "weak_areas": ["particle usage", "past tense"],
    "recommended_review": ["lesson_12", "lesson_15"],
    "next_lesson": "lesson_18",
    "achievements": ["7_day_streak", "100_words_learned"],
    "total_xp": 2500
}
```

## Data Models

### User Model
```python
class User:
    user_id: str
    email: str
    name: str
    native_language: str
    learning_languages: List[str]
    current_level: Dict[str, str]  # {"japanese": "beginner"}
    created_at: datetime
    last_active: datetime
    preferences: Dict
    subscription_tier: str
```

### Progress Model
```python
class Progress:
    user_id: str
    language: str
    lessons_completed: List[str]
    current_lesson: str
    skill_levels: Dict[str, int]  # {"speaking": 50, "reading": 40}
    vocabulary_learned: List[str]
    grammar_learned: List[str]
    total_study_time: int  # minutes
    streak_days: int
    last_study_date: datetime
    weak_areas: List[str]
```

### Lesson Model
```python
class Lesson:
    lesson_id: str
    language: str
    level: str  # beginner, intermediate, advanced
    title: str
    description: str
    topics: List[str]
    vocabulary: List[Dict]  # [{"word": "こんにちは", "meaning": "hello"}]
    grammar_points: List[str]
    exercises: List[Dict]
    estimated_time: int  # minutes
    prerequisites: List[str]  # lesson_ids
```

### Session Model
```python
class Session:
    session_id: str
    user_id: str
    language: str
    lesson_id: str
    started_at: datetime
    ended_at: datetime
    messages: List[Dict]
    agents_invoked: List[str]
    performance: Dict
    xp_earned: int
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Learning
- `POST /api/chat` - Send message to Director Agent
- `POST /api/speak` - Upload audio for pronunciation check
- `GET /api/lessons` - Get available lessons
- `GET /api/lessons/{id}` - Get specific lesson
- `POST /api/lessons/{id}/start` - Start lesson

### Progress
- `GET /api/progress` - Get user progress
- `GET /api/progress/stats` - Get detailed statistics
- `POST /api/progress/update` - Update progress (called by agents)

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/achievements` - Get achievements

## Technology Choices & Rationale

### LangGraph vs CrewAI

**Recommended: LangGraph**

Reasons:
- More control over agent communication
- Better state management
- Native support for conditional routing
- Easier to debug
- More flexible for custom workflows

**Alternative: CrewAI**
- Simpler setup for basic multi-agent systems
- Good for task-based workflows
- May require more adaptation for learning scenarios

### Database: Firestore

Reasons:
- NoSQL flexibility for evolving data models
- Real-time updates
- Good integration with GCP
- Generous free tier
- Easy to scale

### Speech Services

**Whisper API** (Speech-to-Text):
- High accuracy
- Multilingual support
- $0.006 per minute (affordable)

**ElevenLabs** (Text-to-Speech):
- Natural-sounding voices
- Voice cloning for native speakers
- Multiple languages
- $22-99/month based on usage

## Deployment Architecture (GCP)

```
┌────────────────────────────────────────────────────┐
│              Cloud Load Balancer                   │
└────────────────────────────────────────────────────┘
                       ↓
┌────────────────────────────────────────────────────┐
│         Cloud Run (FastAPI Backend)                │
│         - Auto-scaling                             │
│         - Container-based                          │
└────────────────────────────────────────────────────┘
                       ↓
┌────────────────────────────────────────────────────┐
│  Cloud Functions (Individual Agent Functions)      │
│  - director-agent                                  │
│  - conversation-agent                              │
│  - pronunciation-agent                             │
│  - reading-agent                                   │
│  - writing-agent                                   │
│  - progress-agent                                  │
└────────────────────────────────────────────────────┘
                       ↓
┌────────────────────────────────────────────────────┐
│              Firestore Database                    │
│              Cloud Storage (Audio)                 │
│              Cloud Logging                         │
└────────────────────────────────────────────────────┘
```

## Security Considerations

1. **Authentication**: JWT tokens, secure session management
2. **API Rate Limiting**: Prevent abuse
3. **Data Encryption**: At rest and in transit
4. **Audio Privacy**: Automatic deletion after processing
5. **CORS Configuration**: Restrict frontend origins
6. **Environment Variables**: Secret management via GCP Secret Manager

## Monitoring & Observability

1. **Cloud Logging**: All agent interactions
2. **Performance Metrics**: Response times, agent invocation counts
3. **Error Tracking**: Sentry integration
4. **User Analytics**: Session duration, completion rates, drop-off points
5. **Cost Monitoring**: API usage tracking

## Scalability Considerations

1. **Horizontal Scaling**: Cloud Run auto-scales based on traffic
2. **Caching**: Redis for frequently accessed data
3. **CDN**: Static assets and audio files
4. **Database Indexing**: Optimize Firestore queries
5. **Async Processing**: Queue for long-running tasks

---

This architecture provides a solid foundation for building Lingoka with room to grow and adapt as the project evolves.
