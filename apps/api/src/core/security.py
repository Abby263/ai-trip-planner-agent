from fastapi import HTTPException, Request, status


MAX_REQUEST_BYTES = 128_000


async def enforce_request_size(request: Request) -> None:
    content_length = request.headers.get("content-length")
    if content_length and int(content_length) > MAX_REQUEST_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Request body is too large.",
        )


def sanitize_location(location: dict | None) -> dict | None:
    if not location:
        return None
    lat = location.get("lat")
    lng = location.get("lng")
    if lat is None or lng is None:
        return None
    return {"lat": round(float(lat), 3), "lng": round(float(lng), 3)}
