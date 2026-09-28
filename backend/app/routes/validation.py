from app.models.validation_history import ValidationHistory
from app.models.validation_result import ValidationResult
from datetime import datetime, timezone
from sqlalchemy.orm import Session

import time

from app.database.session import get_db
from app.models.validation import Validation

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pathlib import Path
import shutil

from app.config import PDF_UPLOAD_DIR, EXCEL_UPLOAD_DIR
from app.services.document_reader import extract_pdf_text
from app.services.field_extractor import extract_fields_from_text
from app.services.excel_reader import extract_fields_from_excel
from app.services.comparison import compare_fields
from app.models.user import User
from app.utils.dependencies import get_current_user


router = APIRouter(
    prefix="/validation",
    tags=["Validation"]
)


@router.post("/upload")
def upload_and_validate(
    pdf_file: UploadFile = File(...),
    excel_file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Start processing timer
    start_time = time.perf_counter()

    # Check PDF
    if not pdf_file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF file"
        )

    # Check Excel
    if not excel_file.filename.lower().endswith((".xlsx", ".xls")):
        raise HTTPException(
            status_code=400,
            detail="Please upload an Excel file"
        )

    validation = Validation(
        user_id=current_user.id,
        pdf_filename=pdf_file.filename,
        excel_filename=excel_file.filename,
        status="processing"
    )

    db.add(validation)
    db.commit()
    db.refresh(validation)

    # Save PDF
    pdf_path = PDF_UPLOAD_DIR / Path(pdf_file.filename).name

    with open(pdf_path, "wb") as buffer:
        shutil.copyfileobj(pdf_file.file, buffer)

    # Save Excel
    excel_path = EXCEL_UPLOAD_DIR / Path(excel_file.filename).name

    with open(excel_path, "wb") as buffer:
        shutil.copyfileobj(excel_file.file, buffer)

    # Extract PDF text
    pdf_text = extract_pdf_text(pdf_path)

    # Extract PDF fields
    document_fields = extract_fields_from_text(pdf_text)

    # Extract Excel fields
    excel_fields = extract_fields_from_excel(excel_path)

    # Compare fields
    validation_result = compare_fields(
        document_fields,
        excel_fields
    )

    # Calculate processing time
    processing_seconds = time.perf_counter() - start_time
    processing_time = f"{processing_seconds:.2f}s"

    # Add processing time to the validation response
    validation_result["processing_time"] = processing_time

    # Save individual comparison results
    for result in validation_result["results"]:
        validation_result_record = ValidationResult(
            validation_id=validation.id,
            field_name=result["field"],
            document_value=result["document_value"],
            excel_value=result["excel_value"],
            status=result["status"]
        )

        db.add(validation_result_record)

    # Mark validation as completed
    validation.status = "completed"
    validation.completed_at = datetime.now(timezone.utc)

    # Save validation history
    history = ValidationHistory(
        user_id=current_user.id,
        validation_id=validation.id,
        pdf_filename=pdf_file.filename,
        excel_filename=excel_file.filename,
        accuracy=validation_result["accuracy"],
        matched_count=validation_result["matched_count"],
        mismatches_count=validation_result["mismatches_count"],
        processing_time=processing_time
    )

    db.add(history)

    db.commit()
    db.refresh(validation)

    return {
        "message": "Validation completed successfully",
        "pdf_filename": pdf_file.filename,
        "excel_filename": excel_file.filename,
        "validation": validation_result
    }