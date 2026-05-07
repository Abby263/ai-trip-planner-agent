from celery import Celery

from src.core.config import settings

celery_app = Celery("trip_planner", broker=settings.redis_url, backend=settings.redis_url)
celery_app.conf.task_routes = {"src.workers.trip_tasks.*": {"queue": "trip-planning"}}
