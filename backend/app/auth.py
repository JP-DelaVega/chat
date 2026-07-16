import os
from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from pymongo import MongoClient

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("JWT_SECRET", "dev-secret-change-me")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


class AuthUser(BaseModel):
    email: str


class AuthPayload(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: AuthUser


class UserRecord(BaseModel):
    email: str
    password_hash: str


def get_mongo_client():
    mongo_uri = os.getenv("MONGODB_URI")
    if not mongo_uri:
        raise RuntimeError("MONGODB_URI is not set")
    return MongoClient(mongo_uri)


def get_users_collection():
    client = get_mongo_client()
    db = client.get_default_database()
    return db.get_collection("users")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(email: str) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": email, "exp": expires_at}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def authenticate_user(email: str, password: str) -> Optional[dict]:
    collection = get_users_collection()
    user = collection.find_one({"email": email})
    if not user or not verify_password(password, user["password_hash"]):
        return None
    return {"email": user["email"]}


def get_current_user_from_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except Exception:
        return None
    email = payload.get("sub")
    if not email:
        return None
    return {"email": email}
