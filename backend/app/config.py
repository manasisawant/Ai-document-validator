import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

# Project root
BASE_DIR = Path(__file__).resolve().parent.parent

# Upload directories
UPLOAD_DIR = BASE_DIR / "uploads"
PDF_UPLOAD_DIR = UPLOAD_DIR / "pdfs"
EXCEL_UPLOAD_DIR = UPLOAD_DIR / "excel"

# Create upload directories if they don't exist
PDF_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
EXCEL_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Allowed file types
ALLOWED_PDF_EXTENSIONS = {".pdf"}
ALLOWED_EXCEL_EXTENSIONS = {".xlsx", ".xls"}

# Maximum file size: 10 MB
MAX_FILE_SIZE = 10 * 1024 * 1024

#Authentication
SECRET_KEY = os.getenv("SECRET_KEY")