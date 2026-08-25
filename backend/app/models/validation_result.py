from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey
from app.database.base import Base


class ValidationResult(Base):
    __tablename__ = "validation_results"

    id = Column(Integer, primary_key=True, index=True)

    validation_id = Column(
        Integer,
        ForeignKey("validations.id"),
        nullable=False,
        index=True
    )

    field_name = Column(String(150), nullable=False)

    document_value = Column(Text, nullable=True)
    excel_value = Column(Text, nullable=True)

    status = Column(
        String(50),
        nullable=False
    )

    confidence = Column(
        Float,
        nullable=True
    )