from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import EnquirySubmissionSerializer, ContactSubmissionSerializer


@api_view(['POST'])
def submit_enquiry(request):
    """Handle Enquiry Form submission from the Home page"""
    serializer = EnquirySubmissionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'message': 'Enquiry submitted successfully!'},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def submit_contact(request):
    """Handle Contact/Partnership Form submission from the Contact page"""
    serializer = ContactSubmissionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'message': 'Contact form submitted successfully!'},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
