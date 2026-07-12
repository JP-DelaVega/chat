from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from app.schemas import QueryRequest, QueryResponse
from app.rag.chain import rag_chain

app = FastAPI(title="LeagueLore RAG API")

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

@app.post("/ask", response_model=QueryResponse)
def ask(request: QueryRequest):
    answer = rag_chain.invoke(request.question)
    return QueryResponse(answer=answer)

@app.post("/ask/stream")
def ask_stream(request: QueryRequest):
    def generate():
        for chunk in rag_chain.stream(request.question):
            yield chunk
    return StreamingResponse(generate(), media_type="text/plain")