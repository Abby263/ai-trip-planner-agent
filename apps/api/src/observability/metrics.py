from collections import Counter


COUNTERS: Counter[str] = Counter()


def increment(metric: str) -> None:
    COUNTERS[metric] += 1


def snapshot() -> dict[str, int]:
    return dict(COUNTERS)
