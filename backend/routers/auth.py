from datetime import datetime, timezone

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel, EmailStr, Field

from firebase_service import verify_bearer_token
from database import create_user, user_profile

router = APIRouter(prefix='/auth', tags=['Firebase Authentication'])


class ProfileCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    callsign: str = Field(min_length=1, max_length=40)
    email: EmailStr
    guild: str = Field(default='', max_length=100)
    level: int = 1
    levelTitle: str = 'CADET'
    xp: int = 0
    nextLevelXp: int = 500
    streakDays: int = 0
    bestStreak: int = 0
    solvedCount: int = 0
    accuracy: float = 0
    inkSeals: int = 0
    college: str = Field(default='', max_length=150)
    bountyClaimed: bool = False
    completedQuests: list[str] = []
    photoURL: str = ''
    createdAt: str = ''
    updatedAt: str = ''


def _decode(authorization: str | None):
    try:
        return verify_bearer_token(authorization or '')
    except Exception as exc:
        raise HTTPException(status_code=401, detail='Invalid Firebase ID token.') from exc


@router.get('/me')
async def current_user(authorization: str | None = Header(default=None)):
    decoded = _decode(authorization)
    profile = user_profile(decoded['uid'])
    if not profile:
        raise HTTPException(status_code=404, detail='Campus Quest profile not found.')
    return {'uid': decoded['uid'], 'profile': profile}


@router.post('/profile')
async def register_profile(payload: ProfileCreate, authorization: str | None = Header(default=None)):
    decoded = _decode(authorization)
    existing = user_profile(decoded['uid'])
    if existing:
        return {'uid': decoded['uid'], 'profile': existing, 'created': False}
    now = datetime.now(timezone.utc).isoformat()
    record = payload.model_dump()
    record.update({'createdAt': payload.createdAt or now, 'updatedAt': now})
    created = create_user(decoded['uid'], record)
    return {'uid': decoded['uid'], 'profile': created, 'created': True}
