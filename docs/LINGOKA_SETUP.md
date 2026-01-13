# Lingoka - Development Setup Guide

This guide will help you set up your development environment for Lingoka when you're ready to start building.

## Prerequisites

### Required Software
- **Ubuntu 22.04+** (WSL or native)
- **Python 3.11+**
- **Node.js 18+** and npm
- **Git**
- **VS Code** or **Cursor IDE**
- **Google Cloud SDK** (gcloud CLI)

### Required Accounts & API Keys
- **Google Cloud Platform** account (with billing enabled for API usage)
- **OpenAI API** key
- **ElevenLabs** account and API key
- **GitHub** account

## Initial Setup

### 1. System Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and build tools
sudo apt install -y python3.11 python3.11-venv python3-pip
sudo apt install -y build-essential libssl-dev libffi-dev python3-dev

# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installations
python3.11 --version
node --version
npm --version
git --version
```

### 2. Google Cloud SDK

```bash
# Install gcloud CLI
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
sudo apt update && sudo apt install google-cloud-cli

# Initialize and authenticate
gcloud init
gcloud auth application-default login

# Set your project
gcloud config set project digital-twin-project-476716
```

### 3. Project Structure Creation

```bash
# Navigate to your projects directory
cd ~/projects

# Create Lingoka directory structure
mkdir -p lingoka/{backend,frontend,agents,docs,data,tests}
cd lingoka

# Create subdirectories
mkdir -p backend/{agents,services,models,config,utils}
mkdir -p frontend/src/{components,pages,services,hooks,utils}
mkdir -p agents/{prompts,configs}
mkdir -p data/{lessons,audio,voice_models}
mkdir -p data/lessons/{japanese,hiligaynon}
mkdir -p data/lessons/japanese/{beginner,intermediate,advanced}
mkdir -p data/lessons/hiligaynon/{beginner,intermediate,advanced}
mkdir -p tests/{unit,integration,e2e}
mkdir -p docs

# Initialize Git repository
git init
git remote add origin https://github.com/Goikotobal/lingoka.git
```

## Backend Setup

### 1. Python Virtual Environment

```bash
cd ~/projects/lingoka

# Create virtual environment
python3.11 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip
```

### 2. Install Python Dependencies

Create `requirements.txt`:
```txt
# Core Framework
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
pydantic-settings==2.1.0

# Agent Framework
langchain==0.1.0
langgraph==0.0.20
langchain-openai==0.0.2

# Alternative Agent Framework (choose one)
# crewai==0.1.0

# AI Services
openai==1.6.1
anthropic==0.8.1

# Speech Services
elevenlabs==0.2.24
# Note: Whisper is accessed via OpenAI API

# Google Cloud
google-cloud-firestore==2.13.1
google-cloud-storage==2.10.0
google-cloud-logging==3.8.0
google-auth==2.25.2

# Database & Caching
redis==5.0.1

# Utilities
python-dotenv==1.0.0
python-multipart==0.0.6
httpx==0.25.2
aiofiles==23.2.1
pytz==2023.3

# Audio Processing
pydub==0.25.1
librosa==0.10.1

# Testing
pytest==7.4.3
pytest-asyncio==0.21.1
pytest-cov==4.1.0
httpx==0.25.2

# Development
black==23.12.1
ruff==0.1.8
mypy==1.7.1
```

Install dependencies:
```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Create `.env` file:
```bash
# Copy example environment file
cp .env.example .env
```

`.env.example` template:
```bash
# Application
APP_NAME=Lingoka
ENV=development
DEBUG=True
API_VERSION=v1

# Server
HOST=0.0.0.0
PORT=8000

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxx
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7

# Anthropic (Alternative)
ANTHROPIC_API_KEY=sk-ant-xxxxx
ANTHROPIC_MODEL=claude-sonnet-4-20250514

# ElevenLabs
ELEVENLABS_API_KEY=xxxxx
ELEVENLABS_VOICE_ID=xxxxx  # Will be created after setup

# Google Cloud
GCP_PROJECT_ID=digital-twin-project-476716
GCP_REGION=us-central1
FIRESTORE_DATABASE=lingoka-db
GCS_BUCKET=lingoka-audio

# Redis (Optional - for caching)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# JWT & Security
JWT_SECRET_KEY=your-secret-key-here-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_PERIOD=3600  # 1 hour in seconds

# Logging
LOG_LEVEL=INFO
LOG_FORMAT=json

# Feature Flags
ENABLE_SPEECH_TO_TEXT=True
ENABLE_TEXT_TO_SPEECH=True
ENABLE_PROGRESS_TRACKING=True
```

