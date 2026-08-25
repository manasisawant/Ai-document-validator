from app.database.base import Base
from app.database.connection import engine

# Import models so SQLAlchemy registers all tables
from app.models.user import User
from app.models.validation import Validation
from app.models.validation_result import ValidationResult
from app.models.validation_history import ValidationHistory


def init_db():
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully")


if __name__ == "__main__":
    init_db()