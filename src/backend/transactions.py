from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

from demo_db import transactions
from security import get_current_user

router = APIRouter(prefix="/transactions", tags=["Transactions"])


class TransactionCreate(BaseModel):
    type: str
    amount: float
    category: str
    description: str


@router.post("/")
def create_transaction(
    transaction: TransactionCreate,
    current_user: dict = Depends(get_current_user)
):
    if transaction.type not in ["income", "expense"]:
        raise HTTPException(
            status_code=400,
            detail="Type must be income or expense"
        )

    if transaction.amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Amount must be greater than zero"
        )

    transaction_data = {
        "id": str(len(transactions) + 1),
        "user_id": current_user["user_id"],
        "type": transaction.type,
        "amount": transaction.amount,
        "category": transaction.category,
        "description": transaction.description,
        "created_at": datetime.utcnow()
    }

    transactions.append(transaction_data)

    return {
        "message": "Transaction added successfully",
        "transaction_id": transaction_data["id"]
    }


@router.get("/")
def get_transactions(
    type: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    result = [
        transaction for transaction in transactions
        if transaction["user_id"] == current_user["user_id"]
    ]

    if type:
        if type not in ["income", "expense"]:
            raise HTTPException(
                status_code=400,
                detail="Type must be income or expense"
            )
        result = [
            t for t in result
            if t["type"] == type
        ]

    if category:
        result = [
            t for t in result
            if t["category"] == category
        ]

    if search:
        search_lower = search.lower()
        result = [
            t for t in result
            if search_lower in t["description"].lower()
        ]

    return {
        "transactions": result,
        "count": len(result)
    }