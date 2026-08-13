from functools import wraps

from django.contrib import messages
from django.contrib.auth import authenticate, get_user_model, login, logout
from django.contrib.auth.decorators import login_required
from django.db.models import Q, Sum
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_http_methods

from accounts.models import CustomUser
from accounts.validators import is_valid_phone
from bookings.models import Booking
from hostels.models import Hostel, Reservation, Room, Testimonial

# ============= AUTHORIZATION HELPERS =============


def admin_required(view_func):
    """Decorator: allow only website admins (role='admin' or staff/superuser)."""
    @wraps(view_func)
    @login_required(login_url='adminpanel:login')
    def _wrapped(request, *args, **kwargs):
        if not request.user.is_website_admin():
            messages.error(request, 'Access denied. Admin credentials required.')
            return redirect('adminpanel:login')
        return view_func(request, *args, **kwargs)
    return _wrapped


# ============= AUTHENTICATION =============


@require_http_methods(["GET", "POST"])
def admin_login(request):
    """Login page for the website admin dashboard."""
    if request.user.is_authenticated:
        if request.user.is_website_admin():
            return redirect('adminpanel:dashboard')
        messages.info(request, 'You are logged in as a regular user. Login with an admin account below.')

    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            user = None

        user_auth = authenticate(request, username=email, password=password) if user else None

        if user_auth is not None and user_auth.is_website_admin():
            login(request, user_auth)
            messages.success(request, f'Welcome back, {user_auth.email}!')
            return redirect('adminpanel:dashboard')

        messages.error(request, 'Invalid email or password, or this account does not have admin access.')

    return render(request, 'adminpanel/login.html')


@require_http_methods(["GET", "POST"])
def admin_register(request):
    """Signup page for the website admin dashboard. Gated by an invite token
    so that random visitors cannot create admin accounts (same convention as
    the Owner Portal registration)."""
    secret_token = "admin123"
    if request.GET.get('token') != secret_token:
        from django.http import Http404
        raise Http404("Page not found")

    if request.user.is_authenticated:
        if request.user.is_website_admin():
            return redirect('adminpanel:dashboard')
        return redirect('home')

    if request.method == 'POST':
        email = request.POST.get('email')
        username = request.POST.get('username')
        password = request.POST.get('password')
        password_confirm = request.POST.get('password_confirm')
        phone = request.POST.get('phone', '')

        errors = {}

        if CustomUser.objects.filter(email=email).exists():
            errors['email'] = 'Email already registered'
        if CustomUser.objects.filter(username=username).exists():
            errors['username'] = 'Username already taken'
        if password != password_confirm:
            errors['password'] = 'Passwords do not match'
        if len(password) < 8:
            errors['password'] = 'Password must be at least 8 characters'
        if phone and not is_valid_phone(phone):
            errors['phone'] = 'Phone number must be exactly 10 digits'

        if errors:
            return render(request, 'adminpanel/register.html',
                          {'errors': errors, 'form_data': request.POST})

        user = CustomUser.objects.create_user(
            email=email,
            username=username,
            password=password,
            role='admin',
            phone=phone,
            is_staff=True,
            is_verified=True,
        )

        login(request, user)
        messages.success(request, 'Admin account created. Welcome to the dashboard!')
        return redirect('adminpanel:dashboard')

    return render(request, 'adminpanel/register.html')


@require_http_methods(["GET", "POST"])
def admin_logout(request):
    """Logout from the admin dashboard."""
    logout(request)
    messages.success(request, 'You have been logged out of the admin dashboard.')
    return redirect('adminpanel:login')


# ============= DASHBOARD =============


