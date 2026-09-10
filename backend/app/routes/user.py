from fastapi import APIRouter, Depends

from app.models.user import User
from app.utils.dependencies import get_current_user


router = APIRouter(
    prefix="/user",
    tags=["User"]
)


@router.get("/me")
def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }