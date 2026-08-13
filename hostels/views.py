from functools import wraps
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.db.models import Q, Avg
from django.contrib import messages
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from datetime import datetime
from .models import Hostel, HostelImage, Review, Room, Testimonial, Reservation
from accounts.validators import is_valid_phone
from bookings.models import Booking
from django.views.generic import TemplateView

# ============= AUTHORIZATION HELPERS =============

def owner_required(view_func):
    """Decorator: allow only logged-in Hostel Owners to access the view."""
    @wraps(view_func)
    @login_required(login_url='accounts:owner_login')
    def _wrapped(request, *args, **kwargs):
        if not request.user.is_hostel_owner():
            messages.error(request, 'Access denied. Only hostel owners can access this.')
            return redirect('home')
        return view_func(request, *args, **kwargs)
    return _wrapped


# ============= PUBLIC VIEWS =============

def hostel_list(request):
    """List all hostels with filters"""
    hostels = Hostel.objects.filter(is_active=True)
    
    # Filters
    city = request.GET.get('city', '')
    min_rent = request.GET.get('min_rent', '')
    max_rent = request.GET.get('max_rent', '')
    
    if city:
        hostels = hostels.filter(city__icontains=city)
    
    if min_rent:
        try:
            hostels = hostels.filter(monthly_rent__gte=float(min_rent))
        except ValueError:
            pass
    
    if max_rent:
        try:
            hostels = hostels.filter(monthly_rent__lte=float(max_rent))
        except ValueError:
            pass
    
    # Sort by rating
    hostels = hostels.order_by('-rating')
    
    context = {
        'hostels': hostels,
        'filters': {
            'city': city,
            'min_rent': min_rent,
            'max_rent': max_rent,
        }
    }
    return render(request, 'hostels/list.html', context)

def hostel_detail(request, pk):
    """Hostel detail view"""
    hostel = get_object_or_404(Hostel, pk=pk, is_active=True)
    rooms = hostel.rooms.filter(is_available=True)

    gallery_images = []
    if hostel.cover_image:
        gallery_images.append(hostel.cover_image.url)
    for img in hostel.images.all():
        gallery_images.append(img.image.url)
    for room in rooms:
        if room.image:
            gallery_images.append(room.image.url)
    if not gallery_images:
        gallery_images = [
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
        ]

    context = {
        'hostel': hostel,
        'rooms': rooms,
        'gallery_images': gallery_images,
        'reviews': hostel.reviews.all(),
        'user_review': None,
        'can_review': False,
    }

    if request.user.is_authenticated and not request.user.is_hostel_owner():
        context['user_review'] = hostel.reviews.filter(user=request.user).first()
        context['has_confirmed_stay'] = has_confirmed_stay(request.user, hostel)
        context['can_review'] = context['has_confirmed_stay'] and not context['user_review']

    return render(request, 'hostels/detail.html', context)


def has_confirmed_stay(user, hostel):
    """A user may only review a hostel after their booking/reservation has been accepted."""
    if Booking.objects.filter(
        guest=user,
        room__hostel=hostel,
        status__in=['confirmed', 'checked_in', 'completed']
    ).exists():
        return True
    if Reservation.objects.filter(user=user, hostel=hostel, status='confirmed').exists():
        return True
    return False


@login_required
@require_http_methods(["POST"])
def submit_review(request, pk):
    """Leave a rating + feedback on a hostel (one review per user per hostel)."""
    hostel = get_object_or_404(Hostel, pk=pk, is_active=True)

    if request.user.is_hostel_owner():
        messages.error(request, 'Hostel owners cannot review hostels.')
        return redirect('hostels:detail', pk=pk)

    if not has_confirmed_stay(request.user, hostel):
        messages.error(request, 'You can review this hostel only after your booking has been accepted.')
        return redirect('hostels:detail', pk=pk)

    if Review.objects.filter(user=request.user, hostel=hostel).exists():
        messages.warning(request, 'You have already reviewed this hostel.')
        return redirect('hostels:detail', pk=pk)

    try:
        rating = int(request.POST.get('rating', 0))
    except (TypeError, ValueError):
        rating = 0
    comment = request.POST.get('comment', '').strip()

    if not 1 <= rating <= 5:
        messages.error(request, 'Please select a rating between 1 and 5 stars.')
        return redirect('hostels:detail', pk=pk)

    if not comment:
        messages.error(request, 'Please write a short comment about your stay.')
        return redirect('hostels:detail', pk=pk)

    Review.objects.create(hostel=hostel, user=request.user, rating=rating, comment=comment)

    # Recompute the hostel's overall rating from real reviews.
    reviews = hostel.reviews.all()
    average = reviews.aggregate(avg=Avg('rating'))['avg'] or 0
    hostel.rating = round(average, 1)
    hostel.reviews_count = reviews.count()
    hostel.save(update_fields=['rating', 'reviews_count'])

    messages.success(request, f'Thank you! Your review of {hostel.name} has been published.')
    return redirect('hostels:detail', pk=pk)

