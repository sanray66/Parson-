from models.analysis_results import AnalysisResult
from serveses.ai_serveses import get_psychological_analysis
from schemas.analysis_results import AnalysisResultResponse, AnalysisResultCreate
from schemas.user_messages import UserMessageCreate
from sqlalchemy.ext.asyncio import AsyncSession
from serveses.user_messages import create_user_messages
from models.analysis_results import AnalysisResult
from sqlalchemy import select
from uuid import UUID


async def create_analisis_results(session: AsyncSession, analysis_text: str, user_id) -> AnalysisResult:
    result_dict = {"full_analysis": analysis_text}
    
    analysis_results = AnalysisResult(
        user_id=user_id, 
        result_data=result_dict
    )
    session.add(analysis_results)
    await session.commit()
    await session.refresh(analysis_results)
    return analysis_results

async def analysis(session: AsyncSession, user_messages_in: UserMessageCreate) -> AnalysisResultResponse:
    await create_user_messages(session, user_messages_in)
    analysis_text = await get_psychological_analysis(user_messages_in)
    db_obj = await create_analisis_results(session, analysis_text, user_messages_in.user_id)
    
    return AnalysisResultResponse(
        id=db_obj.id,
        user_id=db_obj.user_id,
        full_analysis=db_obj.result_data["full_analysis"],
        created_at=db_obj.created_at
    )

async def get_analysis(session: AsyncSession, user_id: UUID):
    stmt = select(AnalysisResult).where(AnalysisResult.user_id == user_id)
    result = await session.execute(stmt)
    analysis = result.scalars().all()
    return list(analysis)

