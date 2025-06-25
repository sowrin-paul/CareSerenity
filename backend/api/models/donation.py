from django.db import models
from .user import User
from .organizations import Organizations
from .orphan import Orphan

class Donation(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ("bkash", "bKash"),
        ("nagad", "Nagad"),
        ("rocket", "Rocket"),
    ]

    donor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="donations")
    organization = models.ForeignKey(Organizations, on_delete=models.CASCADE, related_name="donations")
    orphan = models.ForeignKey(Orphan, on_delete=models.SET_NULL, null=True, blank=True, related_name="donations")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    transaction_id = models.CharField(max_length=100, null=True, blank=True)
    donated_at = models.DateTimeField(auto_now_add=True)
    note = models.TextField(null=True, blank=True)

    def __str__(self):
        target = f"Orphan: {self.orphan.name}" if self.orphan else f"Organization: {self.organization.name}"
        return f"Donation of {self.amount} by {self.donor.email}"