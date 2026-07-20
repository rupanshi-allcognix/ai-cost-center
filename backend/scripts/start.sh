#!/bin/bash
set -e

MODE="${1:-backend}"

case "$MODE" in
  backend)
    echo "Starting FastAPI backend..."
    exec uvicorn app.main:app --host 0.0.0.0 --port 8000
    ;;
  taskiq)
    echo "Starting TaskIQ worker..."
    exec taskiq worker app.ai_cost_center_full_stack.task_queue.worker:broker
    ;;
  scheduler)
    echo "Starting TaskIQ scheduler..."
    exec taskiq scheduler app.ai_cost_center_full_stack.task_queue.worker:scheduler
    ;;
  *)
    echo "Usage: $0 {backend|taskiq|scheduler}"
    exit 1
    ;;
esac
