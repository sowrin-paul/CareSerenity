from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
# from backend.api.models import CustomUserManager
from .user import User

class Organizations(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="organizations")
    name = models.CharField(max_length=255, unique=True)
    contact = models.CharField(max_length=15, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    registration_num = models.CharField(max_length=255, unique=True, null=True, blank=True)
    established_date = models.DateField(null=True, blank=True)
    org_logo = models.ImageField(upload_to="profile_pics_org/", null=True, blank=True)

    def __str__(self):
        return self.name