### 4. Backend Directory Structure

```
backend/
├── main.py                     # FastAPI app entry point
├── config/
│   ├── __init__.py
│   └── settings.py             # Environment configuration
├── agents/
│   ├── __init__.py
│   ├── base_agent.py           # Base agent class
│   ├── director.py             # Director orchestrator
│   ├── conversation.py         # Conversation practice
│   ├── pronunciation.py        # Pronunciation coach
│   ├── reading.py              # Reading comprehension
│   ├── writing.py              # Writing tutor
│   └── progress.py             # Progress tracker
├── services/
│   ├── __init__.py
│   ├── openai_service.py       # OpenAI wrapper
│   ├── anthropic_service.py    # Claude wrapper
│   ├── speech_service.py       # Whisper + ElevenLabs
│   ├── firestore_service.py    # Database operations
│   └── storage_service.py      # Cloud storage
├── models/
│   ├── __init__.py
│   ├── user.py                 # User models
│   ├── lesson.py               # Lesson models
│   ├── progress.py             # Progress models
│   ├── conversation.py         # Conversation models
│   └── response.py             # API response models
├── api/
│   ├── __init__.py
│   ├── deps.py                 # Dependencies
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── chat.py
│   │   ├── lessons.py
│   │   ├── progress.py
│   │   └── user.py
├── utils/
│   ├── __init__.py
│   ├── logger.py
│   ├── security.py
│   └── validators.py
└── tests/
    ├── __init__.py
    ├── conftest.py
    ├── test_agents.py
    ├── test_services.py
    └── test_api.py
```

## Frontend Setup

### 1. Create React + Vite Project

```bash
cd ~/projects/lingoka/frontend

# Create Vite project
npm create vite@latest . -- --template react

# Install dependencies
npm install

# Install additional packages
npm install @tanstack/react-query axios zustand
npm install tailwindcss postcss autoprefixer -D
npm install react-router-dom
npm install lucide-react  # Icons
npm install react-hot-toast  # Notifications

# Initialize Tailwind
npx tailwindcss init -p
```

### 2. Configure Tailwind CSS

`tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
      },
    },
  },
  plugins: [],
}
```

### 3. Frontend Directory Structure

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── main.jsx                # Entry point
│   ├── App.jsx                 # Main app component
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Navigation.jsx
│   │   ├── chat/
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── InputArea.jsx
│   │   │   └── VoiceRecorder.jsx
│   │   ├── lessons/
│   │   │   ├── LessonCard.jsx
│   │   │   ├── LessonView.jsx
│   │   │   └── ExerciseCard.jsx
│   │   ├── progress/
│   │   │   ├── ProgressDashboard.jsx
│   │   │   ├── SkillChart.jsx
│   │   │   └── AchievementBadge.jsx
│   │   └── common/
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       └── Loading.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Learn.jsx
│   │   ├── Lessons.jsx
│   │   ├── Profile.jsx
│   │   └── Login.jsx
│   ├── services/
│   │   ├── api.js              # API client
│   │   ├── auth.js             # Authentication
│   │   └── audio.js            # Audio handling
│   ├── hooks/
│   │   ├── useChat.js
│   │   ├── useAudio.js
│   │   ├── useProgress.js
│   │   └── useAuth.js
│   ├── store/
│   │   ├── authStore.js        # Zustand store
│   │   ├── chatStore.js
│   │   └── progressStore.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   └── styles/
│       └── index.css
├── .env
├── .env.example
├── package.json
├── vite.config.js
└── index.html
```

### 4. Frontend Environment Variables

`.env.example`:
```bash
VITE_API_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/ws
VITE_APP_NAME=Lingoka
VITE_ENABLE_VOICE=true
```

## GCP Setup

### 1. Enable Required APIs

```bash
# Enable APIs
gcloud services enable \
    firestore.googleapis.com \
    storage.googleapis.com \
    cloudfunctions.googleapis.com \
    cloudrun.googleapis.com \
    logging.googleapis.com
