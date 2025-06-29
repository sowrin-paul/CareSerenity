from django.db import models
from .user import User
from .orphan import Orphan

class Adoption(models.Model):
    STATUS_CHOICE = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    orphan = models.ForeignKey(Orphan, on_delete=models.CASCADE, related_name="adoption_request")
    adopter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="adoptions")
    status = models.CharField(max_length=20, choices=STATUS_CHOICE, default="pending")
    application_date = models.DateField(auto_now_add=True)
    approval_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.adopter.email} -> {self.orphan.name} ({self.status})"

    @classmethod
    def has_pending_request(cls, orphan, user):
        return cls.objects.filter(orphan=orphan, adopter=user, status="pending").exists()

    @classmethod
    def get_pending_requests_for_orphan(cls, orphan):
        return cls.objects.filter(orphan=orphan, status="pending")
