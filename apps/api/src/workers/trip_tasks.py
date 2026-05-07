from src.workers.celery_app import celery_app


@celery_app.task(name="src.workers.trip_tasks.plan_trip")
def plan_trip_task(trip_id: str) -> dict:
    return {"trip_id": trip_id, "status": "queued_for_worker"}
