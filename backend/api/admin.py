from django.contrib import admin
from datetime import datetime
from .models import User, UserProfile
from .models .seminar import Seminar
from .models .organizations import Organizations
from .models .seminarRegister import SeminarRegistration
from .models .blogs import Blog
from .models .volunteer import Volunteer
from .models .volunteerApplication import VolunteerApplication
from .models .payment import Payment
from .models .donation import Donation
from .models .blogReaction import BlogReaction

# Admin for the User Profile
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = "Profile"

# Admin for UserAdmin
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

# Admin for Seminar
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

# Admin for Organizations
@admin.register(Organizations)
class OrganizationsAdmin(admin.ModelAdmin):
    list_display = ['name', 'contact', 'website', 'registration_num', 'established_date']
    search_fields = ['name', 'contact', 'registration_num']
    list_filter = ['established_date']


# Admin for SeminarRegistration
@admin.register(SeminarRegistration)
class SeminarRegistrationAdmin(admin.ModelAdmin):
    list_display = ['user', 'seminar', 'registered_at']
    search_fields = ['user__email', 'seminar__title']
    list_filter = ['registered_at']


# Admin for Blog
@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'created_at']
    search_fields = ['title', 'author__email']
    list_filter = ['created_at']

@admin.register(BlogReaction)
class BlogReactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'blog', 'reaction_type', 'created_at')
    list_filter = ('reaction_type', 'created_at')
    search_fields = ('user__email', 'blog__title')


# Admin for Volunteer
@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    list_display = ['volunteer', 'seminar', 'organization', 'assigned_at']
    search_fields = ['volunteer__email', 'seminar__title', 'organization__name']
    list_filter = ['assigned_at']


# Admin for VolunteerApplication
@admin.register(VolunteerApplication)
class VolunteerApplicationAdmin(admin.ModelAdmin):
    list_display = ['user', 'seminar', 'applied_at']
    search_fields = ['user__email', 'seminar__title']
    list_filter = ['applied_at']

# Donation admin
@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = [
        "donor", "receiver_type", "organization", "orphan",
        "amount", "status", "donation_date"
    ]
    search_fields = ["donor__email", "organization__name", "orphan__name"]
    list_filter = ["status", "donation_date", "receiver_type"]
    actions = ["approve_donations", "reject_donations"]

    def approve_donations(self, request, queryset):
        updated = queryset.update(status="completed")
        self.message_user(request, f"{updated} donations have been approved.")
    approve_donations.short_description = "Approve selected donations"

    def reject_donations(self, request, queryset):
        updated = queryset.update(status="failed")
        self.message_user(request, f"{updated} donations have been rejected.")
    reject_donations.short_description = "Reject selected donations"
