from fastapi import FastAPI

from app.routes.auth import router as auth_router


app = FastAPI(
    title="AI Document Validator",
    description="PDF and Excel document validation system",
    version="1.0.0"
)


# Authentication routes
app.include_router(auth_router)


@app.get("/")
def root():
    return {
        "message": "AI Document Validator API is running"
    }