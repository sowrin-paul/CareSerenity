<<<<<<< HEAD
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("api.urls")),
]
=======
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("api.urls")),
]
>>>>>>> 3190863c5f77db040fae09d3542a2e13b4906731
