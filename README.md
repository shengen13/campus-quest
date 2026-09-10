# Campus Quest

Campus Quest is a responsive gamified student challenge platform.

## Architecture
- React + TypeScript frontend
- Firebase Authentication for real email/password accounts and identity
- FastAPI backend for protected operations
- JSON files in `backend/data/` for persistent application data
- No Firestore is required

## Frontend setup
1. Copy `.env.example` to `.env`.
2. Put the Web App configuration from the new Firebase project into `.env`.
3. Ensure Email/Password is enabled in Firebase Authentication.
4. Run `npm install` and `npm run dev`.

## Backend setup
1. Copy `backend/.env.example` to `backend/.env`.
2. Download a Firebase Admin service-account JSON from Firebase Project Settings -> Service accounts. Keep this file private and outside the frontend.
3. Set `GOOGLE_APPLICATION_CREDENTIALS` to that file's absolute path.
4. From `backend/`, create/activate a virtual environment, install `requirements.txt`, then run:
   `python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload`

## Data
- `backend/data/users.json` starts empty and is filled by real registrations.
- `backend/data/quests.json` and `backend/data/seals.json` contain the application's challenge/achievement definitions.
- `backend/data/activity.json` records real user events.

Never store passwords in JSON. Firebase Authentication owns password handling.
