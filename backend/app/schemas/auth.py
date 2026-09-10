from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True

class HistoryResponse(BaseModel):
    validation_id: int
    pdf_filename: str
    excel_filename: str
    accuracy: float
    matched_count: int
    mismatches_count: int
    processing_time: str | None = None

    class Config:
        from_attributes = True