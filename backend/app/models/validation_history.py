from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.sql import func
from app.database.base import Base


class ValidationHistory(Base):

    __tablename__ = "validation_history"

    id = Column(Integer, primary_key=True, index=True)

    pdf_filename = Column(String, nullable=False)

    excel_filename = Column(String, nullable=False)

    accuracy = Column(Float, nullable=False)

    matched_count = Column(Integer, nullable=False)

    mismatches_count = Column(Integer, nullable=False)

    processing_time = Column(String, nullable=False)

    status = Column(String, nullable=False)

    comparison_results = Column(JSON, nullable=True)

    validated_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )