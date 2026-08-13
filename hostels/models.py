from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from accounts.models import CustomUser

class Hostel(models.Model):
    """Hostel model"""
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='hostels')
    name = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    website = models.URLField(blank=True, null=True)
    
    # Amenities
    wifi = models.BooleanField(default=True)
    parking = models.BooleanField(default=False)
    laundry = models.BooleanField(default=False)
    kitchen = models.BooleanField(default=False)
    gym = models.BooleanField(default=False)
    
    # Pricing & Ratings
    monthly_rent = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    rating = models.FloatField(default=0.0, validators=[MinValueValidator(0), MaxValueValidator(5)])
    reviews_count = models.IntegerField(default=0)
    
    # Media
    cover_image = models.ImageField(upload_to='hostels/', blank=True, null=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['city', 'is_active']),
            models.Index(fields=['owner', 'is_active']),
        ]
    
    def __str__(self):
        return self.name
    
    def get_amenities_list(self):
        amenities = []
        if self.wifi:
            amenities.append('WiFi')
        if self.parking:
            amenities.append('Parking')
        if self.laundry:
            amenities.append('Laundry')
        if self.kitchen:
            amenities.append('Kitchen')
        if self.gym:
            amenities.append('Gym')
        return amenities

class Room(models.Model):
    """Room model"""
    ROOM_TYPES = (
        ('single', 'Single'),
        ('double', 'Double'),
        ('dorm', 'Dormitory'),
        ('deluxe', 'Deluxe'),
    )
    
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE, related_name='rooms')
    room_number = models.CharField(max_length=50)
    room_type = models.CharField(max_length=20, choices=ROOM_TYPES)
    capacity = models.IntegerField(validators=[MinValueValidator(1)])
    monthly_rent = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    description = models.TextField(blank=True)
    
    # Features
    has_ac = models.BooleanField(default=True)
    has_bathroom = models.BooleanField(default=True)
    has_tv = models.BooleanField(default=False)
    has_balcony = models.BooleanField(default=False)
    
    # Images
    image = models.ImageField(upload_to='rooms/', blank=True, null=True)
    
    # Status
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['room_number']
        unique_together = ['hostel', 'room_number']
        indexes = [
            models.Index(fields=['hostel', 'is_available']),
        ]
    
    def __str__(self):
        return f"{self.hostel.name} - Room {self.room_number}"
    
    def get_features_list(self):
        features = []
        if self.has_ac:
            features.append('AC')
        if self.has_bathroom:
            features.append('Private Bathroom')
        if self.has_tv:
            features.append('TV')
        if self.has_balcony:
            features.append('Balcony')
        return features

class HostelImage(models.Model):
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='hostels/')
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.hostel.name} - Image {self.order}"

class Testimonial(models.Model):
    """User testimonial model for the homepage"""
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='testimonials')
    role = models.CharField(max_length=100, default='User')
    content = models.TextField()
    rating = models.IntegerField(default=5, validators=[MinValueValidator(1), MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Review by {self.user.get_full_name() or self.user.username}"

class Review(models.Model):
    """Per-hostel review and rating left by a traveler."""
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='hostel_reviews')
    rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'hostel'],
                name='review_unique_user_hostel'
            ),
        ]

    def __str__(self):
        return f"{self.rating}/5 by {self.user.email} on {self.hostel.name}"


class Reservation(models.Model):
    """Simple hostel reservation request from a user (no dates/pricing)"""
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    )

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reservations')
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE, related_name='reservations')
    guest_name = models.CharField(max_length=200)
    guest_phone = models.CharField(max_length=15)
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'hostel'],
                condition=models.Q(status='pending'),
                name='unique_pending_reservation_per_user_hostel'
            ),
        ]

    def __str__(self):
        return f"Reservation {self.id} - {self.guest_name} @ {self.hostel.name}"
