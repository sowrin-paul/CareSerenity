from django.db import models
from django.http import JsonResponse
from django.conf import settings
from .user import User

class Seminar(models.Model):
    title = models.CharField(max_length=255, null=True)
    subject = models.CharField(max_length=255, null=True)
    description = models.TextField()
    seminar_date = models.DateField()
    guest = models.CharField(max_length=255, null=True)
    seminar_type = models.CharField(max_length=50, choices=[('online', 'Online'), ('offline', 'Offline')], null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    banner = models.ImageField(upload_to='seminar_banners/', null=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='own_seminars', blank=True)
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='seminars_participated', blank=True)
    is_open_for_volunteers = models.BooleanField(default=False)

    def __str__(self):
        return self.title