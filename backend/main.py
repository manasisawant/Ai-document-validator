from fastapi import FastAPI
from sqlalchemy import text
from database import engine

app = FastAPI()

@app.get("/")
def home():
    return {"message": "AI Document Validator Backend Running"}

@app.get("/documents")
def get_documents():
    with engine.connect() as connection:
        result = connection.execute(
            text("SELECT * FROM documents")
        )

        documents = []

        for row in result:
            documents.append({
                "id": row.id,
                "filename": row.filename,
                "status": row.status
            })

        return documents