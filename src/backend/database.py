import os

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise RuntimeError("MONGO_URI is not configured in .env")

client = MongoClient(MONGO_URI)

db = client["finsight"]

users_collection = db["users"]
transactions_collection = db["transactions"]
budgets_collection = db["budgets"]