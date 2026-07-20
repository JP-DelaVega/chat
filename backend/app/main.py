from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi import HTTPException
from app.schemas import QueryRequest
from app.rag.chain import rag_chain
from app.router import is_lol_query
import os
import requests
from app.tools.riot_analysis import analyze_lol_query_stream

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

    if is_lol_query(request.question) and request.db_name == "lol_stats":
        try:
            result = analyze_lol_query_stream(request.question)
        except requests.exceptions.HTTPError as e:
            status = e.response.status_code
            if status == 429:
                raise HTTPException(status_code=429, detail="Riot API rate limit reached. Please try again shortly.")
            elif status == 403:
                raise HTTPException(status_code=403, detail="Riot API key is invalid or expired.")
            else:
                raise HTTPException(status_code=502, detail=f"Riot API error ({status}): {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Unexpected error fetching match data: {str(e)}")

        def generate_riot():
            for chunk in analyze_lol_query_stream(request.question):
                yield chunk

        return StreamingResponse(generate_riot(), media_type="text/plain")

    # Otherwise: normal RAG chain, streamed as before
    chain_input = {
        "question": request.question,
        "db_name": request.db_name
    }

    def generate_rag():
        try:
            for chunk in rag_chain.stream(chain_input):
                yield chunk
        except Exception as e:
            yield f"Error processing RAG query: {str(e)}"

    return StreamingResponse(generate_rag(), media_type="text/plain")
