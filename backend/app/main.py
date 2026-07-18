from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from app.schemas import QueryRequest
from app.rag.chain import rag_chain
import os
from dotenv import load_dotenv

load_dotenv() 
origins = os.getenv("ALLOWED_ORIGINS", "").split(",")


app = FastAPI(title="RAG API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok"}

@app.post("/ask/stream")
def ask_stream(request: QueryRequest):
    
    chain_input = {
            "question": request.question,
            "db_name": request.db_name
        }
    def generate():
        
        for chunk in rag_chain.stream(chain_input):
            yield chunk
    return StreamingResponse(generate(), media_type="text/plain")