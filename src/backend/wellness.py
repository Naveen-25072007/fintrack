from fastapi import APIRouter, Depends

from demo_db import transactions, budgets
from security import get_current_user

router = APIRouter(
    prefix="/wellness",
    tags=["Financial Wellness"]
)


@router.get("/score")
def get_wellness_score(
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

    if total_income > 0:
        savings_rate = (
            (total_income - total_expenses)
            / total_income
        ) * 100
    else:
        savings_rate = 0

    savings_score = min(max(savings_rate, 0) * 0.4, 40)

    user_budgets = [
        b for b in budgets
        if b["user_id"] == current_user["user_id"]
    ]

    budget_score = 30 if user_budgets else 10

    if total_income > 0:
        expense_ratio = (
            total_expenses / total_income
        ) * 100
    else:
        expense_ratio = 100

    if expense_ratio <= 50:
        expense_score = 20
    elif expense_ratio <= 70:
        expense_score = 15
    elif expense_ratio <= 90:
        expense_score = 10
    else:
        expense_score = 5

    activity_score = 10 if user_transactions else 0

    total_score = round(
        savings_score
        + budget_score
        + expense_score
        + activity_score
    )

    total_score = min(total_score, 100)

    if total_score >= 80:
        status = "Excellent"
    elif total_score >= 60:
        status = "Good"
    elif total_score >= 40:
        status = "Needs Improvement"
    else:
        status = "At Risk"

    return {
        "score": total_score,
        "status": status,
        "savings_rate": round(savings_rate, 2),
        "total_income": round(total_income, 2),
        "total_expenses": round(total_expenses, 2)
    }