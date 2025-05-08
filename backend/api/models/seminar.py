from django.db import models
from django.http import JsonResponse
from django.conf import settings

class Seminar(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateField()
    location = models.CharField(max_length=255)
    banner = models.ImageField(upload_to="seminar_banners/", null=True)
    participant_count = models.PositiveBigIntegerField(default=0)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="seminars")

    def __str__(self):
        return self.title