@admin_required
def dashboard(request):
    """Overview of the whole website for the admin."""
    users = CustomUser.objects.all()
    hostels = Hostel.objects.all()
    bookings = Booking.objects.all()
    reservations = Reservation.objects.all()
    active_bookings = bookings.exclude(status='cancelled')

    revenue = active_bookings.aggregate(total=Sum('total_price'))['total'] or 0

    context = {
        'total_users': users.count(),
        'students': users.filter(role='student').count(),
        'owners': users.filter(role='owner').count(),
        'admins': users.filter(Q(role='admin') | Q(is_staff=True) | Q(is_superuser=True)).count(),
        'unverified_users': users.filter(is_verified=False).count(),

        'total_hostels': hostels.count(),
        'verified_hostels': hostels.filter(is_verified=True).count(),
        'inactive_hostels': hostels.filter(is_active=False).count(),
        'total_rooms': Room.objects.count(),
        'pending_verification_hostels': hostels.filter(is_verified=False).count(),

        'total_bookings': bookings.count(),
        'pending_bookings': bookings.filter(status='pending').count(),
        'checked_in_bookings': bookings.filter(status='checked_in').count(),
        'revenue': revenue,

        'total_reservations': reservations.count(),
        'pending_reservations': reservations.filter(status='pending').count(),
        'confirmed_reservations': reservations.filter(status='confirmed').count(),

        'total_testimonials': Testimonial.objects.count(),
        'active_testimonials': Testimonial.objects.filter(is_active=True).count(),

        'recent_bookings': bookings.order_by('-created_at')[:6],
        'recent_users': users.order_by('-date_joined')[:6],
        'recent_reservations': reservations.order_by('-created_at')[:6],
    }
    return render(request, 'adminpanel/dashboard.html', context)


# ============= USERS =============


@admin_required
def user_list(request):
    """List all website users with search and role filter."""
    users = CustomUser.objects.all().order_by('-date_joined')
    role = request.GET.get('role', '')
    query = request.GET.get('q', '')

    if role:
        users = users.filter(role=role)
    if query:
        users = users.filter(Q(email__icontains=query) | Q(username__icontains=query) |
                             Q(first_name__icontains=query) | Q(last_name__icontains=query))

    context = {
        'users': users,
        'role': role,
        'query': query,
        'total': users.count(),
        'user_roles': CustomUser.ROLE_CHOICES,
    }
    return render(request, 'adminpanel/users.html', context)


@admin_required
def user_detail(request, pk):
    """Single user: profile summary + related activity + admin actions."""
    user = get_object_or_404(CustomUser, pk=pk)
    context = {
        'profile': user,
        'hostels': user.hostels.all(),
        'bookings': user.bookings.all(),
        'reservations': user.reservations.all(),
        'testimonials': user.testimonials.all(),
    }
    return render(request, 'adminpanel/user_detail.html', context)


@admin_required
@require_http_methods(["POST"])
def user_toggle_active(request, pk):
    """Activate / deactivate a user account."""
    user = get_object_or_404(CustomUser, pk=pk)
    if user.pk == request.user.pk:
        messages.error(request, 'You cannot deactivate your own account.')
        return redirect('adminpanel:user_detail', pk=pk)
    user.is_active = not user.is_active
    user.save()
    state = 'activated' if user.is_active else 'deactivated'
    messages.success(request, f'{user.email} has been {state}.')
    return redirect('adminpanel:user_detail', pk=pk)


@admin_required
@require_http_methods(["POST"])
def user_toggle_verified(request, pk):
    """Toggle the verified flag of a user."""
    user = get_object_or_404(CustomUser, pk=pk)
    user.is_verified = not user.is_verified
    user.save()
    state = 'verified' if user.is_verified else 'unverified'
    messages.success(request, f'{user.email} is now {state}.')
    return redirect('adminpanel:user_detail', pk=pk)


@admin_required
@require_http_methods(["POST"])
def user_set_role(request, pk):
    """Change the role of a user (student / owner / admin)."""
    user = get_object_or_404(CustomUser, pk=pk)
    role = request.POST.get('role')
    valid_roles = dict(CustomUser.ROLE_CHOICES)

    if role not in valid_roles:
        messages.error(request, 'Invalid role selected.')
        return redirect('adminpanel:user_detail', pk=pk)

    if user.pk == request.user.pk:
        user.role = 'admin'
        messages.info(request, 'You cannot change your own role.')
        return redirect('adminpanel:user_detail', pk=pk)

    user.role = role
    if role != 'admin' and user.is_staff:
        user.is_staff = False
    user.save()
    messages.success(request, f'{user.email} role changed to {valid_roles[role]}.')
    return redirect('adminpanel:user_detail', pk=pk)


