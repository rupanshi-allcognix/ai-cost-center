import uuid
from datetime import datetime


class ChatSession:
    def __init__(self, user_id: str):
        self.id = str(uuid.uuid4())
        self.user_id = user_id
        self.created_at = datetime.utcnow()
        self.metadata: dict = {}


_sessions: dict[str, ChatSession] = {}


def create_session(user_id: str) -> ChatSession:
    session = ChatSession(user_id)
    _sessions[session.id] = session
    return session


def get_session(session_id: str) -> ChatSession | None:
    return _sessions.get(session_id)
