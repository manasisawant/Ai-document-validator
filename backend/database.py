from sqlalchemy import create_engine

DATABASE_URL = "postgresql://postgres:YOURPASSWORD@localhost:5432/ai_document_validator"

engine = create_engine(DATABASE_URL)
