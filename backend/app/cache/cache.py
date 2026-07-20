import time
from functools import wraps

def ttl_cache(seconds: int = 60):
    """Simple in-memory TTL cache decorator. Caches based on function args."""
    def decorator(func):
        cache = {}

        @wraps(func)
        def wrapper(*args, **kwargs):
            key = (args, tuple(sorted(kwargs.items())))
            now = time.time()

            if key in cache:
                value, timestamp = cache[key]
                if now - timestamp < seconds:
                    return value

            result = func(*args, **kwargs)
            cache[key] = (result, now)
            return result

        return wrapper
    return decorator