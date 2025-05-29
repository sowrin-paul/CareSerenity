from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        # print("Extra fields before cleanup:", extra_fields)
        ac_role = extra_fields.get("ac_role")
        # if ac_role is None:
        #     raise ValueError("ac_role is required and must be explicitly provided")
        # if ac_role not in dict(self.model.ROLE_CHOICE):
        #     raise ValueError(f"Invalid role: {ac_role}. Must be one of {list(dict(self.model.ROLE_CHOICE).keys())}")

        extra_fields["ac_role"] = ac_role
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self.db)
        print("extra field:", extra_fields)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser):
    ROLE_CHOICE = [
        (0, "User"),
        (1, "Organizations"),
    ]
    email = models.EmailField(unique=True)
    ac_role = models.IntegerField(choices=ROLE_CHOICE)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        """Does the user have a specific permission?"""
        return True

    def has_module_perms(self, app_label):
        """Does the user have permissions to view the app `app_label`?"""
        return True

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

@login_required
def get_username(request):
    return JsonResponse({"username": request.user.email})