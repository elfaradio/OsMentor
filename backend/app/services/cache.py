"""Application cache utilities for expensive providers and query results."""

from __future__ import annotations

from cachetools import TTLCache


def create_ttl_cache(maxsize: int, ttl_seconds: int) -> TTLCache:
    return TTLCache(maxsize=maxsize, ttl=ttl_seconds)
