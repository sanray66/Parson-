from typing import List
from .base import Base
from sqlalchemy import String, Integer, DateTime, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from .user_messages import UserMessage
    from .analysis_results import AnalysisResult


class User(Base):
    __tablename__ = "users"
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    user_messages: Mapped[List["UserMessage"]] = relationship(
        back_populates="user", 
        cascade="all, delete-orphan"
    )
    analysis_results: Mapped[List["AnalysisResult"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )
 