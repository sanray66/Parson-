from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.user_messages import UserMessageCreate, UserMessageResponse
from core.database import db_helper
from serveses import user_messages
from schemas.analysis_results import AnalysisResultResponse
from uuid import UUID
from serveses import analysis_results


router = APIRouter(
    tags=["Анализ ответов"],
    prefix='/analysis'
)

@router.get('/{user_id}/')
async def get_analysis(user_id: UUID, session: AsyncSession = Depends(db_helper.session_dependebcy)):
    return await analysis_results.get_analysis(user_id=user_id, session=session)

@router.post('/', response_model=AnalysisResultResponse)
async def analysis(user_messages_in: UserMessageCreate, session: AsyncSession = Depends(db_helper.session_dependebcy)):
    return await analysis_results.analysis(session=session, user_messages_in=user_messages_in)



