from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from app.config import settings
from fastapi import HTTPException


def get_vectorstore(db_name: str ):
    
    if not db_name:
        raise HTTPException(status_code=400, detail="db_name is required")
    
    embeddings = GoogleGenerativeAIEmbeddings(
        model=settings.EMBEDDING_MODEL,
        google_api_key=settings.GOOGLE_API_KEY
    )
    

    return MongoDBAtlasVectorSearch.from_connection_string(
        settings.MONGODB_URI,
        #  Better, but still redundant
        f"{db_name}.{settings.COLLECTION_NAME}",
        embeddings,
        index_name=settings.VECTOR_INDEX_NAME,
    )