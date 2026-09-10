import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routers import auth_router, quests_router, leaderboard_router, seals_router, telemetry_router

app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION, description='Campus Quest API using Firebase Authentication and JSON storage', docs_url='/docs', redoc_url='/redoc')
app.add_middleware(CORSMiddleware, allow_origins=settings.CORS_ORIGINS, allow_credentials=True, allow_methods=['*'], allow_headers=['*'])
app.include_router(telemetry_router, prefix=settings.API_PREFIX)
app.include_router(auth_router, prefix=settings.API_PREFIX)
app.include_router(quests_router, prefix=settings.API_PREFIX)
app.include_router(leaderboard_router, prefix=settings.API_PREFIX)
app.include_router(seals_router, prefix=settings.API_PREFIX)

@app.get('/')
async def root():
    return {'message': 'Campus Quest API is operational.', 'docs': '/docs', 'health': f'{settings.API_PREFIX}/health'}

if __name__ == '__main__':
    uvicorn.run('main:app', host=settings.HOST, port=settings.PORT, reload=True)
