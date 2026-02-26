from rest_framework import serializers
from .models import EnquirySubmission, ContactSubmission


class EnquirySubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnquirySubmission
        fields = ['name', 'phone', 'email', 'organisation', 'message']


class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ['name', 'phone', 'email', 'inquiry_type', 'state', 'city', 'found_us']
