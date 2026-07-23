from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.ai_cost_center_full_stack.api.routes import anomaly, aws, chat, notifications
from app.ai_cost_center_full_stack.handler.exceptions import register_exception_handlers
from app.ai_cost_center_full_stack.startup.lifecycle import lifespan
from app.config import settings

app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)

app.include_router(chat.router, prefix="/api/chat")
app.include_router(anomaly.router, prefix="/api/anomaly")
app.include_router(notifications.router, prefix="/api/notifications")
app.include_router(aws.router, prefix="/api/aws")


@app.get("/health")
async def health():
    return {"status": "healthy"}
