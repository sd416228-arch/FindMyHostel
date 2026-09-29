from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.contrib import messages
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from datetime import datetime
import json
from .models import Booking
from hostels.models import Room
from accounts.validators import is_valid_phone

# ============= OWNER BOOKING VIEWS =============

@login_required(login_url='accounts:owner_login')
def owner_booking_list(request):
    """Owner portal: list booking requests for the owner's hostels.
    Defaults to pending (not yet confirmed) bookings."""
    if not request.user.is_hostel_owner():
        messages.error(request, 'Access denied. Only hostel owners can access this.')
        return redirect('home')

    status = request.GET.get('status', 'pending')
    if status not in ('pending', 'confirmed', 'checked_in', 'completed', 'cancelled', 'all'):
        status = 'pending'

    bookings = Booking.objects.filter(
        room__hostel__owner=request.user
    )
    if status != 'all':
        bookings = bookings.filter(status=status)
    bookings = bookings.order_by('-created_at')

    context = {
        'bookings': bookings,
        'current_status': status,
        'total_pending': Booking.objects.filter(room__hostel__owner=request.user, status='pending').count(),
        'total_confirmed': Booking.objects.filter(room__hostel__owner=request.user, status='confirmed').count(),
        'total_completed': Booking.objects.filter(room__hostel__owner=request.user, status='completed').count(),
        'total_cancelled': Booking.objects.filter(room__hostel__owner=request.user, status='cancelled').count(),
    }
    return render(request, 'bookings/owner_list.html', context)

@login_required(login_url='accounts:owner_login')
@require_http_methods(["POST"])
def owner_update_booking(request, pk, action):
    """Owner accepts (confirms) or rejects (cancels) a booking"""
    if action not in ('accept', 'reject'):
        messages.error(request, 'Invalid action.')
        return redirect('bookings:owner_list')

    booking = get_object_or_404(Booking, pk=pk)

    if booking.room.hostel.owner != request.user:
        messages.error(request, 'You can only manage bookings for your own hostels.')
        return redirect('bookings:owner_list')

    if booking.status not in ('pending', 'confirmed'):
        messages.warning(request, 'This booking has already been handled.')
        return redirect('bookings:owner_list')

    if action == 'accept':
        booking.status = 'confirmed'
        booking.save()
        messages.success(request, f'Booking by {booking.guest_name} accepted.')
    else:
        booking.status = 'cancelled'
        booking.save()
        messages.success(request, f'Booking by {booking.guest_name} rejected.')

    return redirect('bookings:owner_list')

# ============= BOOKING VIEWS =============

@login_required(login_url='accounts:login')
def booking_list(request):
    """List user's bookings"""
    bookings = Booking.objects.filter(guest=request.user).order_by('-created_at')
    
    context = {
        'bookings': bookings,
    }
    return render(request, 'bookings/list.html', context)

@login_required(login_url='accounts:login')
def booking_detail(request, pk):
    """Booking detail view"""
    booking = get_object_or_404(Booking, pk=pk, guest=request.user)
    
    context = {
        'booking': booking,
    }
    return render(request, 'bookings/detail.html', context)

@login_required(login_url='accounts:login')
@require_http_methods(["POST"])
def cancel_booking(request, pk):
    """Cancel booking"""
    booking = get_object_or_404(Booking, pk=pk, guest=request.user)
    
    if booking.status in ['completed', 'cancelled']:
        messages.error(request, 'Cannot cancel this booking')
        return redirect('bookings:detail', pk=pk)
    
    booking.status = 'cancelled'
    booking.save()
    messages.success(request, 'Booking cancelled successfully')
    return redirect('bookings:list')

# ============= API ENDPOINTS =============

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_create_booking(request):
    """
    API to create booking
    Handles AJAX booking submission for a stay
    """
    try:
        data = request.POST
        room_id = data.get('room_id')
        starting_date_str = data.get('starting_date')
        days = int(data.get('days', 1))
        number_of_guests = int(data.get('number_of_guests', 1))
        guest_name = data.get('guest_name')
        guest_phone = data.get('guest_phone')
        special_requests = data.get('special_requests', '')
        
        # Validation
        if not all([room_id, starting_date_str]):
            return Response({'error': 'Missing required fields'}, status=400)

        if guest_phone and not is_valid_phone(guest_phone):
            return Response({'error': 'Phone number must be exactly 10 digits'}, status=400)
        
        # Get room
        room = Room.objects.get(id=room_id)
        
        # Parse starting date
        starting_date = datetime.strptime(starting_date_str, '%Y-%m-%d').date()
        if starting_date < timezone.now().date():
            return Response({'error': 'Starting date cannot be in the past'}, status=400)

        if days < 1:
            return Response({'error': 'Number of days must be at least 1'}, status=400)
        
        # Check capacity
        if number_of_guests > room.capacity:
            return Response({
                'error': f'Room capacity is {room.capacity}'
            }, status=400)
        
# Check availability for the selected date
        if Booking.objects.filter(
            room=room,
            starting_date=starting_date,
            status__in=['pending', 'confirmed', 'checked_in']
        ).exists():
            return Response({
                'error': 'Room is not available for the selected date'
            }, status=400)

        # Calculate price (monthly rent pro-rated to the number of days)
        total_price = round((room.monthly_rent / 30) * days, 2)

        # Create booking
        try:
            booking = Booking.objects.create(
                guest=request.user,
                room=room,
                starting_date=starting_date,
                number_of_guests=number_of_guests,
                monthly_rent=room.monthly_rent,
                total_nights=days,
                total_price=total_price,
                guest_name=guest_name or request.user.first_name or 'Guest',
                guest_email=request.user.email,
                guest_phone=guest_phone or request.user.phone or '',
                special_requests=special_requests,
                status='pending'
            )
        except Exception:
            return Response({
                'error': 'This room is no longer available for the selected date.'
            }, status=409)
        
        return Response({
            'success': True,
            'booking_id': booking.id,
            'total_price': str(total_price),
            'days': days,
            'message': 'Booking created successfully! Check your bookings page.'
        })
    
    except Room.DoesNotExist:
        return Response({'error': 'Room not found'}, status=404)
    except ValueError as e:
        return Response({'error': str(e)}, status=400)
    except Exception as e:
        return Response({'error': f'Error creating booking: {str(e)}'}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_user_bookings(request):
    """API to get user's bookings"""
    bookings = Booking.objects.filter(guest=request.user).order_by('-created_at')
    
    data = [
        {
            'id': b.id,
            'room': b.room.room_number,
            'hostel': b.room.hostel.name,
            'starting_date': b.starting_date.isoformat(),
            'status': b.status,
            'total_price': str(b.total_price),
        }
        for b in bookings
    ]
    
    return Response({'bookings': data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_cancel_booking(request, pk):
    """API to cancel booking"""
    try:
        booking = Booking.objects.get(id=pk, guest=request.user)
        
        if booking.status in ['completed', 'cancelled']:
            return Response({
                'error': 'Cannot cancel this booking'
            }, status=400)
        
        booking.status = 'cancelled'
        booking.save()
        
        return Response({
            'success': True,
            'message': 'Booking cancelled successfully'
        })
    
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=404)
