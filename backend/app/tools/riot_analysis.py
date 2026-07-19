from langchain_google_genai import ChatGoogleGenerativeAI
from app.config import settings
from app.tools.riot_tool import get_recent_matches

import os
from dotenv import load_dotenv
load_dotenv()


llm = ChatGoogleGenerativeAI(
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0,
    model=settings.LLM_MODEL,
)

def analyze_lol_query(question: str) -> str:
    raw_matches = get_recent_matches()

    prompt = f"""You are analyzing a League of Legends player's recent match history.

Match data (most recent matches, one per line):
{raw_matches}

Answer the following question using only the data above. Show your reasoning
briefly if it involves calculation (e.g. computing an average or finding a max),
then give a clear final answer.

Question: {question}
"""

    response = llm.invoke(prompt)
    return response.content