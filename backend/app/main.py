from fastapi import FastAPI, UploadFile, File
from sqlalchemy import text
import shutil
import os

from app.database.connection import engine
from app.services.pdf_service import extract_text_from_pdf
from app.services.excel_service import read_excel
from app.services.validation_service import validate_document

# FastAPI Application

app = FastAPI(
    title="AI Document Validator",
    description="Validate PDF documents against Excel data",
    version="1.0"
)

# Create Upload Directories

os.makedirs("uploads/pdfs", exist_ok=True)
os.makedirs("uploads/excel", exist_ok=True)

# Home Route

@app.get("/")
def home():
    return {
        "message": "AI Document Validator Backend Running"
    }

# Health Check

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }

# Get Uploaded Documents

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

# Upload Single File

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    extension = os.path.splitext(file.filename)[1].lower()

    allowed_extensions = [".pdf", ".xlsx", ".xls"]

    if extension not in allowed_extensions:
        return {
            "error": "Only PDF and Excel files are allowed"
        }

    if extension == ".pdf":
        folder = "uploads/pdfs"
    else:
        folder = "uploads/excel"

    file_path = f"{folder}/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

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

# Extract Text From PDF

@app.get("/extract-text/{filename}")
def extract_text(filename: str):
    pdf_path = f"uploads/pdfs/{filename}"

    pdf_text = extract_text_from_pdf(pdf_path)

    return {
        "filename": filename,
        "text": pdf_text
    }

# Read Excel File

@app.get("/read-excel/{filename}")
def get_excel_data(filename: str):
    excel_path = f"uploads/excel/{filename}"

    excel_data = read_excel(excel_path)

    return {
        "filename": filename,
        "data": excel_data
    }

# Final Validation API

@app.post("/validate")
async def validate_files(
    pdf_file: UploadFile = File(...),
    excel_file: UploadFile = File(...)
):
    # Save PDF
    pdf_path = f"uploads/pdfs/{pdf_file.filename}"

    with open(pdf_path, "wb") as buffer:
        shutil.copyfileobj(pdf_file.file, buffer)

    # Save Excel
    excel_path = f"uploads/excel/{excel_file.filename}"

    with open(excel_path, "wb") as buffer:
        shutil.copyfileobj(excel_file.file, buffer)

    # Extract PDF Text
    pdf_text = extract_text_from_pdf(pdf_path)

    # Read Excel Data
    excel_data = read_excel(excel_path)

    # Validate
    validation_result = validate_document(
        pdf_text,
        excel_data
    )

    return validation_result
