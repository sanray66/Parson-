from sqlalchemy.engine import Result
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.user_messages import UserMessage
from schemas.user_messages import UserMessageCreate
from uuid import UUID


async def get_user_messages(session: AsyncSession, user_id: UUID) -> UserMessage:
    stmt = select(UserMessage).where(UserMessage.user_id == user_id)
    result = await session.execute(stmt)
    return list(result.scalars().all())

async def create_user_messages(session: AsyncSession, user_messages_in: UserMessageCreate) -> UserMessage:
    user_messages = UserMessage(**user_messages_in.model_dump())
    session.add(user_messages)
    await session.commit()
    await session.refresh(user_messages)
    return user_messages





