from django.contrib import admin
from .models import EnquirySubmission, ContactSubmission


@admin.register(EnquirySubmission)
class EnquirySubmissionAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'organisation', 'submitted_at')
    list_filter = ('submitted_at',)
    search_fields = ('name', 'email', 'phone', 'organisation')
    readonly_fields = ('submitted_at',)
    ordering = ('-submitted_at',)

    def has_add_permission(self, request):
        return False  # Submissions come from the website only


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'inquiry_type', 'state', 'city', 'found_us', 'submitted_at')
    list_filter = ('inquiry_type', 'state', 'found_us', 'submitted_at')
    search_fields = ('name', 'email', 'phone', 'city', 'state')
    readonly_fields = ('submitted_at',)
    ordering = ('-submitted_at',)

    def has_add_permission(self, request):
        return False  # Submissions come from the website only
