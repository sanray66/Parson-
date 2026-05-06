from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, async_scoped_session, AsyncSession
from sqlalchemy.orm import sessionmaker
from core.config import settings
from asyncio import current_task

class DataBaseHelper:
    def __init__(self, url: str):
        self.engine = create_async_engine (
            url=url, 
        ) 
        self.session_factory = async_sessionmaker(
            bind=self.engine, 
            autoflush=False,
            autocommit=False,
            expire_on_commit=False
        )

    def get_scoped_session(self):
        session = async_scoped_session(
            session_factory=self.session_factory,
            scopefunc=current_task,
        )
        return session
    
    async def session_dependebcy(self) -> AsyncSession:
        async with self.session_factory() as session:
            yield session
            await session.close()




db_helper = DataBaseHelper(url=settings.database_url)