from django.db import models
from .organizations import Organizations

class Orphan(models.Model):
    name = models.CharField(max_length=255)
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=50, choices=[("Male", "Male"), ("Female", "Female"), ("Prefer not to say", "Prefer not to say")])
    education = models.TextField(null=True, blank=True)
    medical_history = models.TextField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to="orphan_profile_pics/", null=True, blank=True)
    is_adopted = models.BooleanField(default=False)
    organizations = models.ForeignKey(Organizations, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.name