from pydantic import BaseModel


class QueryRequest(BaseModel):
    question: str


class QueryResponse(BaseModel):
    answer: str


class AuthRequest(BaseModel):
    email: str
    password: str


class AuthUserResponse(BaseModel):
    email: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: AuthUserResponse