class HomeView(TemplateView):
    template_name = 'home.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['popular_hostels'] = Hostel.objects.order_by('-rating', '-reviews_count')[:6]
        # Fetch active testimonials ordered by newest
        testimonials = Testimonial.objects.filter(is_active=True).order_by('-created_at')
        context['testimonials'] = testimonials
        
        # Serialize for frontend JS
        testimonials_list = []
        for t in testimonials:
            name = t.user.get_full_name() or t.user.username
            testimonials_list.append({
                'name': name,
                'role': t.role,
                'content': t.content,
                'rating': t.rating,
                'avatar': f"https://ui-avatars.com/api/?name={name.replace(' ', '+')}&background=random"
            })
        
        # If empty, provide a default
        if not testimonials_list:
            testimonials_list.append({
                'name': 'FindMy Hostel Team',
                'role': 'Admin',
                'content': 'Welcome to FindMy Hostel! Be the first to leave a review.',
                'rating': 5,
                'avatar': "https://ui-avatars.com/api/?name=Admin&background=random"
            })
            
        context['testimonials'] = testimonials_list

        request = self.request
        context['can_review'] = (
            request.user.is_authenticated
            and not request.user.is_hostel_owner()
            and has_any_accepted_booking(request.user)
        )
        return context

def has_any_accepted_booking(user):
    """A user may only post a review once at least one of their bookings has been accepted."""
    if Booking.objects.filter(
        guest=user,
        status__in=['confirmed', 'checked_in', 'completed']
    ).exists():
        return True
    if Reservation.objects.filter(user=user, status='confirmed').exists():
        return True
    return False


@login_required
@require_http_methods(["POST"])
def submit_testimonial(request):
    """Handle submission of user testimonials (only after an accepted booking)."""
    if not has_any_accepted_booking(request.user):
        messages.error(request, 'You can leave a review only after one of your hostel bookings has been accepted.')
        return redirect('home')

    role = request.POST.get('role', 'User')
    rating = request.POST.get('rating', 5)
    content = request.POST.get('content', '')

    if content:
        Testimonial.objects.create(
            user=request.user,
            role=role,
            rating=rating,
            content=content
        )
        messages.success(request, 'Your review has been added successfully!')
    else:
        messages.error(request, 'Review content cannot be empty.')
        
    return redirect('home')

# ============= OWNER VIEWS =============

@owner_required
def owner_dashboard(request):
    """Owner dashboard"""
    hostels = Hostel.objects.filter(owner=request.user)
    my_booking_filter = Q(room__hostel__owner=request.user)
    total_bookings = Booking.objects.filter(my_booking_filter).count()
    recent_bookings = Booking.objects.filter(my_booking_filter).order_by('-created_at')[:5]
    hostel_reviews = Review.objects.filter(hostel__owner=request.user).select_related('user', 'hostel').order_by('-created_at')

    context = {
        'hostels': hostels,
        'total_bookings': total_bookings,
        'recent_bookings': recent_bookings,
        'hostel_reviews': hostel_reviews,
    }
    return render(request, 'hostels/owner_dashboard.html', context)

@owner_required
@require_http_methods(["GET", "POST"])
def hostel_form(request, pk=None):
    """Create or edit hostel"""
    hostel = None
    if pk:
        hostel = get_object_or_404(Hostel, pk=pk, owner=request.user)
    
    if request.method == 'POST':
        data = request.POST
        
        if not hostel:
            hostel = Hostel(owner=request.user)
        
        hostel.name = data.get('name')
        hostel.description = data.get('description')
        hostel.location = data.get('location')
        hostel.city = data.get('city')
        hostel.country = data.get('country')
        hostel.phone = data.get('phone')

        if not is_valid_phone(hostel.phone):
            messages.error(request, 'Hostel phone number must be exactly 10 digits.')
            if pk:
                return redirect('hostels:edit', pk=pk)
            return redirect('hostels:create')

        hostel.email = data.get('email')
        hostel.website = data.get('website', '')
        
        # Amenities
        hostel.wifi = 'wifi' in data
        hostel.parking = 'parking' in data
        hostel.laundry = 'laundry' in data
        hostel.kitchen = 'kitchen' in data
        hostel.gym = 'gym' in data
        
        hostel.monthly_rent = data.get('monthly_rent')
        
        if request.FILES.get('cover_image'):
            hostel.cover_image = request.FILES['cover_image']
        
        hostel.save()

        images = request.FILES.getlist('additional_images')
        for img in images:
            HostelImage.objects.create(hostel=hostel, image=img)
        
        messages.success(request, 'Hostel saved successfully')
        return redirect('hostels:owner_dashboard')
    
    context = {'hostel': hostel}
    return render(request, 'hostels/hostel_form.html', context)

