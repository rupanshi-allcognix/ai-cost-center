import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.ai_cost_center_full_stack.database.mongodb import close_db, get_db
from app.config import settings

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting %s (debug=%s, vault=%s)", settings.app_name, settings.debug, settings.vault_enabled)
    _connect_databases()
    yield
    _disconnect_databases()
    logger.info("Shutting down %s", settings.app_name)


def _connect_databases():
    import asyncio

    async def _connect():
        try:
            db = await get_db()
            await db.command("ping")
            logger.info("MongoDB connected")
        except Exception as e:
            logger.warning("MongoDB connection failed: %s", e)

    try:
        loop = asyncio.get_running_loop()
        loop.create_task(_connect())
    except RuntimeError:
        asyncio.run(_connect())


def _disconnect_databases():
    import asyncio

    async def _disconnect():
        await close_db()
        logger.info("MongoDB disconnected")

    try:
        loop = asyncio.get_running_loop()
        loop.create_task(_disconnect())
    except RuntimeError:
        asyncio.run(_disconnect())
