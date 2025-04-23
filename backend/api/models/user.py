from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser):
    ROLE_CHOICE = [
        (0, "User"),
        (1, "Organizations"),
        (2, "Admin"),
    ]

    email = models.EmailField(unique=True)
    ac_role = models.IntegerField(choices=ROLE_CHOICE, default=0)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    birth_date = models.DateField(null=True, blank=True)
    contact = models.CharField(max_length=255, null=True, blank=True)
    gender = models.CharField(max_length=50, choices=[("Male", "Male"), ("Female", "Female"), ("Prefer not to say", "Prefer not to say")])
    nid = models.CharField(max_length=255, null=True, blank=True, unique=True)
    address = models.TextField(null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    job = models.CharField(max_length=255, null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    image = models.ImageField(upload_to="profile_pics/", null=True, blank=True)

    def __str__(self):
        return f"{self.user.email}'s Profile"