from .base import Base
import uuid
from datetime import datetime
from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from .user import User 


class AnalysisResult(Base):
    __tablename__ = "analysis_results"
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    result_data: Mapped[dict] = mapped_column(JSONB, nullable=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    user: Mapped["User"] = relationship(back_populates="analysis_results")