class MCPServer:
    def __init__(self, name: str):
        self.name = name

    async def handle_request(self, payload: dict) -> dict:
        return {"status": "ok"}