```

### 2. Create Firestore Database

```bash
# Create Firestore database (Native mode)
gcloud firestore databases create \
    --location=us-central1 \
    --type=firestore-native
```

### 3. Create Cloud Storage Bucket

```bash
# Create bucket for audio files
gcloud storage buckets create gs://lingoka-audio-[YOUR-UNIQUE-ID] \
    --location=us-central1 \
    --uniform-bucket-level-access

# Set CORS for frontend access
cat > cors.json << EOF
[
  {
    "origin": ["http://localhost:5173", "https://your-domain.com"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
EOF

gcloud storage buckets update gs://lingoka-audio-[YOUR-UNIQUE-ID] \
    --cors-file=cors.json
```

### 4. Service Account Setup

```bash
# Create service account
gcloud iam service-accounts create lingoka-backend \
    --display-name="Lingoka Backend Service Account"

# Grant necessary permissions
gcloud projects add-iam-policy-binding digital-twin-project-476716 \
    --member="serviceAccount:lingoka-backend@digital-twin-project-476716.iam.gserviceaccount.com" \
    --role="roles/datastore.user"

gcloud projects add-iam-policy-binding digital-twin-project-476716 \
    --member="serviceAccount:lingoka-backend@digital-twin-project-476716.iam.gserviceaccount.com" \
    --role="roles/storage.objectAdmin"

# Create and download key
gcloud iam service-accounts keys create ~/lingoka-sa-key.json \
    --iam-account=lingoka-backend@digital-twin-project-476716.iam.gserviceaccount.com

# Set environment variable
export GOOGLE_APPLICATION_CREDENTIALS=~/lingoka-sa-key.json
```

## Development Workflow

### Running Locally

**Backend**:
```bash
cd ~/projects/lingoka/backend
source ../venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend**:
```bash
cd ~/projects/lingoka/frontend
npm run dev
```

### Testing

**Backend Tests**:
```bash
cd ~/projects/lingoka
source venv/bin/activate
pytest tests/ -v --cov=backend
```

**Frontend Tests**:
```bash
cd ~/projects/lingoka/frontend
npm run test
```

### Code Quality

**Python**:
```bash
# Format code
black backend/

# Lint code
ruff check backend/

# Type checking
mypy backend/
```

**JavaScript**:
```bash
npm run lint
npm run format
```

## VS Code / Cursor Configuration

Create `.vscode/settings.json`:
```json
{
  "python.defaultInterpreterPath": "${workspaceFolder}/venv/bin/python",
  "python.linting.enabled": true,
  "python.linting.ruffEnabled": true,
  "python.formatting.provider": "black",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

Create `.vscode/extensions.json`:
```json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.black-formatter",
    "charliermarsh.ruff",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "googlecloudtools.cloudcode"
  ]
}
```

## Initial File Templates

### Backend `main.py`:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.settings import settings

app = FastAPI(
    title="Lingoka API",
    version="0.1.0",
    description="AI-powered language learning platform"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to Lingoka API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### Frontend `main.jsx`:
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## Troubleshooting

### Common Issues

**Python version conflicts**:
```bash
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1
```

**WSL audio issues** (for voice recording):
- Install PulseAudio
- Use browser's Web Speech API instead

**GCP authentication errors**:
```bash
gcloud auth application-default login
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
```

**Port already in use**:
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

## Next Steps

Once setup is complete:
1. ✅ Verify all services are running
2. ✅ Test API endpoints (`http://localhost:8000/docs`)
3. ✅ Test frontend (`http://localhost:5173`)
4. ✅ Commit initial setup to Git
5. ✅ Read ARCHITECTURE.md for system design
6. ✅ Read AGENT_DESIGN.md for agent specifications
7. ✅ Start building Director Agent

---

Your development environment is now ready for building Lingoka!
