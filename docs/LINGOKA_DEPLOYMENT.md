# Lingoka - Deployment Guide (GCP)

This guide covers deploying Lingoka to Google Cloud Platform using Cloud Functions and Cloud Run.

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│       Cloud Load Balancer               │
│       (HTTPS with SSL)                  │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│     Cloud Run (FastAPI Backend)         │
│     - Auto-scaling                      │
│     - Container-based                   │
│     - Min instances: 0 (cost savings)   │
│     - Max instances: 10                 │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│   Cloud Functions (Agent Functions)     │
│   - director-agent                      │
│   - conversation-agent                  │
│   - pronunciation-agent                 │
│   - reading-agent                       │
│   - writing-agent                       │
│   - progress-agent                      │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│        Firestore + Cloud Storage        │
└─────────────────────────────────────────┘
```

## Prerequisites

- GCP project created (`digital-twin-project-476716`)
- Billing enabled (for API usage beyond free tier)
- gcloud CLI installed and authenticated
- Docker installed (for Cloud Run)
- GitHub repository set up

## Step 1: Prepare Backend for Deployment

### 1.1 Create Dockerfile

`backend/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8080

# Run with gunicorn for production
CMD exec gunicorn --bind :8080 --workers 1 --threads 8 --timeout 0 main:app --worker-class uvicorn.workers.UvicornWorker
```

### 1.2 Update requirements.txt

Add production dependencies:
```txt
gunicorn==21.2.0
uvicorn[standard]==0.24.0
```

### 1.3 Create .dockerignore

`backend/.dockerignore`:
```
__pycache__
*.pyc
*.pyo
*.pyd
.Python
venv/
.env
.env.local
*.log
.git
.gitignore
tests/
.pytest_cache
.coverage
```

## Step 2: Deploy to Cloud Run

### 2.1 Build and Push Container

```bash
cd ~/projects/lingoka/backend

# Set variables
PROJECT_ID=digital-twin-project-476716
SERVICE_NAME=lingoka-backend
REGION=us-central1

# Build container
gcloud builds submit --tag gcr.io/${PROJECT_ID}/${SERVICE_NAME}

# Or use Docker directly
docker build -t gcr.io/${PROJECT_ID}/${SERVICE_NAME} .
docker push gcr.io/${PROJECT_ID}/${SERVICE_NAME}
```

### 2.2 Deploy to Cloud Run

```bash
gcloud run deploy ${SERVICE_NAME} \
    --image gcr.io/${PROJECT_ID}/${SERVICE_NAME} \
    --platform managed \
    --region ${REGION} \
    --allow-unauthenticated \
    --min-instances 0 \
    --max-instances 10 \
    --memory 2Gi \
    --cpu 2 \
    --timeout 300 \
    --set-env-vars "PROJECT_ID=${PROJECT_ID}" \
    --set-env-vars "ENV=production"
```

### 2.3 Set Environment Variables

```bash
# Set environment variables from .env file
gcloud run services update ${SERVICE_NAME} \
    --region ${REGION} \
    --set-env-vars OPENAI_API_KEY=${OPENAI_API_KEY} \
    --set-env-vars ELEVENLABS_API_KEY=${ELEVENLABS_API_KEY} \
    --set-env-vars GCP_PROJECT_ID=${PROJECT_ID}

# Or use Secret Manager (recommended for production)
```

## Step 3: Set Up Cloud Functions for Agents

### 3.1 Create Functions Directory Structure

```bash
cd ~/projects/lingoka
mkdir -p functions/{director,conversation,pronunciation,reading,writing,progress}
```

### 3.2 Example: Director Agent Function

`functions/director/main.py`:
```python
import functions_framework
from google.cloud import firestore
import os
import json

# Import your agent logic
from agents.director import DirectorAgent

db = firestore.Client()

@functions_framework.http
def director_agent(request):
    """HTTP Cloud Function for Director Agent"""
    
    # CORS headers
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
        return ('', 204, headers)
    
    headers = {'Access-Control-Allow-Origin': '*'}
    
    try:
        request_json = request.get_json()
        user_id = request_json.get('user_id')
        message = request_json.get('message')
        
        # Initialize agent
        director = DirectorAgent(db)
        
        # Process message
        response = director.process(user_id, message)
        
        return (json.dumps(response), 200, headers)
    
    except Exception as e:
        return (json.dumps({'error': str(e)}), 500, headers)
```

`functions/director/requirements.txt`:
```txt
functions-framework==3.*
google-cloud-firestore==2.13.1
langchain==0.1.0
langgraph==0.0.20
openai==1.6.1
```

### 3.3 Deploy Cloud Functions

```bash
# Deploy Director Agent
gcloud functions deploy director-agent \
    --gen2 \
    --runtime python311 \
    --region ${REGION} \
    --source ./functions/director \
    --entry-point director_agent \
    --trigger-http \
    --allow-unauthenticated \
    --memory 1GB \
    --timeout 300s \
    --set-env-vars PROJECT_ID=${PROJECT_ID}

