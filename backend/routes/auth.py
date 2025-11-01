from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from passlib.hash import bcrypt
from utils.jwt_handler import create_access_token
import motor.motor_asyncio

router = APIRouter()

# Local MongoDB connection
client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017")
db = client.crimAI
users_collection = db.users

class User(BaseModel):
    username: str
    email: str
    password: str

@router.post("/signup")
async def signup(user: User):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_pass = bcrypt.hash(user.password)
    new_user = {"username": user.username, "email": user.email, "password": hashed_pass}
    await users_collection.insert_one(new_user)
    return {"msg": "Signup successful"}

@router.post("/login")
async def login(user: User):
    existing = await users_collection.find_one({"email": user.email})
    if not existing or not bcrypt.verify(user.password, existing["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"email": existing["email"]})
    return {"msg": "Login successful", "token": token}
