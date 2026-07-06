from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone
from accounts.models import CustomUser
from hostels.models import Room
from datetime import datetime

class Booking(models.Model):
    """Booking model"""
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('checked_in', 'Checked In'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    # Relations
    guest = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='bookings')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='bookings')
    
    # Booking Details
    check_in_date = models.DateField()
    check_out_date = models.DateField()
    number_of_guests = models.IntegerField(validators=[MinValueValidator(1)])
    
    # Pricing
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    total_nights = models.IntegerField(validators=[MinValueValidator(1)])
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Guest Info
    guest_name = models.CharField(max_length=200)
    guest_email = models.EmailField()
    guest_phone = models.CharField(max_length=15)
    special_requests = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['guest', 'status']),
            models.Index(fields=['room', 'check_in_date', 'check_out_date']),
            models.Index(fields=['status', 'check_in_date']),
        ]
    
    def __str__(self):
        return f"Booking {self.id} - {self.guest.email}"
    
    def is_active(self):
        """Check if booking is active"""
        return self.status in ['confirmed', 'checked_in']
    
    def is_past(self):
        """Check if booking date has passed"""
        return self.check_out_date < timezone.now().date()
    
    def days_until_checkin(self):
        """Get days until check-in"""
        delta = self.check_in_date - timezone.now().date()
        return delta.days
    
    @staticmethod
    def check_availability(room, check_in, check_out):
        """
        Check if room is available for given dates
        SQLite compatible query to prevent double booking
        """
        overlapping_bookings = Booking.objects.filter(
            room=room,
            status__in=['pending', 'confirmed', 'checked_in']
        ).filter(
            models.Q(
                check_in_date__lt=check_out,
                check_out_date__gt=check_in
            )
        )
        return not overlapping_bookings.exists()
    
    @staticmethod
    def calculate_total_price(price_per_night, check_in, check_out):
        """Calculate total price for booking"""
        delta = check_out - check_in
        nights = delta.days
        if nights <= 0:
            raise ValueError("Check-out must be after check-in")
        return price_per_night * nights, nights
