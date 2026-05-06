from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.user_messages import UserMessageCreate, UserMessageResponse
from core.database import db_helper
from serveses import user_messages
from uuid import UUID

router = APIRouter(
    tags=["Ответы пользователей"],
    prefix='/user_message'
)

@router.get('/{user_id}/', response_model=list[UserMessageResponse])
async def get_user_message(user_id: UUID, session: AsyncSession = Depends(db_helper.session_dependebcy)):
    return await user_messages.get_user_messages(user_id=user_id, session=session)