@owner_required
@require_http_methods(["GET", "POST"])
def room_form(request, hostel_id, room_id=None):
    """Create or edit room"""
    hostel = get_object_or_404(Hostel, pk=hostel_id, owner=request.user)
    room = None
    
    if room_id:
        room = get_object_or_404(Room, pk=room_id, hostel=hostel)
    
    if request.method == 'POST':
        data = request.POST
        
        if not room:
            room = Room(hostel=hostel)
        
        room.room_number = data.get('room_number')
        room.room_type = data.get('room_type')
        room.capacity = data.get('capacity')
        room.monthly_rent = data.get('monthly_rent')
        room.description = data.get('description', '')
        
        # Features
        room.has_ac = 'has_ac' in data
        room.has_bathroom = 'has_bathroom' in data
        room.has_tv = 'has_tv' in data
        room.has_balcony = 'has_balcony' in data
        
        if request.FILES.get('image'):
            room.image = request.FILES['image']
        
        room.save()
        messages.success(request, 'Room saved successfully')
        return redirect('hostels:owner_dashboard')
    
    context = {'hostel': hostel, 'room': room}
    return render(request, 'hostels/room_form.html', context)

@owner_required
@require_http_methods(["POST"])
def hostel_delete(request, pk):
    hostel = get_object_or_404(Hostel, pk=pk, owner=request.user)
    hostel.delete()
    messages.success(request, f'Hostel "{hostel.name}" deleted successfully')
    return redirect('hostels:owner_dashboard')

# ============= RESERVATION VIEWS =============

@login_required
@require_http_methods(["POST"])
def submit_reservation(request, pk):
    """User submits a simple reservation request for a hostel"""
    hostel = get_object_or_404(Hostel, pk=pk)
    if request.user.is_hostel_owner():
        messages.error(request, 'Hostel owners cannot reserve hostels.')
        return redirect('hostels:detail', pk=pk)

    guest_name = request.POST.get('guest_name', '').strip()
    guest_phone = request.POST.get('guest_phone', '').strip()
    message = request.POST.get('message', '').strip()

    if not guest_name or not guest_phone:
        messages.error(request, 'Please provide your name and phone number.')
        return redirect('hostels:detail', pk=pk)

    if not is_valid_phone(guest_phone):
        messages.error(request, 'Phone number must be exactly 10 digits.')
        return redirect('hostels:detail', pk=pk)

    if Reservation.objects.filter(
        user=request.user,
        hostel=hostel,
        status='pending'
    ).exists():
        messages.warning(request, f'You already have a pending reservation request for {hostel.name}. Wait for the owner to respond.')
        return redirect('hostels:detail', pk=pk)

    try:
        Reservation.objects.create(
            user=request.user,
            hostel=hostel,
            guest_name=guest_name,
            guest_phone=guest_phone,
            message=message,
            status='pending'
        )
    except Exception:
        messages.warning(request, f'You already have a pending reservation request for {hostel.name}.')
        return redirect('hostels:detail', pk=pk)

    messages.success(request, f'Reservation request sent for {hostel.name}. The owner will confirm soon.')

    try:
        from django.core.mail import send_mail
        send_mail(
            subject=f'New Reservation Request - {hostel.name}',
            message=(
                f'A user has requested to reserve your hostel.\n\n'
                f'Hostel: {hostel.name}\n'
                f'Guest: {guest_name}\n'
                f'Phone: {guest_phone}\n'
                f'Message: {message or "-"}\n\n'
                f'Confirm or cancel this request from the Reservations page '
                f'in your Owner Portal.'
            ),
            from_email='no-reply@findmyhostel.com',
            recipient_list=[hostel.owner.email],
            fail_silently=True,
        )
    except Exception:
        pass

    return redirect('hostels:detail', pk=pk)

@login_required
def my_reservations(request):
    """User portal: the traveler's own reservation requests."""
    if request.user.is_hostel_owner():
        messages.error(request, 'Hostel owners cannot reserve hostels.')
        return redirect('hostels:owner_dashboard')

    context = {
        'reservations': Reservation.objects.filter(user=request.user).order_by('-created_at'),
    }
    return render(request, 'bookings/reservations.html', context)


