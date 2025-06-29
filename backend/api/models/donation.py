from datetime import timezone
from django.db import models
from .user import User
from .orphan import Orphan
from .organizations import Organizations

class Donation(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    ]

    RECEIVER_TYPES = [
        ("orphan", "Orphan"),
        ("organization", "Organization"),
    ]

    donor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="donations")
    receiver_type = models.CharField(max_length=20, choices=RECEIVER_TYPES, null=True)
    orphan = models.ForeignKey(Orphan, on_delete=models.SET_NULL, null=True, blank=True, related_name="donations")
    organization = models.ForeignKey(Organizations, on_delete=models.SET_NULL, null=True, blank=True, related_name="donations")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    donation_date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    def __str__(self):
        receiver = "Unknown"
        if self.receiver_type == "orphan" and self.orphan:
            receiver = self.orphan.name
        elif self.receiver_type == "organization" and self.organization:
            receiver = self.organization.name

        return f"{self.donor.email} donated {self.amount} to {receiver} ({self.status})"