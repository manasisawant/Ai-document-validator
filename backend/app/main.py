from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.routes.auth import router as auth_router
from app.routes.user import router as user_router
from app.routes.validation import router as validation_router
from app.routes.history import router as history_router

from app.models.user import User

from app.utils.dependencies import get_current_user


app = FastAPI(
    title="AI Document Validator",
    description="PDF and Excel document validation system",
    version="1.0.0"
)


# --------------------------------------------------
# CORS Configuration
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Authentication routes
# --------------------------------------------------

app.include_router(auth_router)


# --------------------------------------------------
# User routes
# --------------------------------------------------

app.include_router(user_router)


# --------------------------------------------------
# Validation routes
# --------------------------------------------------

app.include_router(validation_router)


# --------------------------------------------------
# History routes
# --------------------------------------------------

app.include_router(history_router)


# --------------------------------------------------
# Root endpoint
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "AI Document Validator API is running"
    }


# --------------------------------------------------
# Temporary protected test endpoint
# --------------------------------------------------

@app.get("/test-auth")
def test_auth(
    current_user: User = Depends(get_current_user)
):
    return {
        "message": "Authentication successful",
        "user_id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }