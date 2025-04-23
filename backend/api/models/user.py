from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from backend.api.models import CustomUserManager

class User(AbstractBaseUser):
    ROLE_CHOICE = [
        (0, "User"),
        (1, "Organizations"),
        (2, "Admin"),
    ]

    ac_role = models.IntegerField(choices=ROLE_CHOICE, default=0)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

# class UserProfile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
#     birth_date = models.DateField(null=True, blank=True)
#     contact = models.CharField(max_length=255, null=True, blank=True)
#     gender = models.CharField(max_length=50, choices=[("Male", "Male"), ("Female", "Female"), ("Prefer not to say", "Prefer not to say")])
#     nid = models.CharField(max_length=255, null=True, blank=True, unique=True)
#     address = models.TextField(null=True, blank=True)
#     website = models.URLField(null=True, blank=True)
#     job = models.CharField(max_length=255, null=True, blank=True)
#     location = models.CharField(max_length=255, null=True, blank=True)
#     image = models.ImageField(upload_to="profile_pics/", null=True, blank=True)

#     def __str__(self):
#         return f"{self.user.email}'s Profile"