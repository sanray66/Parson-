from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID
from datetime import datetime

class AnalysisResultCreate(BaseModel):
    full_analysis: str = Field(..., description="Глубокий психологический разбор")

class AnalysisResultResponse(BaseModel):
    id: UUID
    user_id: UUID
    full_analysis: str = Field(..., description="Глубокий психологический разбор")
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


   

