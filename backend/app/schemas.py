from pydantic import BaseModel
from typing import List, Optional

class ChatMessage(BaseModel):
    role: str
    content: str

class QueryRequest(BaseModel):
    question: str
    db_name: str = "AboutMe_chunks"
    history: Optional[List[ChatMessage]] = []

class QueryResponse(BaseModel):
    answer: str