@admin_required
@require_http_methods(["POST"])
def user_delete(request, pk):
    """Delete a user account permanently."""
    user = get_object_or_404(CustomUser, pk=pk)
    if user.pk == request.user.pk:
        messages.error(request, 'You cannot delete your own account.')
        return redirect('adminpanel:user_detail', pk=pk)
    email = user.email
    user.delete()
    messages.success(request, f'User {email} has been deleted.')
    return redirect('adminpanel:users')


# ============= HOSTELS =============


@admin_required
def hostel_list(request):
    """List all hostels with search and status filters."""
    hostels = Hostel.objects.all()
    status = request.GET.get('status', '')
    query = request.GET.get('q', '')

    if status == 'verified':
        hostels = hostels.filter(is_verified=True)
    elif status == 'unverified':
        hostels = hostels.filter(is_verified=False)
    elif status == 'active':
        hostels = hostels.filter(is_active=True)
    elif status == 'inactive':
        hostels = hostels.filter(is_active=False)

    if query:
        hostels = hostels.filter(Q(name__icontains=query) | Q(city__icontains=query) |
                                 Q(owner__email__icontains=query))

    context = {
        'hostels': hostels,
        'status': status,
        'query': query,
    }
    return render(request, 'adminpanel/hostels.html', context)


@admin_required
def hostel_detail(request, pk):
    """Single hostel: details, rooms, bookings, reservations + admin actions."""
    hostel = get_object_or_404(Hostel, pk=pk)
    context = {
        'hostel': hostel,
        'rooms': hostel.rooms.all(),
        'bookings': Booking.objects.filter(room__hostel=hostel),
        'reservations': hostel.reservations.all(),
    }
    return render(request, 'adminpanel/hostel_detail.html', context)


@admin_required
@require_http_methods(["POST"])
def hostel_toggle_verified(request, pk):
    """Verify or unverify a hostel."""
    hostel = get_object_or_404(Hostel, pk=pk)
    hostel.is_verified = not hostel.is_verified
    hostel.save()
    state = 'verified' if hostel.is_verified else 'unverified'
    messages.success(request, f'{hostel.name} is now {state}.')
    return redirect('adminpanel:hostel_detail', pk=pk)


@admin_required
@require_http_methods(["POST"])
def hostel_toggle_active(request, pk):
    """Show or hide a hostel on the site."""
    hostel = get_object_or_404(Hostel, pk=pk)
    hostel.is_active = not hostel.is_active
    hostel.save()
    state = 'active' if hostel.is_active else 'inactive'
    messages.success(request, f'{hostel.name} is now {state}.')
    return redirect('adminpanel:hostel_detail', pk=pk)


@admin_required
@require_http_methods(["POST"])
def hostel_delete(request, pk):
    """Delete a hostel and all of its rooms."""
    hostel = get_object_or_404(Hostel, pk=pk)
    name = hostel.name
    hostel.delete()
    messages.success(request, f'Hostel "{name}" has been deleted.')
    return redirect('adminpanel:hostels')


# ============= BOOKINGS =============


@admin_required
def booking_list(request):
    """List all bookings with status filter."""
    bookings = Booking.objects.all()
    status = request.GET.get('status', '')
    query = request.GET.get('q', '')

    if status:
        bookings = bookings.filter(status=status)
    if query:
        bookings = bookings.filter(Q(guest__email__icontains=query) |
                                   Q(guest_name__icontains=query) |
                                   Q(guest_phone__icontains=query) |
                                   Q(room__hostel__name__icontains=query))

    context = {
        'bookings': bookings,
        'status': status,
        'query': query,
        'booking_statuses': Booking.STATUS_CHOICES,
    }
    return render(request, 'adminpanel/bookings.html', context)


