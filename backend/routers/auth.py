from datetime import datetime, timezone

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel, EmailStr, Field

from firebase_service import verify_bearer_token
from database import create_user, user_profile


router = APIRouter(
    prefix='/auth',
    tags=['Firebase Authentication']
)


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
        raise HTTPException(
            status_code=401,
            detail='Invalid Firebase ID token.'
        ) from exc


@router.get('/me')
async def current_user(
    authorization: str | None = Header(default=None)
):
    decoded = _decode(authorization)

    uid = decoded['uid']

    # Check whether Campus Quest profile already exists
    profile = user_profile(uid)

    if profile:
        return {
            'uid': uid,
            'profile': profile
        }

    # Firebase account exists, but Campus Quest profile doesn't.
    # Automatically create a basic profile.
    now = datetime.now(timezone.utc).isoformat()

    email = decoded.get('email', '')
    name = (
        decoded.get('name')
        or email.split('@')[0]
        or 'Cadet'
    )

    photo_url = decoded.get('picture', '')

    record = {
        'name': name,
        'callsign': name[:40],
        'email': email,
        'guild': '',

        'level': 1,
        'levelTitle': 'CADET',
        'xp': 0,
        'nextLevelXp': 500,

        'streakDays': 0,
        'bestStreak': 0,
        'solvedCount': 0,
        'accuracy': 0,
        'inkSeals': 0,

        'college': '',

        'bountyClaimed': False,
        'completedQuests': [],

        'photoURL': photo_url,

        'createdAt': now,
        'updatedAt': now,
    }

    created = create_user(uid, record)

    return {
        'uid': uid,
        'profile': created
    }


@router.post('/profile')
async def register_profile(
    payload: ProfileCreate,
    authorization: str | None = Header(default=None)
):
    decoded = _decode(authorization)

    uid = decoded['uid']

    existing = user_profile(uid)

    if existing:
        return {
            'uid': uid,
            'profile': existing,
            'created': False
        }

    now = datetime.now(timezone.utc).isoformat()

    record = payload.model_dump()

    record.update({
        'createdAt': payload.createdAt or now,
        'updatedAt': now
    })

    created = create_user(uid, record)

    return {
        'uid': uid,
        'profile': created,
        'created': True
    }