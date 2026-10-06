from fastapi import APIRouter, Depends

from demo_db import transactions
from security import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def get_dashboard_summary(
    current_user: dict = Depends(get_current_user)
):
    user_transactions = [
        t for t in transactions
        if t["user_id"] == current_user["user_id"]
    ]

    total_income = sum(
        t["amount"]
        for t in user_transactions
        if t["type"] == "income"
    )

    total_expenses = sum(
        t["amount"]
        for t in user_transactions
        if t["type"] == "expense"
    )

    balance = total_income - total_expenses

    savings_rate = (
        (balance / total_income) * 100
        if total_income > 0
        else 0
    )

    return {
        "total_income": round(total_income, 2),
        "total_expenses": round(total_expenses, 2),
        "balance": round(balance, 2),
        "savings_rate": round(savings_rate, 2)
    }