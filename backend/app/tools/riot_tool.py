import os
import requests
from dotenv import load_dotenv
from app.cache.cache import ttl_cache

load_dotenv()

RIOT_API_KEY = os.getenv("RIOT_API_KEY")
RIOT_PUUID = os.getenv("RIOT_PUUID")
HEADERS = {"X-Riot-Token": RIOT_API_KEY}


def get_puuid(game_name: str, tag_line: str, region2: str = "asia") -> str:
    url = f"https://{region2}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{game_name}/{tag_line}"
    resp = requests.get(url, headers=HEADERS)
    resp.raise_for_status()
    return resp.json()["puuid"]

@ttl_cache(seconds=120)
def get_recent_matches(
    game_name: str = None,
    tag_line: str = None,
    region: str = "sea",
    region2: str = "asia",
    count: int = 29,
) -> str:
    puuid = (
        get_puuid(game_name, tag_line, region2)
        if game_name and tag_line
        else RIOT_PUUID
    )

    match_ids_resp = requests.get(
        f"https://{region}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids",
        headers=HEADERS,
        params={"count": count},
    )
    match_ids_resp.raise_for_status()
    match_ids = match_ids_resp.json()

    summaries = []
    for match_id in match_ids:
        match_resp = requests.get(
            f"https://{region}.api.riotgames.com/lol/match/v5/matches/{match_id}",
            headers=HEADERS,
        )
        match_resp.raise_for_status()
        match = match_resp.json()

        participant = next(
            (p for p in match["info"]["participants"] if p["puuid"] == puuid),
            None,
        )
        if participant is None:
            continue

        kills = participant["kills"]
        deaths = participant["deaths"]
        assists = participant["assists"]
        kda_ratio = round((kills + assists) / max(deaths, 1), 2)
        duration_min = match["info"]["gameDuration"] // 60
        cs = participant["totalMinionsKilled"] + participant.get("neutralMinionsKilled", 0)
        cs_per_min = round(cs / max(duration_min, 1), 2)

        summaries.append(
            f"- Champion: {participant['championName']} | "
            f"Role: {participant.get('teamPosition', 'N/A')} | "
            f"Result: {'Win' if participant['win'] else 'Loss'} | "
            f"KDA: {kills}/{deaths}/{assists} (ratio {kda_ratio}) | "
            f"CS: {cs} ({cs_per_min}/min) | "
            f"Gold: {participant['goldEarned']} | "
            f"Damage to champions: {participant['totalDamageDealtToChampions']} | "
            f"Damage taken: {participant['totalDamageTaken']} | "
            f"Vision score: {participant['visionScore']} | "
            f"Wards placed: {participant.get('wardsPlaced', 0)} | "
            f"Duration: {duration_min} min | "
            f"Double kills: {participant.get('doubleKills', 0)} | "
            f"Triple kills: {participant.get('tripleKills', 0)} | "
            f"Pentakills: {participant.get('pentaKills', 0)}"
        )

    return "\n".join(summaries) if summaries else "No recent matches found."