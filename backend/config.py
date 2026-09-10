import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = 'Campus Quest API'
    APP_VERSION: str = '2.0.0'
    API_PREFIX: str = '/api'
    HOST: str = os.getenv('HOST', '0.0.0.0')
    PORT: int = int(os.getenv('PORT', '8001'))
    CORS_ORIGINS: list[str] = [x.strip() for x in os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000').split(',') if x.strip()]

settings = Settings()
