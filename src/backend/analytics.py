from fastapi import APIRouter, Depends

from demo_db import transactions
from security import get_current_user

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/spending-by-category")
def spending_by_category(
    current_user: dict = Depends(get_current_user)
):
    category_totals = {}

    for transaction in transactions:
        if (
            transaction["user_id"] == current_user["user_id"]
            and transaction["type"] == "expense"
        ):
            category = transaction["category"]
            amount = transaction["amount"]

            category_totals[category] = (
                category_totals.get(category, 0) + amount
            )

    result = [
        {
            "category": category,
            "amount": round(amount, 2)
        }
        for category, amount in category_totals.items()
    ]

    result.sort(
        key=lambda x: x["amount"],
        reverse=True
    )

    return {
        "spending_by_category": result
    }