from fastapi import APIRouter, Depends

from database import users_collection
from security import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("/me")
def get_my_profile(current_user: dict = Depends(get_current_user)):

    user = users_collection.find_one(
        {"_id": __import__("bson").ObjectId(current_user["user_id"])},
        {"password": 0}
    )

    if not user:
        return {"message": "User not found"}

    user["_id"] = str(user["_id"])

    return user