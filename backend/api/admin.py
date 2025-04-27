from django.contrib import admin
from .models import User, UserProfile

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = "Profile"

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "ac_role", "is_active", "is_staff")
    list_filter = ("ac_role", "is_active", "is_staff")
    search_fields = ("email",)
    actions = ["approve_organizations"]
    inlines = [UserProfileInline]

    def approve_organizations(self, request, queryset):
        queryset.filter(ac_role=1, is_active=False).update(is_active=True)
        self.message_user(request, "selected organization have been approved.")
    approve_organizations.short_description = "Approve selected organization."
