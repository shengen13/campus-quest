from datetime import datetime, timezone

from fastapi import APIRouter, Header, HTTPException

from firebase_service import verify_bearer_token
from database import leaderboard, user_profile, update_user, append_activity

router = APIRouter(prefix='/leaderboard', tags=['Live Leaderboard'])


def _decode(authorization: str | None):
    try:
        return verify_bearer_token(authorization or '')
    except Exception as exc:
        raise HTTPException(status_code=401, detail='Invalid Firebase ID token.') from exc


@router.get('')
async def get_leaderboard(authorization: str | None = Header(default=None)):
    decoded = _decode(authorization)
    rows = leaderboard()
    for index, row in enumerate(rows, 1):
        row['rank'] = index
        row['isCurrentUser'] = row.get('uid') == decoded['uid']
    return {'standings': rows, 'totalParticipants': len(rows), 'userRank': next((r['rank'] for r in rows if r['isCurrentUser']), None)}


@router.post('/claim-bounty')
async def claim_bounty(authorization: str | None = Header(default=None)):
    decoded = _decode(authorization)
    uid = decoded['uid']
    profile = user_profile(uid)
    if not profile:
        raise HTTPException(status_code=404, detail='Campus Quest profile not found.')
    if profile.get('bountyClaimed'):
        return {'success': False, 'message': 'Bounty already claimed.', 'profile': profile}
    xp = int(profile.get('xp', 0)) + 200
    level = max(1, xp // 500 + 1)
    updated = update_user(uid, {'xp': xp, 'level': level, 'nextLevelXp': level * 500, 'bountyClaimed': True, 'updatedAt': datetime.now(timezone.utc).isoformat()})
    append_activity({'uid': uid, 'type': 'bounty_claimed', 'xp': 200, 'createdAt': datetime.now(timezone.utc).isoformat()})
    return {'success': True, 'message': 'Bounty claimed.', 'profile': updated}
