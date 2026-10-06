from fastapi import APIRouter, HTTPException
from models import UserRegister, UserLogin
from security import get_current_user
from jose import jwt
import bcrypt
import os
from dotenv import load_dotenv

from demo_db import users

load_dotenv()

router = APIRouter(prefix="/auth", tags=["Authentication"])

JWT_SECRET = os.getenv("JWT_SECRET", "demo-secret-key")
ALGORITHM = "HS256"


@router.post("/register")
def register_user(user: UserRegister):

    existing_user = next(
        (u for u in users if u["email"] == user.email),
        None
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists"
        )

    hashed_password = bcrypt.hashpw(
        user.password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    user_data = {
        "id": str(len(users) + 1),
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "role": "user"
    }

    users.append(user_data)

    return {
        "message": "User registered successfully",
        "user_id": user_data["id"]
    }


@router.post("/login")
def login_user(user: UserLogin):

    existing_user = next(
        (u for u in users if u["email"] == user.email),
        None
    )

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    password_correct = bcrypt.checkpw(
        user.password.encode("utf-8"),
        existing_user["password"].encode("utf-8")
    )

    if not password_correct:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token_data = {
        "user_id": existing_user["id"],
        "email": existing_user["email"],
        "role": existing_user["role"]
    }

    access_token = jwt.encode(
        token_data,
        JWT_SECRET,
        algorithm=ALGORITHM
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer"
    }