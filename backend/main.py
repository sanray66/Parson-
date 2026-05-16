from fastapi import FastAPI
import uvicorn 
from contextlib import asynccontextmanager
from models.base import Base
from core.database import db_helper
from routs import users_router, analysis_results, user_message
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager 
async def lifespan(app: FastAPI):
    async with db_helper.engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

app.include_router(users_router)
app.include_router(user_message)
app.include_router(analysis_results)

if __name__ == '__main__':
    uvicorn.run('main:app', reload=True, host='0.0.0.0', port=8000)