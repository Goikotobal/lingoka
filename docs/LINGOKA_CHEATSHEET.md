# Lingoka - Quick Reference Cheat Sheet

## 📦 What You Downloaded (10 Files)

### Documentation (7 files)
1. **README_LINGOKA.md** - Start here! Overview of everything
2. **LINGOKA_QUICKSTART.md** ⭐ - Use this when resuming work
3. **LINGOKA_PROJECT_PLAN.md** - Master plan & timeline
4. **LINGOKA_ARCHITECTURE.md** - System design & architecture
5. **LINGOKA_AGENT_DESIGN.md** - Agent specs & prompts
6. **LINGOKA_SETUP.md** - Environment setup guide
7. **LINGOKA_DEPLOYMENT.md** - GCP deployment guide

### Setup & Guides (3 files)
8. **setup_lingoka.sh** - Automated setup script
9. **HOW_TO_RUN_SETUP.md** - Instructions for setup script
10. **DEMO_VERSIONS_GUIDE.md** - How to create 20% demos

---

## 🚀 Quick Start (3 Commands)

```bash
# 1. Make script executable
chmod +x ~/Downloads/setup_lingoka.sh

# 2. Run setup script
~/Downloads/setup_lingoka.sh

# 3. Open project
cd ~/projects/lingoka && code .
```

---

## 📁 Where Everything Goes

```
~/projects/lingoka/          # Main project
├── README.md                # Project overview
├── docs/                    # All documentation
│   ├── LINGOKA_*.md        # 6 documentation files
├── backend/                 # Future Python code
├── frontend/                # Future React code
├── agents/                  # Future agent code
└── .git/                    # Git repository
```

---

## 💻 Essential Commands

### Setup
```bash
cd ~/projects/lingoka        # Go to project
code .                       # Open in VS Code
cursor .                     # Open in Cursor
```

### Git
```bash
git status                   # Check status
git add .                    # Stage changes
git commit -m "message"      # Commit changes
git push origin main         # Push to GitHub
gh repo view --web          # View on GitHub
```

### Development (Future)
```bash
# Backend
cd backend
source ../venv/bin/activate
uvicorn main:app --reload

# Frontend  
cd frontend
npm run dev
```

---

## 🎯 Project Timeline

- **Planning**: ✅ Complete (You are here!)
- **Personal Website**: 🔄 In Progress (Sudoku + Comic)
- **Nihongo Demo**: 📅 1 week (after website)
- **Lingoka Demo**: 📅 1 week (after Nihongo)
- **Full Lingoka MVP**: 📅 3-4 months

---

## 🛠️ Tech Stack Quick Reference

| Component | Technology |
|-----------|-----------|
| Backend | FastAPI (Python 3.11+) |
| Agents | LangGraph |
| Frontend | React + Vite + Tailwind |
| AI | OpenAI GPT-4, Claude |
| Speech | Whisper (STT), ElevenLabs (TTS) |
| Database | GCP Firestore |
| Storage | GCP Cloud Storage |
| Hosting | GCP Cloud Run |
| Deployment | GitHub Actions CI/CD |

---

## 💰 Cost Estimates

### Demo Version
- Hosting: Free (Vercel/GitHub Pages)
- OpenAI API: $5-20/month
- **Total: ~$10-30/month**

### Full Version (Development)
- OpenAI: $50-150/month
- ElevenLabs: $22-99/month
- Whisper: $20-50/month
- GCP: $0-50/month
- **Total: ~$90-300/month**

---

## 📝 When You Want to Resume Development

### Copy This Template to Claude:

```
Hi Claude, I'm ready to work on Lingoka.

PROJECT CONTEXT:
[Paste content of LINGOKA_PROJECT_PLAN.md]
[Paste content of LINGOKA_ARCHITECTURE.md]
[Paste relevant sections based on what you're building]

CURRENT STATUS:
- What I've completed: [list]
- Current blocker: [if any]

WHAT I WANT TO WORK ON:
[Specific task, e.g., "Build the Director Agent"]

Please help me with: [specific request]
```

---

## 🎓 Key Concepts

### Multi-Agent Architecture
```
User → Director Agent → Specialist Agents → Response
             ↓
    - Conversation Agent
    - Pronunciation Agent  
    - Reading Agent
    - Writing Agent
    - Progress Agent
```

### Agent Communication
- Director routes requests to specialists
- Specialists return focused responses
- Director synthesizes final answer
- Progress agent updates after each interaction

---

## 🎯 Demo Features (20% Version)

### Nihongo (Japanese)
- 5 beginner lessons
- Text-based chat
- Simple feedback
- Cultural tips

### Lingoka (Hiligaynon)
- 3 basic lessons
- Pronunciation guide
- Cultural context
- Social impact messaging

---

## 🔗 Important Links

### Documentation
- All docs in: `~/projects/lingoka/docs/`
- Quick start: `docs/LINGOKA_QUICKSTART.md`

### GitHub
- Repository: https://github.com/Goikotobal/lingoka
- View: `gh repo view --web`

### Resources
- LangGraph: https://langchain-ai.github.io/langgraph/
- FastAPI: https://fastapi.tiangolo.com/
- OpenAI: https://platform.openai.com/docs

---

## ⚠️ Remember

1. **Finish personal website first** (Sudoku + Comic)
2. **Build demos** before full version (validate approach)
3. **Start simple** (Director Agent → Conversation Agent)
4. **Commit often** to Git
5. **Use QUICKSTART.md** when resuming with Claude

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't find files | Check `~/Downloads/` or re-download |
| Permission denied | Run `chmod +x script.sh` |
| GitHub auth fails | Run `gh auth login` |
| Can't find Windows user | Run `cmd.exe /c "echo %USERNAME%"` |
| VS Code won't open | Run `code ~/projects/lingoka` |

---

## ✨ Success Checklist

After running setup script:
- [ ] Project exists at `~/projects/lingoka/`
- [ ] All 7 docs in `docs/` folder
- [ ] Git initialized (`.git/` folder exists)
- [ ] GitHub repo created
- [ ] Can view at github.com/Goikotobal/lingoka
- [ ] Project opens in VS Code/Cursor

---

## 🎉 You're All Set!

**Current Priority**: Finish personal website

**Next Steps**: 
1. Build Sudoku game
2. Add Beneath Green Skies comic
3. Deploy website
4. Then: Build Nihongo demo (1 week)
5. Then: Build Lingoka demo (1 week)
6. Then: Full Lingoka MVP (3-4 months)

**This Documentation Package**: Ready and waiting for you! 🚀

---

*Keep this cheat sheet handy for quick reference!*

**Your Command Center**: `~/projects/lingoka/`
**Your Guide**: `docs/LINGOKA_QUICKSTART.md`
**Your Repository**: https://github.com/Goikotobal/lingoka

Good luck! 🌟
