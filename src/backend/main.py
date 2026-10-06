from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from auth import router as auth_router
from profile import router as profile_router
from transactions import router as transactions_router
from dashboard import router as dashboard_router
from budgets import router as budgets_router
from analytics import router as analytics_router
from wellness import router as wellness_router


app = FastAPI(
    title="FinSight API",
    description="Personal Finance Management API",
    version="1.0.0",
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API routes
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(transactions_router)
app.include_router(dashboard_router)
app.include_router(budgets_router)
app.include_router(analytics_router)
app.include_router(wellness_router)


@app.get("/")
def root():
    return {
        "message": "FinSight API is running",
        "status": "online",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "FinSight API",
    }