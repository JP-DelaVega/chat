import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MONGODB_URI = os.getenv("MONGODB_URI")
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    DB_NAME = "LeagueLore_chunks"
    COLLECTION_NAME = "chunked_data"
    VECTOR_INDEX_NAME = "vector_index"
    EMBEDDING_MODEL = "models/gemini-embedding-001"
    LLM_MODEL = "gemini-2.5-flash"

settings = Settings()