from fastapi import APIRouter
import time
from config import settings

router = APIRouter(prefix='', tags=['System'])

@router.get('/health')
async def health_check():
    return {'status': 'online', 'service': settings.APP_NAME, 'version': settings.APP_VERSION, 'timestamp': time.time()}
