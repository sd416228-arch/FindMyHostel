from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone
from accounts.models import CustomUser
from hostels.models import Room

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
    starting_date = models.DateField()
    number_of_guests = models.IntegerField(validators=[MinValueValidator(1)])
    
    # Pricing
    monthly_rent = models.DecimalField(max_digits=10, decimal_places=2)
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
        constraints = [
            models.UniqueConstraint(
                fields=['room', 'starting_date'],
                condition=models.Q(status__in=['pending', 'confirmed', 'checked_in']),
                name='unique_room_starting_date_active'
            ),
        ]
    
    def __str__(self):
        return f"Booking {self.id} - {self.guest.email}"
    
    def is_active(self):
        """Check if booking is active"""
        return self.status in ['confirmed', 'checked_in']
    
    def is_past(self):
        """Check if starting date has passed"""
        return self.starting_date < timezone.now().date()
    
    def days_until_stay(self):
        """Get days until stay"""
        delta = self.starting_date - timezone.now().date()
        return delta.days
