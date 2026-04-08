from django.db import models


class EnquirySubmission(models.Model):
    """Submissions from the Home page Enquiry Form (Get in Touch section)"""
    name = models.CharField(max_length=200, verbose_name="Full Name")
    phone = models.CharField(max_length=15, verbose_name="Phone Number")
    email = models.EmailField(verbose_name="Email Address")
    organisation = models.CharField(max_length=300, verbose_name="Organisation")
    message = models.TextField(blank=True, verbose_name="Message")
    submitted_at = models.DateTimeField(auto_now_add=True, verbose_name="Submitted At")

    class Meta:
        verbose_name = "Enquiry Submission"
        verbose_name_plural = "Enquiry Submissions"
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.name} - {self.email} ({self.submitted_at.strftime('%d-%m-%Y %H:%M')})"


class ContactSubmission(models.Model):
    """Submissions from the Contact Us page (Partnership Enquiry form)"""
    INQUIRY_CHOICES = [
        ('Attach your EV', 'Attach your EV'),
        ('Work with driver partner', 'Work with driver partner'),
        ('Media Enquiry', 'Media Enquiry'),
        ('None of the Above', 'None of the Above'),
    ]

    FOUND_US_CHOICES = [
        ('Google Search', 'Google Search'),
        ('Website', 'Website'),
        ('Social Media', 'Social Media'),
        ('Reference', 'Reference'),
        ('Saw EpnMove Vehicle on Road', 'Saw EpnMove Vehicle on Road'),
        ('Other', 'Other'),
    ]

    name = models.CharField(max_length=200, verbose_name="Full Name")
    phone = models.CharField(max_length=15, verbose_name="Mobile Number")
    email = models.EmailField(verbose_name="Email Address")
    inquiry_type = models.CharField(max_length=100, choices=INQUIRY_CHOICES, verbose_name="Inquiry Type")
    state = models.CharField(max_length=100, verbose_name="State")
    city = models.CharField(max_length=100, verbose_name="City")
    found_us = models.CharField(max_length=100, choices=FOUND_US_CHOICES, verbose_name="How did you find EpnMove?")
    submitted_at = models.DateTimeField(auto_now_add=True, verbose_name="Submitted At")

    class Meta:
        verbose_name = "Partnership Submission"
        verbose_name_plural = "Partnership Submissions"
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.name} - {self.inquiry_type} ({self.submitted_at.strftime('%d-%m-%Y %H:%M')})"