# Deploy Conversation Agent
gcloud functions deploy conversation-agent \
    --gen2 \
    --runtime python311 \
    --region ${REGION} \
    --source ./functions/conversation \
    --entry-point conversation_agent \
    --trigger-http \
    --allow-unauthenticated \
    --memory 512MB \
    --timeout 60s

# Repeat for other agents...
```

## Step 4: Set Up Secret Manager

### 4.1 Create Secrets

```bash
# Create secrets for API keys
echo -n "${OPENAI_API_KEY}" | \
    gcloud secrets create openai-api-key \
    --data-file=- \
    --replication-policy="automatic"

echo -n "${ELEVENLABS_API_KEY}" | \
    gcloud secrets create elevenlabs-api-key \
    --data-file=- \
    --replication-policy="automatic"

echo -n "${ANTHROPIC_API_KEY}" | \
    gcloud secrets create anthropic-api-key \
    --data-file=- \
    --replication-policy="automatic"
```

### 4.2 Grant Access to Service Account

```bash
# Grant Secret Manager access
gcloud secrets add-iam-policy-binding openai-api-key \
    --member="serviceAccount:lingoka-backend@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding elevenlabs-api-key \
    --member="serviceAccount:lingoka-backend@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

### 4.3 Access Secrets in Code

```python
from google.cloud import secretmanager

def get_secret(secret_id, project_id):
    """Retrieve secret from Secret Manager"""
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret_id}/versions/latest"
    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode("UTF-8")

# Usage
OPENAI_API_KEY = get_secret("openai-api-key", PROJECT_ID)
```

## Step 5: Deploy Frontend

### 5.1 Build Frontend

```bash
cd ~/projects/lingoka/frontend

# Update API URL for production
echo "VITE_API_URL=https://lingoka-backend-xxxxx-uc.a.run.app/api/v1" > .env.production

# Build
npm run build
```

### 5.2 Deploy to Firebase Hosting (Free Tier)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize Firebase
firebase init hosting

# Select options:
# - Use existing project: digital-twin-project-476716
# - Public directory: dist
# - Single-page app: Yes
# - GitHub deploys: No (for now)

# Deploy
firebase deploy --only hosting
```

### 5.3 Alternative: Deploy to Cloud Storage + Cloud CDN

```bash
# Create bucket for static hosting
gcloud storage buckets create gs://lingoka-frontend-[UNIQUE-ID] \
    --location=us-central1 \
    --uniform-bucket-level-access

