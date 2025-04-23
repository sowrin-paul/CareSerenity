<<<<<<< HEAD
from django.urls import path
from .views import RegisterView, LoginView

urlpatterns = [
    path("login/", LoginView.as_view(), name='login'),
    path("register/", RegisterView.as_view(), name='register'),
=======
from django.urls import path
from .views import RegisterView, LoginView

urlpatterns = [
    path("login/", LoginView.as_view(), name='login'),
    path("register/", RegisterView.as_view(), name='register'),
>>>>>>> 3190863c5f77db040fae09d3542a2e13b4906731
]