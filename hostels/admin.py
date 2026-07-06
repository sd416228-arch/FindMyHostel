from django.contrib import admin
from .models import Hostel, Room

@admin.register(Hostel)
class HostelAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'city', 'base_price', 'rating', 'is_verified')
    list_filter = ('city', 'is_verified', 'is_active', 'created_at')
    search_fields = ('name', 'city', 'owner__email')
    fieldsets = (
        ('Basic Info', {'fields': ('owner', 'name', 'description', 'location', 'city', 'country')}),
        ('Contact', {'fields': ('phone', 'email', 'website')}),
        ('Amenities', {'fields': ('wifi', 'parking', 'laundry', 'kitchen', 'gym')}),
        ('Pricing & Rating', {'fields': ('base_price', 'rating', 'reviews_count')}),
        ('Media', {'fields': ('cover_image',)}),
        ('Status', {'fields': ('is_active', 'is_verified')}),
    )

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('room_number', 'hostel', 'room_type', 'capacity', 'price_per_night', 'is_available')
    list_filter = ('hostel', 'room_type', 'is_available')
    search_fields = ('room_number', 'hostel__name')
    fieldsets = (
        ('Hostel & Room Info', {'fields': ('hostel', 'room_number', 'room_type', 'capacity')}),
        ('Pricing & Description', {'fields': ('price_per_night', 'description')}),
        ('Features', {'fields': ('has_ac', 'has_bathroom', 'has_tv', 'has_balcony')}),
        ('Media', {'fields': ('image',)}),
        ('Status', {'fields': ('is_available',)}),
    )
