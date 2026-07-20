import logging

from contextlib import asynccontextmanager

from fastapi import FastAPI

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
    pass


def _disconnect_databases():
    pass
