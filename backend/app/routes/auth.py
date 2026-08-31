from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    UserResponse
)
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# =========================
# REGISTER
# =========================

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register(
    user_data: RegisterRequest,
    db: Session = Depends(get_db)
):
    # Check whether email already exists
    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered"
        )

    # Create new user
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hash_password(user_data.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# =========================
# LOGIN
# =========================

@router.post("/login")
def login(
    user_data: LoginRequest,
    db: Session = Depends(get_db)
):
    # Find user by email
    user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    # User does not exist
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    password_valid = verify_password(
        user_data.password,
        user.password_hash
    )

    # Password is incorrect
    if not password_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Create JWT access token
    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }