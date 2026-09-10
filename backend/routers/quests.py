from datetime import datetime, timezone

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

from database import quest, quests, user_profile, update_user, append_activity
from firebase_service import verify_bearer_token

router = APIRouter(prefix='/quests', tags=['Quests'])


class Submission(BaseModel):
    quest_id: str
    answer: str


def _decode(authorization: str | None):
    try:
        return verify_bearer_token(authorization or '')
    except Exception as exc:
        raise HTTPException(status_code=401, detail='Invalid Firebase ID token.') from exc


def _level_for_xp(xp: int) -> tuple[int, int]:
    level = max(1, xp // 500 + 1)
    return level, level * 500


@router.get('')
async def list_quests(category: str | None = None):
    return quests(category)


@router.get('/{quest_id}')
async def get_quest(quest_id: str):
    item = quest(quest_id)
    if not item:
        raise HTTPException(status_code=404, detail='Quest not found.')
    return item


@router.post('/submit')
async def submit_quest(submission: Submission, authorization: str | None = Header(default=None)):
    decoded = _decode(authorization)
    uid = decoded['uid']
    item = quest(submission.quest_id)
    if not item:
        raise HTTPException(status_code=404, detail='Quest not found.')
    profile = user_profile(uid)
    if not profile:
        raise HTTPException(status_code=404, detail='Campus Quest profile not found.')

    completed = profile.get('completedQuests') or []
    if item['id'] in completed:
        return {'success': False, 'quest_id': item['id'], 'status': 'ALREADY_COMPLETED', 'message': 'You have already completed this quest.', 'passed_tests': 1, 'total_tests': 1, 'execution_time_ms': 0, 'xp_awarded': 0, 'new_total_xp': int(profile.get('xp', 0)), 'profile': profile}

    expected = str(item.get('correctOption', ''))
    correct = submission.answer.strip() == expected
    attempts = int(profile.get('totalAttempts', 0)) + 1
    if not correct:
        accuracy = round((int(profile.get('correctAttempts', 0)) / attempts) * 100, 1)
        updated = update_user(uid, {'totalAttempts': attempts, 'accuracy': accuracy, 'updatedAt': datetime.now(timezone.utc).isoformat()})
        return {'success': False, 'quest_id': item['id'], 'status': 'WRONG_ANSWER', 'message': 'Incorrect answer. Try again.', 'passed_tests': 0, 'total_tests': 1, 'execution_time_ms': 0, 'xp_awarded': 0, 'new_total_xp': int((updated or profile).get('xp', 0)), 'profile': updated or profile}

    xp_award = int(item.get('xp', 0))
    xp = int(profile.get('xp', 0)) + xp_award
    correct_attempts = int(profile.get('correctAttempts', 0)) + 1
    accuracy = round((correct_attempts / attempts) * 100, 1)
    level, next_level = _level_for_xp(xp)
    solved = int(profile.get('solvedCount', 0)) + 1
    streak = int(profile.get('streakDays', 0)) + 1
    best = max(int(profile.get('bestStreak', 0)), streak)
    updates = {
        'xp': xp, 'solvedCount': solved, 'accuracy': accuracy,
        'totalAttempts': attempts, 'correctAttempts': correct_attempts,
        'level': level, 'levelTitle': 'CADET' if level < 3 else 'EXPLORER' if level < 5 else 'QUEST MASTER',
        'nextLevelXp': next_level, 'streakDays': streak, 'bestStreak': best,
        'inkSeals': solved, 'completedQuests': [*completed, item['id']],
        'updatedAt': datetime.now(timezone.utc).isoformat(),
    }
    updated = update_user(uid, updates)
    if not updated:
        raise HTTPException(status_code=404, detail='Campus Quest profile disappeared during update.')
    append_activity({'uid': uid, 'type': 'quest_completed', 'questId': item['id'], 'xp': xp_award, 'createdAt': datetime.now(timezone.utc).isoformat()})
    return {'success': True, 'quest_id': item['id'], 'status': 'ACCEPTED', 'message': f'Quest complete. +{xp_award} XP awarded.', 'passed_tests': 1, 'total_tests': 1, 'execution_time_ms': 0, 'xp_awarded': xp_award, 'new_total_xp': xp, 'profile': updated}
