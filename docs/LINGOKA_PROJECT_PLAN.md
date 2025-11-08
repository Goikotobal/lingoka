# Lingoka - AI-Powered Language Learning Platform

## Project Vision

Lingoka is a next-generation language learning platform that combines Duolingo's gamification with personalized AI virtual teaching. Starting with Japanese as a proof-of-concept, then expanding to Hiligaynon (an underserved Philippine language).

**Key Innovation**: Multi-agent AI system where specialized agents (writing, pronunciation, reading, conversation) coordinate to provide personalized, adaptive learning experiences.

## Project Status

**Current Phase**: Planning & Documentation
**Next Phase**: Japanese Prototype Development
**Development Environment**: Ubuntu WSL + VS Code/Cursor

## Quick Start (When Ready to Begin)

```bash
# Navigate to your projects folder
cd ~/projects

# Create Lingoka project structure
mkdir -p lingoka/{backend,frontend,agents,docs,data}
cd lingoka

# Initialize Git
git init
git remote add origin https://github.com/Goikotobal/lingoka.git

# Set up Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies (see SETUP.md for full list)
pip install fastapi uvicorn langchain langgraph openai elevenlabs
```

## Project Structure

```
lingoka/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── agents/
│   │   ├── director.py         # Orchestrator agent
│   │   ├── conversation.py     # Conversation practice agent
│   │   ├── pronunciation.py    # Pronunciation coach agent
│   │   ├── reading.py          # Reading comprehension agent
│   │   ├── writing.py          # Writing tutor agent
│   │   └── progress.py         # Progress tracker agent
│   ├── services/
│   │   ├── openai_service.py   # OpenAI API wrapper
│   │   ├── speech_service.py   # Whisper + ElevenLabs
│   │   └── db_service.py       # Firestore operations
│   ├── models/
│   │   ├── user.py             # User data models
│   │   ├── lesson.py           # Lesson structure models
│   │   └── progress.py         # Progress tracking models
│   └── config/
│       └── settings.py         # Environment configuration
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.jsx        # Main chat interface
│   │   │   ├── VoiceRecorder.jsx
│   │   │   ├── ProgressDashboard.jsx
│   │   │   └── LessonCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Learn.jsx
│   │   │   └── Profile.jsx
│   │   └── services/
│   │       └── api.js          # Backend API calls
│   ├── package.json
│   └── vite.config.js
├── agents/
│   ├── prompts/
│   │   ├── director_prompt.txt
│   │   ├── conversation_prompt.txt
│   │   ├── pronunciation_prompt.txt
│   │   ├── reading_prompt.txt
│   │   └── writing_prompt.txt
│   └── configs/
│       ├── japanese_config.json
│       └── hiligaynon_config.json
├── data/
│   ├── lessons/
│   │   ├── japanese/
│   │   │   ├── beginner/
│   │   │   ├── intermediate/
│   │   │   └── advanced/
│   │   └── hiligaynon/
│   ├── audio/
│   │   ├── japanese/
│   │   └── hiligaynon/
│   └── voice_models/
├── docs/
│   ├── ARCHITECTURE.md         # Detailed system architecture
│   ├── AGENT_DESIGN.md         # Agent specifications
│   ├── API_DOCUMENTATION.md    # API endpoints
│   ├── DEPLOYMENT.md           # GCP deployment guide
│   └── CURRICULUM.md           # Lesson planning guide
├── tests/
│   ├── test_agents.py
│   ├── test_api.py
│   └── test_integration.py
├── .env.example
├── requirements.txt
├── docker-compose.yml
└── README.md
```

## Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Agent Framework**: LangGraph (recommended) or CrewAI
- **LLM**: OpenAI GPT-4 / Claude Sonnet
- **Speech-to-Text**: OpenAI Whisper API
- **Text-to-Speech**: ElevenLabs (with voice cloning)
- **Database**: GCP Firestore
- **Storage**: GCP Cloud Storage

### Frontend
- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context / Zustand
- **Audio**: Web Speech API + custom recorder

### Infrastructure
- **Hosting**: GCP Cloud Functions (backend), GCP Cloud Run (optional)
- **CI/CD**: GitHub Actions
- **Monitoring**: GCP Cloud Logging

## Development Phases

### Phase 1: Japanese Prototype (6-8 weeks)
- Multi-agent architecture implementation
- Core agents (Conversation, Pronunciation, Reading)
- Basic frontend interface
- 10-20 beginner Japanese lessons
- Testing and validation

### Phase 2: Hiligaynon Adaptation (4-6 weeks)
- Native speaker audio collection
- Hiligaynon curriculum development
- Agent adaptation for Hiligaynon patterns
- Custom TTS voice training
- Beta testing

### Phase 3: Enhancement (Ongoing)
- Advanced gamification
- Spaced repetition system
- Community features
- Mobile app development
- Additional languages

## Key Features

1. **Multi-Agent Intelligence**: Specialized AI agents for different learning aspects
2. **Adaptive Learning**: Adjusts to user's pace and skill level
3. **Natural Conversations**: Real-world dialogue practice
4. **Pronunciation Analysis**: AI-powered feedback on accent and pronunciation
5. **Cultural Context**: Not just language, but cultural understanding
6. **Progress Tracking**: Detailed analytics and personalized recommendations
7. **Native Audio**: Authentic recordings from native speakers

## Timeline Estimates

**Full-time development (40 hrs/week)**: 3-4 months to MVP
**Part-time development (20 hrs/week)**: 5-6 months to MVP
**Evenings/Weekends (10 hrs/week)**: 8-10 months to MVP

## Cost Estimates (Monthly during development)

- OpenAI API: $50-150
- ElevenLabs: $22-99
- Whisper API: $20-50
- GCP: $0-50 (Free Tier + minimal usage)
- **Total**: ~$90-300/month

## Next Steps When Ready

1. Read through all documentation in `/docs` folder
2. Set up development environment (see SETUP.md)
3. Start with Director Agent implementation
4. Build Conversation Agent (highest priority)
5. Create first 5 Japanese lessons
6. Develop minimal frontend for testing

## Reference Materials

When you're ready to continue, provide Claude with:
1. This README.md
2. ARCHITECTURE.md (system design)
3. AGENT_DESIGN.md (agent specifications)
4. The specific phase you want to work on

**Copy-paste template for Claude:**
```
I'm ready to continue working on Lingoka, the AI language learning platform.

Here's the project context:
[Paste LINGOKA_PROJECT_PLAN.md]
[Paste ARCHITECTURE.md]
[Paste AGENT_DESIGN.md]

I want to work on: [specific component/phase]
Current status: [what you've completed]
Next goal: [what you want to build]
```

## Success Metrics

- User engagement: 15+ minutes per session
- Pronunciation improvement: measurable score increase
- Lesson completion rate: >70%
- User retention: 50% at 30 days
- NPS Score: >40

## Contact & Repository

- **Developer**: Alex Goiko (alex@alexgoiko.com)
- **GitHub**: https://github.com/Goikotobal/lingoka
- **Project Type**: Portfolio + Social Impact
- **License**: TBD

---

**Note**: This project will be completed AFTER your personal website (with Sudoku game and Beneath Green Skies comic episodes) is ready. This README serves as a complete reference for when you're ready to start development.
