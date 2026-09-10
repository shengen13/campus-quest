import json
import threading
from pathlib import Path
from typing import Optional

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / 'data'
USERS_FILE = DATA_DIR / 'users.json'
QUESTS_FILE = DATA_DIR / 'quests.json'
SEALS_FILE = DATA_DIR / 'seals.json'
ACTIVITY_FILE = DATA_DIR / 'activity.json'
LOCK = threading.RLock()


def _read(path: Path, default):
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        _write(path, default)
        return default
    try:
        with path.open('r', encoding='utf-8') as handle:
            return json.load(handle)
    except (json.JSONDecodeError, OSError):
        raise RuntimeError(f'Unable to read data file: {path.name}')


def _write(path: Path, value) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix(path.suffix + '.tmp')
    with temp.open('w', encoding='utf-8') as handle:
        json.dump(value, handle, indent=2, ensure_ascii=False)
        handle.write('\n')
    temp.replace(path)


def users() -> list[dict]:
    with LOCK:
        return _read(USERS_FILE, [])


def user_profile(uid: str) -> Optional[dict]:
    with LOCK:
        return next((u for u in _read(USERS_FILE, []) if u.get('uid') == uid), None)


def create_user(uid: str, profile: dict) -> dict:
    with LOCK:
        rows = _read(USERS_FILE, [])
        existing = next((u for u in rows if u.get('uid') == uid), None)
        if existing:
            return existing
        record = {**profile, 'uid': uid}
        rows.append(record)
        _write(USERS_FILE, rows)
        return record


def update_user(uid: str, changes: dict) -> Optional[dict]:
    with LOCK:
        rows = _read(USERS_FILE, [])
        for index, row in enumerate(rows):
            if row.get('uid') == uid:
                row.update(changes)
                rows[index] = row
                _write(USERS_FILE, rows)
                return row
        return None


def quest(quest_id: str) -> Optional[dict]:
    with LOCK:
        return next((q for q in _read(QUESTS_FILE, []) if q.get('id') == quest_id), None)


def quests(category: Optional[str] = None) -> list[dict]:
    with LOCK:
        result = _read(QUESTS_FILE, [])
        if category and category != 'all':
            result = [q for q in result if q.get('category') == category]
        return result


def seals() -> list[dict]:
    with LOCK:
        return _read(SEALS_FILE, [])


def leaderboard() -> list[dict]:
    with LOCK:
        return sorted(_read(USERS_FILE, []), key=lambda u: (-int(u.get('xp', 0)), u.get('name', '').lower()))


def append_activity(event: dict) -> None:
    with LOCK:
        rows = _read(ACTIVITY_FILE, [])
        rows.append(event)
        _write(ACTIVITY_FILE, rows[-1000:])
