def format_history(history: list, max_turns: int = 6) -> str:
    """Format recent conversation history as plain text for prompt injection."""
    if not history:
        return ""

    recent = history[-max_turns:]
    lines = []
    for msg in recent:
        speaker = "User" if msg.role == "user" else "Assistant"
        lines.append(f"{speaker}: {msg.content}")
    return "\n".join(lines)