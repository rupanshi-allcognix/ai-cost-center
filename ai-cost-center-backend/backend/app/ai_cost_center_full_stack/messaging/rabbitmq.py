import aio_pika

from app.config import settings

_connection: aio_pika.RobustConnection | None = None


async def get_connection() -> aio_pika.RobustConnection:
    global _connection
    if _connection is None:
        _connection = await aio_pika.connect_robust(settings.rabbitmq_url)
    return _connection


async def close_connection():
    global _connection
    if _connection:
        await _connection.close()
        _connection = None
