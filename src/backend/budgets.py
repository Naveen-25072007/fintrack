from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime

from demo_db import budgets, transactions
from security import get_current_user

router = APIRouter(prefix="/budgets", tags=["Budgets"])


class BudgetCreate(BaseModel):
    category: str
    amount: float


@router.post("/")
def create_budget(
    budget: BudgetCreate,
    current_user: dict = Depends(get_current_user)
):
    if budget.amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Budget amount must be greater than zero"
        )

    budget_data = {
        "id": str(len(budgets) + 1),
        "user_id": current_user["user_id"],
        "category": budget.category,
        "amount": budget.amount,
        "created_at": datetime.utcnow()
    }

    budgets.append(budget_data)

    return {
        "message": "Budget created successfully",
        "budget_id": budget_data["id"]
    }


@router.get("/")
def get_budgets(
    current_user: dict = Depends(get_current_user)
):
    user_budgets = [
        b for b in budgets
        if b["user_id"] == current_user["user_id"]
    ]

    result = []

    for budget in user_budgets:
        spent = sum(
            t["amount"]
            for t in transactions
            if t["user_id"] == current_user["user_id"]
            and t["type"] == "expense"
            and t["category"] == budget["category"]
        )

        remaining = budget["amount"] - spent

        usage_percentage = (
            (spent / budget["amount"]) * 100
            if budget["amount"] > 0
            else 0
        )

        result.append({
            "id": budget["id"],
            "category": budget["category"],
            "budget_amount": budget["amount"],
            "spent": round(spent, 2),
            "remaining": round(remaining, 2),
            "usage_percentage": round(usage_percentage, 2)
        })

    return {
        "budgets": result,
        "count": len(result)
    }