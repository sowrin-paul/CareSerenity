from django.urls import include, path
from .views import RegisterView, LoginView, approve_organization, pending_organization, SeminarListView
from .models import get_username
from . import views

urlpatterns = [
    path("login/", LoginView.as_view(), name='login'),
    path("register/", RegisterView.as_view(), name='register'),
    path("api/user/", get_username, name="get-username"),
    path("approve-organization/<int:user_id>/", approve_organization, name="approve-organization"),
    path("pending-organization/", pending_organization, name="pending-organization"),
    path("seminars/", SeminarListView.as_view(), name="seminar-list-create"),
    path("own-seminars/", views.fetch_own_seminar, name="fetch-own-seminars"),
    path("available-seminars/", views.fetch_available_seminars, name="fetch-available-seminars")
]