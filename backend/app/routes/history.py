from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.validation_history import ValidationHistory
from app.models.user import User
from app.utils.dependencies import get_current_user
from app.schemas.auth import HistoryResponse
from app.models.validation_result import ValidationResult


router = APIRouter(
    prefix="/history",
    tags=["Validation History"]
)

@router.get("/", response_model=list[HistoryResponse])
def get_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    history = (
        db.query(ValidationHistory)
        .filter(ValidationHistory.user_id == current_user.id)
        .order_by(ValidationHistory.id.desc())
        .all()
    )

    return history

@router.get("/{validation_id}")
def get_validation_details(
    validation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    results = (
        db.query(ValidationResult)
        .join(
            ValidationHistory,
            ValidationHistory.validation_id == ValidationResult.validation_id
        )
        .filter(
            ValidationResult.validation_id == validation_id,
            ValidationHistory.user_id == current_user.id
        )
        .all()
    )

    return results