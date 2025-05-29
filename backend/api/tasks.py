from backend.backend.celery import shared_task
from .models.seminar import Seminar
from datetime import datetime

@shared_task
def delete_expired_seminar():
    now = datetime.now()
    expired_seminars = Seminar.objects.filter(seminar_date__lt=now)
    count = expired_seminars.count()
    expired_seminars.delete()
    return f"{count} expired seminars deleted."