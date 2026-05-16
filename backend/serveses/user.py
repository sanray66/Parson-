from sqlalchemy.engine import Result
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.user import User
from schemas.user import UserCreate
from uuid import UUID


async def get_users(session: AsyncSession) -> list[User]:
    stmt = select(User).order_by(User.id)
    result: Result = await session.execute(stmt)
    users = result.scalars().all()
    return list(users)


async def get_user(session: AsyncSession, user_id: UUID) -> User | None:
    return await session.get(User, user_id)

async def user_create(session: AsyncSession, user_in: UserCreate) -> User:
    user = User(**user_in.model_dump()) 
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user