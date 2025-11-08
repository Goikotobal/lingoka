# Lingoka - Quick Start Reference

This is your quick reference guide for when you're ready to start or continue building Lingoka.

## Context for Claude

When you're ready to work on Lingoka, copy and paste this template to Claude:

---

**Template for Claude:**

```
Hi Claude, I'm ready to work on Lingoka, my AI language learning platform project.

PROJECT CONTEXT:
I'm building Lingoka - an AI-powered language learning app that combines Duolingo-style 
gamification with virtual AI tutors. It uses a multi-agent architecture where specialized 
AI agents (Conversation, Pronunciation, Reading, Writing, Progress) coordinate through 
a Director Agent to provide personalized language learning.

First implementation: Japanese (proof of concept with good data/API support)
Second implementation: Hiligaynon (my target language, underserved market)

TECH STACK:
- Backend: FastAPI (Python), LangGraph for multi-agent system
- Frontend: React + Vite + Tailwind CSS
- AI: OpenAI GPT-4, Whisper (STT), ElevenLabs (TTS)
- Infrastructure: GCP (Cloud Run, Cloud Functions, Firestore, Cloud Storage)
- Development: Ubuntu WSL, VS Code/Cursor

PROJECT DOCUMENTS:
[Paste content of LINGOKA_PROJECT_PLAN.md here]
[Paste content of LINGOKA_ARCHITECTURE.md here]
[Paste content of LINGOKA_AGENT_DESIGN.md here]

CURRENT STATUS:
[Describe what you've completed, e.g.:]
- ✅ Project planning and documentation complete
- ⏸️  Waiting to finish personal website first
- ⏳ Next: Set up project structure and begin Director Agent

WHAT I WANT TO WORK ON:
[Specify what you want to build/work on, e.g.:]
- Set up the complete project structure
- Build the Director Agent with routing logic
- Create the Conversation Practice Agent
- Set up the FastAPI backend with basic endpoints
- etc.

Please help me with: [specific task]
```

---

## Project Files Location

All project documentation is saved in your computer at:
- **Main Plan**: `/home/claude/LINGOKA_PROJECT_PLAN.md`
- **Architecture**: `/home/claude/LINGOKA_ARCHITECTURE.md`
- **Agent Design**: `/home/claude/LINGOKA_AGENT_DESIGN.md`
- **Setup Guide**: `/home/claude/LINGOKA_SETUP.md`
- **Deployment**: `/home/claude/LINGOKA_DEPLOYMENT.md`

When starting development, create the actual project at:
```bash
~/projects/lingoka/
```

## Quick Command Reference

### Starting Development

```bash
# Navigate to project
cd ~/projects/lingoka

# Activate Python environment
source venv/bin/activate

# Start backend (in one terminal)
cd backend
uvicorn main:app --reload

# Start frontend (in another terminal)
cd frontend
npm run dev
```

### Useful Commands

```bash
# Install dependencies
pip install -r requirements.txt          # Backend
npm install                              # Frontend

# Run tests
pytest tests/ -v                         # Backend tests
npm run test                             # Frontend tests

# Format code
black backend/                           # Format Python
npm run format                           # Format JS/React

# Check logs
gcloud logging read "resource.type=cloud_run_revision" --limit 50
```

## Development Phases Quick Reference

### Phase 1: Japanese Prototype (6-8 weeks)
1. **Weeks 1-2**: Foundation
   - Set up project structure
   - Implement Director Agent
   - Create basic FastAPI backend
   - Set up GCP infrastructure

2. **Weeks 3-4**: Core Agents
   - Build Conversation Practice Agent
   - Implement Pronunciation Coach (Whisper integration)
   - Create Reading Comprehension Agent
   - Basic frontend interface

3. **Weeks 5-6**: Content & Testing
   - Create first 10-20 Japanese lessons
   - Implement gamification
   - Integration testing
   - User testing

4. **Weeks 7-8**: Refinement
   - Bug fixes
   - Optimize agent coordination
   - Performance improvements
   - Documentation

### Phase 2: Hiligaynon (4-6 weeks)
1. **Weeks 9-10**: Content Development
   - Collect native speaker recordings
   - Create Hiligaynon curriculum
   - Custom voice cloning (ElevenLabs)

2. **Weeks 11-12**: Agent Adaptation
   - Modify agents for Hiligaynon patterns
   - Update pronunciation models
   - Create lessons

3. **Weeks 13-14**: Testing & Launch
   - Beta testing
   - Refinement
   - Soft launch

## Key Architectural Decisions

1. **LangGraph over CrewAI**: Better control, state management, conditional routing
2. **Cloud Run + Cloud Functions**: Scalable, pay-per-use, easy deployment
3. **Firestore**: Flexible schema, real-time, good GCP integration
4. **ElevenLabs**: Best TTS quality, voice cloning for native speakers
5. **Whisper API**: High accuracy multilingual STT

