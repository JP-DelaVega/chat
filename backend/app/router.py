# app/router.py
from app.rag.chain import rag_chain
from app.tools.riot_tool import get_recent_matches

LOL_KEYWORDS = [
    # General references
    "match", "matches", "game", "games", "lol", "league of legends",
    "league", "summoner", "riot", "account", "recent games", "recent matches",

    # Stats / performance
    "kda", "k/d/a", "kills", "deaths", "assists", "kill", "death", "assist",
    "cs", "creep score", "farm", "gold", "damage", "vision score", "wards",
    "win rate", "winrate", "win", "loss", "wins", "losses", "streak",
    "double kill", "triple kill", "quadra", "penta", "pentakill",

    # Champion / role related
    "champion", "champions", "champ", "main", "otp", "build", "runes",
    "role", "roles", "lane", "laner", "top lane", "jungle", "jungler",
    "mid lane", "midlaner", "bot lane", "adc", "support", "sup",

    # Ranked / progression
    "rank", "ranked", "elo", "lp", "league points", "tier", "division",
    "iron", "bronze", "silver", "gold rank", "platinum", "emerald",
    "diamond", "master", "grandmaster", "challenger", "promo", "promos",

    # Session / time-based
    "today", "this week", "last game", "last match", "how many games",
    "how did i do", "performance", "stats", "statistics", "profile",
]

def is_lol_query(question: str) -> bool:
    q = question.lower()
    return any(kw in q for kw in LOL_KEYWORDS)