@admin_required
def booking_detail(request, pk):
    """Single booking with status management."""
    booking = get_object_or_404(Booking, pk=pk)
    context = {
        'booking': booking,
        'booking_statuses': Booking.STATUS_CHOICES,
    }
    return render(request, 'adminpanel/booking_detail.html', context)


@admin_required
@require_http_methods(["POST"])
def booking_set_status(request, pk):
    """Update a booking's status."""
    booking = get_object_or_404(Booking, pk=pk)
    status = request.POST.get('status')
    valid_statuses = dict(Booking.STATUS_CHOICES)

    if status not in valid_statuses:
        messages.error(request, 'Invalid status selected.')
        return redirect('adminpanel:booking_detail', pk=pk)

    booking.status = status
    booking.save()
    messages.success(request, f'Booking #{booking.id} status changed to {valid_statuses[status]}.')
    return redirect('adminpanel:booking_detail', pk=pk)


@admin_required
@require_http_methods(["POST"])
def booking_delete(request, pk):
    """Delete a booking."""
    booking = get_object_or_404(Booking, pk=pk)
    booking_id = booking.id
    booking.delete()
    messages.success(request, f'Booking #{booking_id} has been deleted.')
    return redirect('adminpanel:bookings')


# ============= RESERVATIONS =============


@admin_required
def reservation_list(request):
    """List all reservation requests."""
    reservations = Reservation.objects.all().order_by('-created_at')
    status = request.GET.get('status', '')
    query = request.GET.get('q', '')

    if status:
        reservations = reservations.filter(status=status)
    if query:
        reservations = reservations.filter(Q(guest_name__icontains=query) |
                                           Q(guest_phone__icontains=query) |
                                           Q(hostel__name__icontains=query))

    context = {
        'reservations': reservations,
        'status': status,
        'query': query,
        'reservation_statuses': Reservation.STATUS_CHOICES,
    }
    return render(request, 'adminpanel/reservations.html', context)


@admin_required
@require_http_methods(["POST"])
def reservation_action(request, pk):
    """Confirm or cancel a reservation request."""
    action = request.POST.get('action')
    reservation = get_object_or_404(Reservation, pk=pk)

    if action not in ('confirm', 'cancel'):
        messages.error(request, 'Invalid action.')
        return redirect('adminpanel:reservations')

    if action == 'confirm':
        reservation.status = 'confirmed'
        label = 'confirmed'
    else:
        reservation.status = 'cancelled'
        label = 'cancelled'

    reservation.save()
    messages.success(request, f'Reservation by {reservation.guest_name} has been {label}.')
    return redirect('adminpanel:reservations')


# ============= TESTIMONIALS =============


@admin_required
def testimonial_list(request):
    """List all testimonials (reviews)."""
    testimonials = Testimonial.objects.all().order_by('-created_at')
    visibility = request.GET.get('visibility', '')

    if visibility == 'active':
        testimonials = testimonials.filter(is_active=True)
    elif visibility == 'hidden':
        testimonials = testimonials.filter(is_active=False)

    context = {
        'testimonials': testimonials,
        'visibility': visibility,
    }
    return render(request, 'adminpanel/testimonials.html', context)


@admin_required
@require_http_methods(["POST"])
def testimonial_toggle_active(request, pk):
    """Show / hide a testimonial on the site."""
    testimonial = get_object_or_404(Testimonial, pk=pk)
    testimonial.is_active = not testimonial.is_active
    testimonial.save()
    state = 'shown' if testimonial.is_active else 'hidden'
    messages.success(request, f'Testimonial #{testimonial.id} is now {state}.')
    return redirect('adminpanel:testimonials')


@admin_required
@require_http_methods(["POST"])
def testimonial_delete(request, pk):
    """Delete a testimonial."""
    testimonial = get_object_or_404(Testimonial, pk=pk)
    testimonial.delete()
    messages.success(request, f'Testimonial #{testimonial.id} has been deleted.')
    return redirect('adminpanel:testimonials')