## Critical Implementation Notes

### Agent Communication Flow
```
User Input → Director Agent → Specialist Agent(s) → Director Agent → User Response
```

### State Management
- Director maintains conversation context
- Progress tracker updates after each interaction
- Firestore stores user progress, lessons, sessions

### Error Handling
- Fallback to Conversation Agent if routing fails
- Graceful degradation if speech services unavailable
- Clear error messages to user

## When You Need Help

**For Architecture Questions**: Reference `LINGOKA_ARCHITECTURE.md`
**For Agent Implementation**: Reference `LINGOKA_AGENT_DESIGN.md`
**For Setup Issues**: Reference `LINGOKA_SETUP.md`
**For Deployment**: Reference `LINGOKA_DEPLOYMENT.md`

**Common Questions**:
- "How should the Director Agent route requests?" → See Agent Design doc
- "What's the database schema?" → See Architecture doc
- "How do I deploy?" → See Deployment doc
- "How do agents communicate?" → See Agent Design doc

## Testing Strategy

### Unit Tests
```python
# Test individual agents
def test_director_routing():
    # Test Director Agent's routing logic
    
def test_conversation_response():
    # Test Conversation Agent responses
    
def test_pronunciation_analysis():
    # Test Pronunciation Coach accuracy
```

### Integration Tests
```python
# Test agent coordination
def test_full_learning_session():
    # Simulate complete user interaction
    
def test_multi_agent_flow():
    # Test Director coordinating multiple agents
```

### E2E Tests
```javascript
// Test complete user flow
describe('Learning Session', () => {
  it('should complete a lesson', () => {
    // Full user journey test
  })
})
```

## Cost Monitoring

Expected monthly costs during development:
- OpenAI API: $50-150
- ElevenLabs: $22-99
- Whisper API: $20-50
- GCP: $0-50 (mostly free tier)
- **Total**: ~$90-300/month

Production costs will scale with users.

## Success Metrics

Track these during development:
- Agent response time (target: <2s)
- Pronunciation accuracy scores
- Lesson completion rate (target: >70%)
- User engagement time (target: 15+ min/session)
- Error rate (target: <1%)

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/director-agent

# Regular commits
git add .
git commit -m "feat: implement Director Agent routing logic"

# Push to GitHub
git push origin feature/director-agent

# Merge when complete
git checkout main
git merge feature/director-agent
```

## Resources & Links

**Documentation**:
- LangGraph: https://langchain-ai.github.io/langgraph/
- FastAPI: https://fastapi.tiangolo.com/
- OpenAI API: https://platform.openai.com/docs
- ElevenLabs: https://elevenlabs.io/docs
- GCP Python: https://cloud.google.com/python/docs

**Learning Resources**:
- Multi-agent systems: Ed Donner's Udemy course
- Language learning pedagogy: Research papers on SLA
- Voice cloning: ElevenLabs voice lab

## Timeline Expectations

**Full-time (40 hrs/week)**: 
- Japanese MVP: 6-8 weeks
- Hiligaynon: +4-6 weeks
- **Total**: 3-4 months

**Part-time (20 hrs/week)**:
- Japanese MVP: 3-4 months
- Hiligaynon: +2-3 months
- **Total**: 5-6 months

**Evenings/Weekends (10 hrs/week)**:
- Japanese MVP: 6-8 months
- Hiligaynon: +4-5 months
- **Total**: 10+ months

## Portfolio Value

This project demonstrates:
- ✅ Multi-agent AI systems
- ✅ LLM orchestration (LangGraph)
- ✅ Speech processing (STT/TTS)
- ✅ Full-stack development (FastAPI + React)
- ✅ Cloud infrastructure (GCP)
- ✅ Real-world AI application
- ✅ Scalable architecture
- ✅ Social impact (language preservation)

Perfect for:
- AI engineering roles
- ML engineering positions
- Full-stack AI developer roles
- EdTech companies
- Language tech companies

## Next Physical Steps

When you're actually ready to start:

1. **Read all documentation** (you've already created it!)
2. **Set up development environment** (follow SETUP.md)
3. **Create project structure** on your computer
4. **Start with Director Agent** (simplest, most critical)
5. **Build one specialist agent** (Conversation Agent recommended)
6. **Create minimal frontend** for testing
7. **Iterate and expand**

## Remember

- Start simple, iterate quickly
- Test each agent independently before integration
- Use Japanese first for validation
- Keep code modular and well-documented
- Commit to Git frequently
- This is both a learning project AND a portfolio piece

---

## When You're Ready...

Just paste the template at the top of this document to Claude with the project documentation, and you'll be able to pick up exactly where you left off!

Good luck with your website first (Sudoku + Beneath Green Skies), and then Lingoka will be waiting for you! 🚀

---

**Last Updated**: November 8, 2024
**Status**: Documentation Complete, Ready for Development
**Priority**: After personal website completion