@owner_required
def reservation_list(request):
    """Owner portal: hostels that have reservation requests"""
    hostels = Hostel.objects.filter(owner=request.user)
    reservations = Reservation.objects.filter(hostel__owner=request.user).order_by('-created_at')

    hostel_groups = []
    for hostel in hostels:
        hostel_res = [r for r in reservations if r.hostel_id == hostel.id]
        if hostel_res:
            pending_count = sum(1 for r in hostel_res if r.status == 'pending')
            hostel_groups.append({
                'hostel': hostel,
                'reservations': hostel_res,
                'pending_count': pending_count,
                'total_count': len(hostel_res),
            })

    context = {
        'hostel_groups': hostel_groups,
        'total_pending': reservations.filter(status='pending').count(),
    }
    return render(request, 'hostels/reservations.html', context)

@owner_required
def reservation_detail(request, hostel_id):
    """Owner portal: manage reservations for one of their hostels"""
    hostel = get_object_or_404(Hostel, pk=hostel_id, owner=request.user)
    reservations = Reservation.objects.filter(hostel=hostel).order_by('-created_at')
    context = {
        'hostel': hostel,
        'reservations': reservations,
    }
    return render(request, 'hostels/reservation_detail.html', context)

@owner_required
@require_http_methods(["POST"])
def update_reservation(request, pk, action):
    """Owner confirms or cancels a reservation"""
    if action not in ('confirm', 'cancel'):
        messages.error(request, 'Invalid action.')
        return redirect('hostels:owner_dashboard')

    reservation = get_object_or_404(Reservation, pk=pk)

    if reservation.hostel.owner != request.user:
        messages.error(request, 'You can only manage reservations for your own hostels.')
        return redirect('hostels:owner_dashboard')

    if action == 'confirm':
        reservation.status = 'confirmed'
        reservation.save()
        messages.success(request, f'Reservation by {reservation.guest_name} confirmed.')
    else:
        reservation.status = 'cancelled'
        reservation.save()
        messages.success(request, f'Reservation by {reservation.guest_name} cancelled.')

    return redirect('hostels:owner_dashboard')

# ============= API ENDPOINTS =============

@api_view(['GET'])
def api_hostels_search(request):
    """API to search hostels with filters"""
    city = request.GET.get('city', '')
    min_rent = request.GET.get('min_rent')
    max_rent = request.GET.get('max_rent')
    
    hostels = Hostel.objects.filter(is_active=True)
    
    if city:
        hostels = hostels.filter(Q(city__icontains=city) | Q(name__icontains=city))
    
    if min_rent:
        try:
            hostels = hostels.filter(monthly_rent__gte=float(min_rent))
        except:
            pass
    
    if max_rent:
        try:
            hostels = hostels.filter(monthly_rent__lte=float(max_rent))
        except:
            pass
    
    data = [
        {
            'id': h.id,
            'name': h.name,
            'city': h.city,
            'monthly_rent': str(h.monthly_rent),
            'rating': h.rating,
            'amenities': h.get_amenities_list(),
        }
        for h in hostels[:20]
    ]
    
    return Response({'hostels': data})

@api_view(['GET'])
def api_hostel_detail(request, pk):
    """API for hostel details"""
    hostel = get_object_or_404(Hostel, pk=pk)
    
    data = {
        'id': hostel.id,
        'name': hostel.name,
        'description': hostel.description,
        'city': hostel.city,
        'monthly_rent': str(hostel.monthly_rent),
        'rating': hostel.rating,
        'amenities': hostel.get_amenities_list(),
        'rooms': [
            {
                'id': r.id,
                'number': r.room_number,
                'type': r.room_type,
                'capacity': r.capacity,
                'monthly_rent': str(r.monthly_rent),
            }
            for r in hostel.rooms.filter(is_available=True)
        ]
    }
    
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_check_availability(request):
    """API to check room availability for a single night stay"""
    try:
        data = request.POST
        room_id = data.get('room_id')
        stay_date_str = data.get('stay_date')
        
        room = Room.objects.get(id=room_id)
        stay_date = datetime.strptime(stay_date_str, '%Y-%m-%d').date()
        
        available = not Booking.objects.filter(
            room=room,
            stay_date=stay_date,
            status__in=['pending', 'confirmed', 'checked_in']
        ).exists()
        
        return Response({
            'available': available,
            'room_id': room_id,
            'message': 'Room is available' if available else 'Room is not available for the selected date'
        })
    except Exception as e:
        return Response({'error': str(e)}, status=400)
