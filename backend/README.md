# Campus Quest FastAPI Backend

FastAPI provides protected application APIs and verifies Firebase ID tokens. Application data is stored locally in JSON files under `backend/data/`.

## Required configuration
Create `backend/.env` from `.env.example` and set `GOOGLE_APPLICATION_CREDENTIALS` to a Firebase Admin service-account JSON file. Keep the service-account file private and never place it in the frontend or commit it to Git.

## Run
`python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload`
