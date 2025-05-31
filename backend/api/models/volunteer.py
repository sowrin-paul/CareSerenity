from django.db import models
from .seminar import Seminar
from .user import User
from .organizations import Organizations

class Volunteer(models.Model):
    seminar = models.ForeignKey(Seminar, on_delete=models.CASCADE, related_name="volunteer_assignments")
    organization = models.ForeignKey(Organizations, on_delete=models.CASCADE, related_name="volunteer_assignments")
    volunteer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="volunteer_assignments")
    assigned_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Volunteer {self.volunteer.email} assigned to {self.seminar.title} by {self.organization.name}"