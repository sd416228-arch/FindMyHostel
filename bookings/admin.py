from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'guest', 'room', 'check_in_date', 'check_out_date', 'status', 'total_price')
    list_filter = ('status', 'check_in_date', 'created_at')
    search_fields = ('guest__email', 'room__room_number', 'guest_email')
    readonly_fields = ('created_at', 'updated_at', 'total_price', 'total_nights')
    fieldsets = (
        ('Guest Info', {'fields': ('guest', 'guest_name', 'guest_email', 'guest_phone')}),
        ('Booking Details', {'fields': ('room', 'check_in_date', 'check_out_date', 'number_of_guests')}),
        ('Pricing', {'fields': ('price_per_night', 'total_nights', 'total_price')}),
        ('Status', {'fields': ('status',)}),
        ('Special Requests', {'fields': ('special_requests',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )
    
    def has_delete_permission(self, request, obj=None):
        return False
