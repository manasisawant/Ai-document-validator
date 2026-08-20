from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
import shutil
import os
import json

from app.database.connection import engine
from app.database.base import Base
from app.models.validation_history import ValidationHistory

from app.services.pdf_service import extract_text_from_pdf
from app.services.excel_service import read_excel
from app.services.validation_service import validate_document

# FastAPI Application

app = FastAPI(
    title="AI Document Validator",
    description="Validate PDF documents against Excel data",
    version="1.0"
)
 # Create Database Tables
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

    # Save validation result to database
    with engine.connect() as connection:

        connection.execute(
            text("""
                INSERT INTO validation_history
                (
                    pdf_filename,
                    excel_filename,
                    accuracy,
                    matched_count,
                    mismatches_count,
                    processing_time,
                    status,
                    comparison_results
                )
                VALUES
                (
                    :pdf_filename,
                    :excel_filename,
                    :accuracy,
                    :matched_count,
                    :mismatches_count,
                    :processing_time,
                    :status,
                    :comparison_results
                )
            """),
            {
                "pdf_filename": pdf_file.filename,
                "excel_filename": excel_file.filename,
                "accuracy": validation_result["accuracy"],
                "matched_count": validation_result["matched_count"],
                "mismatches_count": validation_result["mismatches_count"],
                "processing_time": validation_result["processing_time"],
                "status": validation_result["status"],
                "comparison_results": json.dumps(
                     validation_result["comparison_results"]
                )
            }
        )

        connection.commit()

    return validation_result

# Get Validation History

@app.get("/validation-history")
def get_validation_history():

    with engine.connect() as connection:

        result = connection.execute(
            text("""
                SELECT
                    id,
                    pdf_filename,
                    excel_filename,
                    accuracy,
                    matched_count,
                    mismatches_count,
                    processing_time,
                    status,
                    validated_at
                FROM validation_history
                ORDER BY validated_at DESC
            """)
        )

        history = []

        for row in result:
            history.append({
                "id": row.id,
                "pdf_filename": row.pdf_filename,
                "excel_filename": row.excel_filename,
                "accuracy": row.accuracy,
                "matched_count": row.matched_count,
                "mismatches_count": row.mismatches_count,
                "processing_time": row.processing_time,
                "status": row.status,
                "validated_at": row.validated_at
            })

    return history

@app.get("/validation-history")
def get_validation_history():
    # your existing code...
    
    return history


# Delete a validation history record

@app.delete("/validation-history/{history_id}")
def delete_validation_history(history_id: int):

    with engine.connect() as connection:

        result = connection.execute(
            text("""
                DELETE FROM validation_history
                WHERE id = :history_id
            """),
            {
                "history_id": history_id
            }
        )

        connection.commit()

        if result.rowcount == 0:
            return {
                "status": "error",
                "message": "Validation history record not found"
            }

    return {
        "status": "success",
        "message": "Validation history deleted successfully"
    }

# Get Detailed Validation Report

@app.get("/validation-history/{history_id}")
def get_validation_report(history_id: int):

    with engine.connect() as connection:

        result = connection.execute(
            text("""
                SELECT
                    id,
                    pdf_filename,
                    excel_filename,
                    accuracy,
                    matched_count,
                    mismatches_count,
                    processing_time,
                    status,
                    comparison_results,
                    validated_at
                FROM validation_history
                WHERE id = :history_id
            """),
            {
                "history_id": history_id
            }
        ).fetchone()

    if not result:
        return {
            "status": "error",
            "message": "Validation history not found"
        }

    return {
        "id": result.id,
        "pdf_filename": result.pdf_filename,
        "excel_filename": result.excel_filename,
        "accuracy": result.accuracy,
        "matched_count": result.matched_count,
        "mismatches_count": result.mismatches_count,
        "processing_time": result.processing_time,
        "status": result.status,
        "comparison_results": result.comparison_results,
        "validated_at": result.validated_at
    }