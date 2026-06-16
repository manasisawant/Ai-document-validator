from fastapi import APIRouter, UploadFile, File
import os

router = APIRouter()

UPLOAD_DIR = "uploads"

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    extension = file.filename.split(".")[-1]

    if extension not in ["pdf", "xlsx", "xls"]:
        return {"error": "Unsupported file type"}

    folder = "pdfs" if extension == "pdf" else "excel"

    filepath = os.path.join(
        UPLOAD_DIR,
        folder,
        file.filename
    )

    with open(filepath, "wb") as buffer:
        buffer.write(await file.read())

    return {
        "message": "Upload successful",
        "filename": file.filename
    }