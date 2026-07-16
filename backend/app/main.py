from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from app.schemas import QueryRequest
from app.rag.chain import rag_chain
import logging


logger = logging.getLogger("uvicorn.error")
app = FastAPI(title="RAG API")

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

@app.post("/ask/stream")
def ask_stream(request: QueryRequest):
    logger.info(f"Initiating stream for db: '{request.db_name}' | Question: '{request.question}'")
    
    chain_input = {
            "question": request.question,
            "db_name": request.db_name
        }
    def generate():
        
        for chunk in rag_chain.stream(chain_input):
            yield chunk
    return StreamingResponse(generate(), media_type="text/plain")