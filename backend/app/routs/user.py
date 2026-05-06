from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from serveses import user
from schemas.user import UserCreate, User
from core.database import db_helper
from uuid import UUID

router = APIRouter(
    tags=["Пользователи"],
    prefix='/users'
)


@router.get('/', response_model=list[User])
async def get_users(session: AsyncSession = Depends(db_helper.session_dependebcy)):
    return await user.get_users(session=session)


@router.post('/', response_model=User)
async def create_user(user_in: UserCreate, session: AsyncSession = Depends(db_helper.session_dependebcy)):
    return await user.user_create(session=session, user_in=user_in)


@router.get('/{user_id}/', response_model=User)
async def get_user(user_id: UUID, session: AsyncSession = Depends(db_helper.session_dependebcy)):
    product = await user.get_user(user_id=user_id, session=session)
    if product is not None:
        return product
    
    raise HTTPException (
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Товара с id {user_id} несуществует",
    )