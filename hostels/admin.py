from django.contrib import admin
from .models import Hostel, HostelImage, Room, Testimonial, Reservation

class HostelImageInline(admin.TabularInline):
    model = HostelImage
    extra = 3
    fields = ('image', 'caption', 'order')

@admin.register(Hostel)
class HostelAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'city', 'monthly_rent', 'rating', 'is_verified')
    list_filter = ('city', 'is_verified', 'is_active', 'created_at')
    search_fields = ('name', 'city', 'owner__email')
    fieldsets = (
        ('Basic Info', {'fields': ('owner', 'name', 'description', 'location', 'city', 'country')}),
        ('Contact', {'fields': ('phone', 'email', 'website')}),
        ('Amenities', {'fields': ('wifi', 'parking', 'laundry', 'kitchen', 'gym')}),
        ('Pricing & Rating', {'fields': ('monthly_rent', 'rating', 'reviews_count')}),
        ('Media', {'fields': ('cover_image',)}),
        ('Status', {'fields': ('is_active', 'is_verified')}),
    )
    inlines = [HostelImageInline]

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('room_number', 'hostel', 'room_type', 'capacity', 'monthly_rent', 'is_available')
    list_filter = ('hostel', 'room_type', 'is_available')
    search_fields = ('room_number', 'hostel__name')
    fieldsets = (
        ('Hostel & Room Info', {'fields': ('hostel', 'room_number', 'room_type', 'capacity')}),
        ('Pricing & Description', {'fields': ('monthly_rent', 'description')}),
        ('Features', {'fields': ('has_ac', 'has_bathroom', 'has_tv', 'has_balcony')}),
        ('Media', {'fields': ('image',)}),
        ('Status', {'fields': ('is_available',)}),
    )

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'rating', 'created_at', 'is_active')
    list_filter = ('is_active', 'rating', 'created_at')
    search_fields = ('user__username', 'user__email', 'content')
    actions = ['approve_testimonials', 'hide_testimonials', 'delete_testimonials']

    def approve_testimonials(self, request, queryset):
        queryset.update(is_active=True)
    approve_testimonials.short_description = "Approve selected testimonials"

    def hide_testimonials(self, request, queryset):
        queryset.update(is_active=False)
    hide_testimonials.short_description = "Hide selected testimonials"

    def delete_testimonials(self, request, queryset):
        count = queryset.count()
        queryset.delete()
        self.message_user(request, f"Successfully deleted {count} testimonial(s).")
    delete_testimonials.short_description = "Delete selected testimonials"

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('guest_name', 'hostel', 'user', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('guest_name', 'guest_phone', 'hostel__name', 'user__email')
