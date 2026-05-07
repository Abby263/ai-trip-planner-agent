from contextlib import contextmanager
from typing import Iterator

from src.core.logging import logger


@contextmanager
def trace_span(name: str, **attributes: object) -> Iterator[None]:
    logger.info("span.start", span=name, **attributes)
    try:
        yield
        logger.info("span.end", span=name)
    except Exception as exc:
        logger.error("span.error", span=name, error=str(exc))
        raise
