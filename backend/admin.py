from django.contrib import admin
from datetime import datetime
from .models import User, UserProfile
from .models .seminar import Seminar


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

@admin.register(Seminar)
class SeminarAdmin(admin.ModelAdmin):
    list_display = ['title', 'seminar_date', 'created_by', 'participant_count']
    list_filter = ['seminar_date', 'seminar_type']
    search_fields = ['title', 'created_by__email']
    actions = ['delete_expired_seminars']

    def participant_count(self, obj):
        return obj.participants.count() if hasattr(obj, 'participants') else 0
    participant_count.short_description = 'Participant Count'

    def delete_expired_seminars(self, request, queryset):
        expired_seminars = queryset.filter(seminar_date__lt=datetime.now())
        count = expired_seminars.count()
        expired_seminars.delete()
        self.message_user(request, f"{count} expired seminar deleted")
    delete_expired_seminars.short_description = "Delete expired seminars"
