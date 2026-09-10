from .auth import router as auth_router
from .quests import router as quests_router
from .leaderboard import router as leaderboard_router
from .seals import router as seals_router
from .telemetry import router as telemetry_router

__all__ = ['auth_router', 'quests_router', 'leaderboard_router', 'seals_router', 'telemetry_router']
