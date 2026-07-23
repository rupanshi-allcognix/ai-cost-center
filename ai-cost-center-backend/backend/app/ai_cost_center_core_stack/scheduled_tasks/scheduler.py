from taskiq import TaskiqScheduler

from app.ai_cost_center_full_stack.task_queue.worker import broker

scheduler = TaskiqScheduler(broker=broker)
