from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.auth import (
    authenticate_user,
    create_access_token,
    get_current_user_from_token,
    get_users_collection,
    hash_password,
)
from app.rag.chain import rag_chain
from app.schemas import AuthRequest, AuthResponse, AuthUserResponse, QueryRequest

app = FastAPI(title="LeagueLore RAG API")
security = HTTPBearer(auto_error=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development; restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok"}


@app.post("/auth/register", response_model=AuthResponse)
def register(payload: AuthRequest):
    collection = get_users_collection()
    if collection.find_one({"email": payload.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    user_doc = {
        "email": payload.email,
        "password_hash": hash_password(payload.password),
    }
    collection.insert_one(user_doc)

    token = create_access_token(payload.email)
    return AuthResponse(access_token=token, user=AuthUserResponse(email=payload.email))


@app.post("/auth/login", response_model=AuthResponse)
def login(payload: AuthRequest):
    user = authenticate_user(payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(user["email"])
    return AuthResponse(access_token=token, user=AuthUserResponse(email=user["email"]))


@app.get("/auth/me", response_model=AuthUserResponse)
def me(credentials: HTTPAuthorizationCredentials | None = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Missing token")

    user = get_current_user_from_token(credentials.credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return AuthUserResponse(email=user["email"])


@app.post("/ask/stream")
def ask_stream(request: QueryRequest):
    def generate():
        for chunk in rag_chain.stream(request.question):
            yield chunk

    return StreamingResponse(generate(), media_type="text/plain")