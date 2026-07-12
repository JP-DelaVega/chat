from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from app.config import settings

def get_vectorstore():
    embeddings = GoogleGenerativeAIEmbeddings(
        model=settings.EMBEDDING_MODEL,
        google_api_key=settings.GOOGLE_API_KEY
    )

    return MongoDBAtlasVectorSearch.from_connection_string(
        settings.MONGODB_URI,
        f"{settings.DB_NAME}.{settings.COLLECTION_NAME}",
        embeddings,
        index_name=settings.VECTOR_INDEX_NAME,
    )