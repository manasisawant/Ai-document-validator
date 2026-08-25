from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database.base import Base


class Validation(Base):
    __tablename__ = "validations"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    pdf_filename = Column(String(255), nullable=False)
    excel_filename = Column(String(255), nullable=False)

    status = Column(
        String(50),
        nullable=False,
        default="pending"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    completed_at = Column(
        DateTime(timezone=True),
        nullable=True
    )