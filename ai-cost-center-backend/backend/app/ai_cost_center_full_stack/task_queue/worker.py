from taskiq import TaskiqScheduler
from taskiq_aio_pika import AioPikaBroker

from app.config import settings

broker = AioPikaBroker(settings.rabbitmq_url)
scheduler = TaskiqScheduler(broker=broker)
