from django.db import models
from .seminar import Seminar
from .user import User

class SeminarRegistration(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="registrations")
    seminar = models.ForeignKey(Seminar, on_delete=models.CASCADE, related_name="registrations")
    registered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} registered for {self.seminar.title}"