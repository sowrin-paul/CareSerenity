from django.urls import include, path
from .views import RegisterView, LoginView
from .models import get_username

urlpatterns = [
    path("login/", LoginView.as_view(), name='login'),
    path("register/", RegisterView.as_view(), name='register'),
    path("api/user", get_username, name="get_username"),
]