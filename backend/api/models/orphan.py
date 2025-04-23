<<<<<<< HEAD
from django.db import models
from .organizations import Organizations

class Orphan(models.Model):
    name = models.CharField(max_length=255)
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=50, choices=[("Male", "Male"), ("Female", "Female"), ("Prefer not to say", "Prefer not to say")])
    education = models.TextField(null=True, blank=True)
    medical_history = models.TextField(null=True, blank=True)
    is_adopted = models.BooleanField(default=False)
    organizations = models.ForeignKey(Organizations, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
=======
from django.db import models
from .organizations import Organizations

class Orphan(models.Model):
    name = models.CharField(max_length=255)
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=50, choices=[("Male", "Male"), ("Female", "Female"), ("Prefer not to say", "Prefer not to say")])
    education = models.TextField(null=True, blank=True)
    medical_history = models.TextField(null=True, blank=True)
    is_adopted = models.BooleanField(default=False)
    organizations = models.ForeignKey(Organizations, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
>>>>>>> 3190863c5f77db040fae09d3542a2e13b4906731
        return self.name