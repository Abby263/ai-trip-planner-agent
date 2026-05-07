class PreferenceVectorStore:
    async def embed_preference(self, text: str) -> list[float]:
        return [float((ord(char) % 13) / 13) for char in text[:64]]

    async def search_similar_preferences(self, query: str, limit: int = 5) -> list[dict]:
        return []
