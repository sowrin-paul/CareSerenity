from django.db import models
from .seminar import Seminar
from .user import User

class VolunteerApplication(models.Model):
    seminar = models.ForeignKey(Seminar, on_delete=models.CASCADE, related_name="volunteer_applications")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="volunteer_applications")
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} applied for {self.seminar.title}"