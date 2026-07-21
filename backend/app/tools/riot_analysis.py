from langchain_google_genai import ChatGoogleGenerativeAI
from app.config import settings
from app.tools.riot_tool import get_recent_matches
from app.utils.utils import format_history

import os
from dotenv import load_dotenv
load_dotenv()


llm = ChatGoogleGenerativeAI(
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0,
    model=settings.LLM_MODEL,
)

def analyze_lol_query_stream(question: str, history: list = None):
    raw_matches = get_recent_matches()
    history_text = format_history(history or [])

    prompt = f"""You are analyzing a League of Legends player's recent match history.

                Match data (most recent matches, one per line):
                {raw_matches}
                
                {"Conversation so far:" if history_text else ""}
                {history_text}

                Answer the following question using only the data above.

                Respond in plain, natural sentences only — do not use markdown formatting such as
                bold (**text**), headers, bullet points, or numbered lists. Do not label sections
                like "Reasoning:" or "Final Answer:". If the question involves a calculation,
                briefly explain how you got the number as part of a normal sentence, then state
                the answer clearly, all in flowing prose.

                Question: {question}
                """

    for chunk in llm.stream(prompt):
        yield chunk.content