# Upload build files
gcloud storage cp -r dist/* gs://lingoka-frontend-[UNIQUE-ID]/

# Make bucket public
gcloud storage buckets add-iam-policy-binding gs://lingoka-frontend-[UNIQUE-ID] \
    --member=allUsers \
    --role=roles/storage.objectViewer

# Set up load balancer and CDN (optional, for production)
```

## Step 6: Set Up CI/CD with GitHub Actions

### 6.1 Create Service Account Key for CI/CD

```bash
# Create service account for GitHub Actions
gcloud iam service-accounts create github-actions \
    --display-name="GitHub Actions"

# Grant necessary roles
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/cloudfunctions.admin"

# Create key
gcloud iam service-accounts keys create github-actions-key.json \
    --iam-account=github-actions@${PROJECT_ID}.iam.gserviceaccount.com
```

### 6.2 Add GitHub Secrets

In your GitHub repository settings:
- `GCP_PROJECT_ID`: digital-twin-project-476716
- `GCP_SA_KEY`: Content of github-actions-key.json (base64 encoded)
- `OPENAI_API_KEY`: Your OpenAI API key
- `ELEVENLABS_API_KEY`: Your ElevenLabs API key

### 6.3 Create GitHub Actions Workflow

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to GCP

on:
  push:
    branches:
      - main
      - production
  workflow_dispatch:

env:
  PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
  REGION: us-central1
  SERVICE_NAME: lingoka-backend

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
        with:
          project_id: ${{ secrets.GCP_PROJECT_ID }}
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          export_default_credentials: true
      
      - name: Configure Docker
        run: gcloud auth configure-docker
      
      - name: Build and Push Container
        run: |
          cd backend
          docker build -t gcr.io/$PROJECT_ID/$SERVICE_NAME:$GITHUB_SHA .
          docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:$GITHUB_SHA
      
      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy $SERVICE_NAME \
            --image gcr.io/$PROJECT_ID/$SERVICE_NAME:$GITHUB_SHA \
            --platform managed \
            --region $REGION \
            --allow-unauthenticated \
            --min-instances 0 \
            --max-instances 10
      
  deploy-functions:
    runs-on: ubuntu-latest
    needs: deploy-backend
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
        with:
          project_id: ${{ secrets.GCP_PROJECT_ID }}
          service_account_key: ${{ secrets.GCP_SA_KEY }}
      
      - name: Deploy Cloud Functions
        run: |
          for agent in director conversation pronunciation reading writing progress; do
            gcloud functions deploy ${agent}-agent \
              --gen2 \
              --runtime python311 \
              --region $REGION \
              --source ./functions/${agent} \
              --entry-point ${agent}_agent \
              --trigger-http \
              --allow-unauthenticated
          done
  
  deploy-frontend:
    runs-on: ubuntu-latest
    needs: deploy-backend
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Set up Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Build
        run: |
          cd frontend
          npm run build
        env:
          VITE_API_URL: https://lingoka-backend-xxxxx-uc.a.run.app/api/v1
      
      - name: Deploy to Firebase
        uses: w9jds/firebase-action@master
        with:
          args: deploy --only hosting
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

## Step 7: Monitoring and Logging

### 7.1 Set Up Cloud Logging

```python
# In your backend code
import google.cloud.logging

# Initialize logging
logging_client = google.cloud.logging.Client()
logging_client.setup_logging()

# Now use standard Python logging
import logging
logger = logging.getLogger(__name__)

logger.info("Agent invoked", extra={
    "agent": "conversation",
    "user_id": user_id,
    "duration": duration
})
```

### 7.2 Create Log-Based Metrics

```bash
# Create metric for agent invocations
gcloud logging metrics create agent_invocations \
    --description="Count of agent invocations" \
    --log-filter='resource.type="cloud_function" 
                  AND textPayload:"Agent invoked"'
```

### 7.3 Set Up Alerts

```bash
# Create alert for high error rate
gcloud alpha monitoring policies create \
    --notification-channels=CHANNEL_ID \
    --display-name="High Error Rate" \
    --condition-threshold-value=10 \
    --condition-threshold-duration=60s \
    --condition-display-name="Error rate > 10/min"
```

## Step 8: Cost Optimization

### 8.1 Set Budget Alerts

```bash
# Create budget
gcloud billing budgets create \
    --billing-account=BILLING_ACCOUNT_ID \
    --display-name="Lingoka Monthly Budget" \
    --budget-amount=100USD \
    --threshold-rule=percent=50 \
    --threshold-rule=percent=90 \
    --threshold-rule=percent=100
```

### 8.2 Optimize Cloud Run

```yaml
# Reduce costs with min-instances=0
# Use smaller memory (512MB-1GB) if possible
# Set appropriate timeout (60-300s)
# Use concurrency efficiently
```

### 8.3 Cloud Functions Optimization

- Use gen2 functions (faster cold starts)
- Set appropriate memory limits
- Use caching for frequently accessed data
- Implement request batching where possible

## Step 9: Custom Domain Setup

### 9.1 Register Domain (Optional)

Use Google Domains or any registrar.

### 9.2 Map Domain to Cloud Run

```bash
# Map domain
gcloud beta run domain-mappings create \
    --service lingoka-backend \
    --domain api.lingoka.com \
    --region us-central1

# Follow instructions to update DNS records
```

### 9.3 Enable HTTPS

Cloud Run automatically provisions SSL certificates for custom domains.

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Secrets stored in Secret Manager
- [ ] Database migrations (if any) prepared
- [ ] Frontend API URLs updated
- [ ] CORS settings configured

### Deployment
- [ ] Backend deployed to Cloud Run
- [ ] Cloud Functions deployed for agents
- [ ] Frontend deployed to Firebase/Cloud Storage
- [ ] Domain configured (if applicable)
- [ ] SSL certificate active

### Post-Deployment
- [ ] Health checks passing
- [ ] Logs showing normal operation
- [ ] Monitoring and alerts configured
- [ ] Budget limits set
- [ ] Performance tested
- [ ] User acceptance testing

## Rollback Procedure

If deployment fails:

```bash
# Rollback Cloud Run to previous revision
gcloud run services update-traffic lingoka-backend \
    --to-revisions PREVIOUS_REVISION=100 \
    --region us-central1

# Rollback Cloud Function
gcloud functions deploy director-agent \
    --gen2 \
    --runtime python311 \
    --region us-central1 \
    --source gs://gcf-sources-PREVIOUS/source.zip

# Rollback frontend
firebase hosting:rollback
```

## Production Checklist

- [ ] Rate limiting enabled
- [ ] Authentication implemented
- [ ] Input validation on all endpoints
- [ ] Error handling comprehensive
- [ ] Secrets never in code/logs
- [ ] HTTPS enforced
- [ ] Monitoring active
- [ ] Backups configured (Firestore)
- [ ] Disaster recovery plan
- [ ] Documentation complete

---

Your Lingoka application is now deployed to GCP! 🚀

Access your application at:
- Backend: https://lingoka-backend-xxxxx-uc.a.run.app
- Frontend: https://lingoka-xxxxx.web.app (Firebase) or your custom domain
