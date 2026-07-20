# app/router.py
from app.rag.chain import rag_chain
from app.tools.riot_analysis import llm  # reuse the same LLM client

CLASSIFY_PROMPT = """Classify the following user question into exactly one category.
Respond with ONLY the category name, nothing else.

Categories:
- "lol_stats": the question is about League of Legends match history, stats, KDA, champions, ranks, wins/losses, or performance.

Question: {question}

Category:"""

def is_lol_query(question: str) -> bool:
    prompt = CLASSIFY_PROMPT.format(question=question)
    response = llm.invoke(prompt)
    category = response.content.strip().lower()
    return category == "lol_stats"