from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID
from datetime import datetime


class MessageAnswers(BaseModel):
    question_1: str
    question_2: str
    question_3: str
    question_4: str
    question_5: str
    question_6: str
    question_7: str
    question_8: str
    question_9: str
    question_10: str

class UserMessageCreate(BaseModel):
    user_id: UUID
    answers: MessageAnswers

class UserMessageResponse(BaseModel):
    id: UUID
    user_id: UUID
    answers: MessageAnswers
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

    