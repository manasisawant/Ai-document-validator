from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import sessionmaker


DATABASE_URL = URL.create(
    drivername="postgresql+psycopg2",
    username="postgres",
    password="YourNewPassword123",
    host="localhost",
    port=5432,
    database="ai_document_validator",
)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)