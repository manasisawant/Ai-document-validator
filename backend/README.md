# AI Document Validator

# Overview

AI Document Validator is a web-based application that validates invoice data by comparing information extracted from PDF invoices against data entered in Excel sheets.

The system helps reduce manual verification effort and identifies mismatches between invoice documents and manually entered records.

# Features

* Upload PDF invoices
* Upload Excel files containing expected invoice data
* Extract text from PDF documents
* Read Excel data using Pandas
* Compare invoice values with Excel records
* Calculate validation accuracy
* Identify matched and mismatched fields
* Return validation results through REST APIs

# Tech Stack

# Backend

* Python
* FastAPI
* PostgreSQL
* SQLAlchemy
* Pandas
* PyMuPDF (fitz)

# Tools

* Git
* GitHub
* VS Code

# Workflow

1. User uploads a PDF invoice and an Excel file.
2. Backend stores the uploaded files.
3. PDF text is extracted using PyMuPDF.
4. Excel data is read using Pandas.
5. Validation service compares PDF values with Excel values.
6. Accuracy and mismatch reports are generated.
7. Results are returned to the frontend dashboard.

# API Endpoints

# Home

GET /

Response:

{
"message": "AI Document Validator Backend Running"
}

# Health Check

GET /health

Response:

{
"status": "healthy"
}

# Upload File

POST /upload

Supported Files:

* PDF
* XLSX

# Extract PDF Text

GET /extract-text/{filename}

Returns extracted PDF text.

# Read Excel Data

GET /read-excel/{filename}

Returns Excel data as JSON.

# Validate Invoice

POST /validate

Request:

* pdf_file
* excel_file

Response:

{
"status": "success",
"accuracy": 83.33,
"matched_count": 5,
"mismatches_count": 1,
"processing_time": "0.0 sec",
"comparison_results": []
}

# Example Validation

# Excel Data

| Invoice Number | Customer Name | Amount |
| -------------- | ------------- | ------ |
| INV001         | Rahul Sharma  | 10000  |

# PDF Data

Invoice Number: INV001

Customer Name: Rahul Sharma

Amount: 10000

# Result

Accuracy: 100%

Matched Fields: 3

Mismatch Fields: 0


# Future Enhancements

* OCR support for scanned invoices
* AI-based field extraction
* Date format normalization
* Advanced invoice matching
* Dashboard analytics
* Bulk document validation

# Author

Mohini Pardeshi
B.Sc Computer Science
Pune, Maharashtra