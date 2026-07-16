from pydantic import BaseModel

class QueryRequest(BaseModel):
    question: str
    db_name: str = "AboutMe_chunks"

class QueryResponse(BaseModel):
    answer: str