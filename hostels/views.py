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
import json
from .models import Hostel, Room
from bookings.models import Booking

# ============= PUBLIC VIEWS =============

def hostel_list(request):
    """List all hostels with filters"""
    hostels = Hostel.objects.filter(is_active=True)
    
    # Filters
    city = request.GET.get('city', '')
    min_price = request.GET.get('min_price', '')
    max_price = request.GET.get('max_price', '')
    check_in = request.GET.get('check_in', '')
    check_out = request.GET.get('check_out', '')
    
    if city:
        hostels = hostels.filter(city__icontains=city)
    
    if min_price:
        try:
            hostels = hostels.filter(base_price__gte=float(min_price))
        except ValueError:
            pass
    
    if max_price:
        try:
            hostels = hostels.filter(base_price__lte=float(max_price))
        except ValueError:
            pass
    
    # Sort by rating
    hostels = hostels.order_by('-rating')
    
    context = {
        'hostels': hostels,
        'filters': {
            'city': city,
            'min_price': min_price,
            'max_price': max_price,
            'check_in': check_in,
            'check_out': check_out,
        }
    }
    return render(request, 'hostels/list.html', context)

def hostel_detail(request, pk):
    """Hostel detail view"""
    hostel = get_object_or_404(Hostel, pk=pk, is_active=True)
    rooms = hostel.rooms.filter(is_available=True)
    
    check_in = request.GET.get('check_in', '')
    check_out = request.GET.get('check_out', '')
    
    context = {
        'hostel': hostel,
        'rooms': rooms,
        'check_in': check_in,
        'check_out': check_out,
    }
    return render(request, 'hostels/detail.html', context)

# ============= OWNER VIEWS =============

@login_required(login_url='accounts:owner_login')
def owner_dashboard(request):
    """Owner dashboard"""
    if not request.user.is_hostel_owner():
        messages.error(request, 'Access denied. Only hostel owners can access this.')
        return redirect('home')
    
    hostels = Hostel.objects.filter(owner=request.user)
    total_bookings = Booking.objects.filter(room__hostel__owner=request.user).count()
    recent_bookings = Booking.objects.filter(room__hostel__owner=request.user).order_by('-created_at')[:5]
    
    context = {
        'hostels': hostels,
        'total_bookings': total_bookings,
        'recent_bookings': recent_bookings,
    }
    return render(request, 'hostels/owner_dashboard.html', context)

@login_required(login_url='accounts:owner_login')
@require_http_methods(["GET", "POST"])
def hostel_form(request, pk=None):
    """Create or edit hostel"""
    if not request.user.is_hostel_owner():
        messages.error(request, 'Access denied.')
        return redirect('home')
    
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
        hostel.email = data.get('email')
        hostel.website = data.get('website', '')
        
        # Amenities
        hostel.wifi = 'wifi' in data
        hostel.parking = 'parking' in data
        hostel.laundry = 'laundry' in data
        hostel.kitchen = 'kitchen' in data
        hostel.gym = 'gym' in data
        
        hostel.base_price = data.get('base_price')
        
        if request.FILES.get('cover_image'):
            hostel.cover_image = request.FILES['cover_image']
        
        hostel.save()
        messages.success(request, 'Hostel saved successfully')
        return redirect('hostels:owner_dashboard')
    
    context = {'hostel': hostel}
    return render(request, 'hostels/hostel_form.html', context)

@login_required(login_url='accounts:owner_login')
@require_http_methods(["GET", "POST"])
def room_form(request, hostel_id, room_id=None):
    """Create or edit room"""
    if not request.user.is_hostel_owner():
        messages.error(request, 'Access denied.')
        return redirect('home')
    
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
        room.price_per_night = data.get('price_per_night')
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

# ============= API ENDPOINTS =============

@api_view(['GET'])
def api_hostels_search(request):
    """API to search hostels with filters"""
    city = request.GET.get('city', '')
    min_price = request.GET.get('min_price')
    max_price = request.GET.get('max_price')
    
    hostels = Hostel.objects.filter(is_active=True)
    
    if city:
        hostels = hostels.filter(Q(city__icontains=city) | Q(name__icontains=city))
    
    if min_price:
        try:
            hostels = hostels.filter(base_price__gte=float(min_price))
        except:
            pass
    
    if max_price:
        try:
            hostels = hostels.filter(base_price__lte=float(max_price))
        except:
            pass
    
    data = [
        {
            'id': h.id,
            'name': h.name,
            'city': h.city,
            'price': str(h.base_price),
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
        'price': str(hostel.base_price),
        'rating': hostel.rating,
        'amenities': hostel.get_amenities_list(),
        'rooms': [
            {
                'id': r.id,
                'number': r.room_number,
                'type': r.room_type,
                'capacity': r.capacity,
                'price': str(r.price_per_night),
            }
            for r in hostel.rooms.filter(is_available=True)
        ]
    }
    
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_check_availability(request):
    """API to check room availability"""
    try:
        data = request.POST
        room_id = data.get('room_id')
        check_in_str = data.get('check_in')
        check_out_str = data.get('check_out')
        
        room = Room.objects.get(id=room_id)
        check_in = datetime.strptime(check_in_str, '%Y-%m-%d').date()
        check_out = datetime.strptime(check_out_str, '%Y-%m-%d').date()
        
        available = Booking.check_availability(room, check_in, check_out)
        
        return Response({
            'available': available,
            'room_id': room_id,
            'message': 'Room is available' if available else 'Room is not available for selected dates'
        })
    except Exception as e:
        return Response({'error': str(e)}, status=400)
