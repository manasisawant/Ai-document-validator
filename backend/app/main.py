from fastapi import FastAPI, UploadFile, File
from sqlalchemy import text

from app.services.pdf_service import extract_text_from_pdf

import shutil
import os

from app.database.connection import engine

# Create FastAPI application
app = FastAPI()

# Create upload folders if they don't exist
os.makedirs("uploads/pdfs", exist_ok=True)
os.makedirs("uploads/excel", exist_ok=True)


# ----------------------------
# Home Route
# ----------------------------
@app.get("/")
def home():
    return {
        "message": "AI Document Validator Backend Running"
    }


# ----------------------------
# Health Check Route
# ----------------------------
@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# ----------------------------
# Get Documents from Database
# ----------------------------
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


# ----------------------------
# Upload File Route
# ----------------------------
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    # Get file extension
    extension = os.path.splitext(file.filename)[1].lower()

    # Allowed file types
    allowed_extensions = [".pdf", ".xlsx", ".xls"]

    if extension not in allowed_extensions:
        return {
            "error": "Only PDF and Excel files are allowed"
        }

    # Decide storage folder
    if extension == ".pdf":
        folder = "uploads/pdfs"
    else:
        folder = "uploads/excel"

    # Create complete file path
    file_path = f"{folder}/{file.filename}"

    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Save metadata in database
    with engine.connect() as connection:

        connection.execute(
            text("""
                INSERT INTO documents
                (filename, status)
                VALUES
                (:filename, :status)
            """),
            {
                "filename": file.filename,
                "status": "uploaded"
            }
        )

        connection.commit()

    return {
        "message": "File uploaded successfully",
        "filename": file.filename,
        "path": file_path
    }

@app.get("/extract-text/{filename}")
def extract_text(filename: str):

    pdf_path = f"uploads/pdfs/{filename}"

    text = extract_text_from_pdf(pdf_path)

    return {
        "filename": filename,
        "text": text
    }