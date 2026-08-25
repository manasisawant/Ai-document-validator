from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database.base import Base


class ValidationHistory(Base):
    __tablename__ = "validation_history"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
        index=True
    )

    validation_id = Column(
        Integer,
        ForeignKey("validations.id"),
        nullable=False,
        index=True
    )

    pdf_filename = Column(String(255), nullable=False)
    excel_filename = Column(String(255), nullable=False)

    accuracy = Column(Float, nullable=False, default=0.0)

    matched_count = Column(Integer, nullable=False, default=0)
    mismatches_count = Column(Integer, nullable=False, default=0)

    processing_time = Column(String(50), nullable=True)

    validated_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )