from hostels.models import Reservation


def pending_reservations_count(request):
    """Number of pending reservation requests, shown as a badge in the
    Owner Portal navbar. Only computed for logged-in hostel owners."""
    if not getattr(request.user, 'is_authenticated', False) or not request.user.is_hostel_owner():
        return {'pending_reservations_count': 0}
    return {
        'pending_reservations_count': Reservation.objects.filter(
            hostel__owner=request.user,
            status='pending',
        ).count()
    }


def pending_bookings_count(request):
    """Number of pending booking requests, shown as a badge in the
    Owner Portal navbar. Only computed for logged-in hostel owners."""
    from bookings.models import Booking
    if not getattr(request.user, 'is_authenticated', False) or not request.user.is_hostel_owner():
        return {'pending_bookings_count': 0}
    return {
        'pending_bookings_count': Booking.objects.filter(
            room__hostel__owner=request.user,
            status='pending',
        ).count()
    }


def admin_panel_counts(request):
    """Badge counts for the admin dashboard sidebar. Only computed for
    logged-in website admins browsing the /panel/ area."""
    from bookings.models import Booking
    from hostels.models import Hostel

    if not getattr(request.user, 'is_authenticated', False) or not request.user.is_website_admin():
        return {}

    path = request.path
    if not path.startswith('/panel/'):
        return {}

    return {
        'adm_pending_bookings': Booking.objects.filter(status='pending').count(),
        'adm_pending_reservations': Reservation.objects.filter(status='pending').count(),
        'adm_unverified_hostels': Hostel.objects.filter(is_verified=False).count(),
        'adm_pending_users': 0,
    }