from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView, LoginView, approve_organization, pending_organization, SeminarListView, UserProfileView, OrganizationProfileView, SeminarRegistrationView, SeminarDeregistrationView, SeminarRegistrationStatusView, OrganizationListView, BlogListView, AssignVolunteerView, OpenVolunteerApplicationView, FetchOpenVolunteerApplicationsView, OrganizationVolunteersView, ApplyForVolunteeringView
from .models import get_username
from . import views

urlpatterns = [
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("login/", LoginView.as_view(), name='login'),
    path("register/", RegisterView.as_view(), name='register'),
    path("api/user/", get_username, name="get-username"),
    path("approve-organization/<int:user_id>/", approve_organization, name="approve-organization"),
    path("pending-organization/", pending_organization, name="pending-organization"),
    path("seminars/", SeminarListView.as_view(), name="seminar-list-create"),
    path("seminars/<int:seminar_id>/", views.fetch_seminar_details, name="seminar-detail"),
    path("own-seminars/", views.fetch_own_seminar, name="fetch-own-seminars"),
    path("available-seminars/", views.fetch_available_seminars, name="fetch-available-seminars"),
    path("seminars/<int:seminar_id>/register/", SeminarRegistrationView.as_view(), name="seminar-registration"),
    path("seminars/<int:seminar_id>/deregister/", SeminarDeregistrationView.as_view(), name="seminar-deregister"),
    path("seminars/<int:seminar_id>/is-registered/", SeminarRegistrationStatusView.as_view(), name="seminar-is-registered"),
    path("organization/seminar/<int:seminar_id>/open-volunteer/", OpenVolunteerApplicationView.as_view(),name="open-volunteer-application"),
    path("volunteer/open-applications/", FetchOpenVolunteerApplicationsView.as_view(),name="fetch-open-volunteer-applications"),
    path("user/profile/", UserProfileView.as_view(), name="user-profile"),
    path("user/profile/update/", UserProfileView.as_view(), name='user-profile-update'),
    path("organizations/", OrganizationListView.as_view(), name="organization-list"),
    path("organization/profile/", OrganizationProfileView.as_view(), name="organization-profile"),
    path("blogs/", BlogListView.as_view(), name="blog-list"),
    path("organization/assign-volunteer/", AssignVolunteerView.as_view(), name="volunteer-assign"),
    path("organization/volunteers/", OrganizationVolunteersView.as_view(), name="organization-volunteers"),
    path("seminars/<int:seminar_id>/apply-volunteer/", ApplyForVolunteeringView.as_view(), name="apply-volunteer"),
]