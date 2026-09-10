from fastapi import APIRouter
from database import seals

router = APIRouter(prefix='/seals', tags=['Achievements'])

@router.get('')
async def list_seals():
    return seals()
