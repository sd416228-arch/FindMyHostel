from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.contrib import messages
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from datetime import datetime
import json
from .models import Booking
from hostels.models import Room

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
    Handles AJAX booking submission with availability check
    """
    try:
        data = request.POST
        room_id = data.get('room_id')
        check_in_str = data.get('check_in')
        check_out_str = data.get('check_out')
        number_of_guests = int(data.get('number_of_guests', 1))
        guest_name = data.get('guest_name')
        guest_phone = data.get('guest_phone')
        special_requests = data.get('special_requests', '')
        
        # Validation
        if not all([room_id, check_in_str, check_out_str]):
            return Response({'error': 'Missing required fields'}, status=400)
        
        # Get room
        room = Room.objects.get(id=room_id)
        
        # Parse dates
        check_in = datetime.strptime(check_in_str, '%Y-%m-%d').date()
        check_out = datetime.strptime(check_out_str, '%Y-%m-%d').date()
        
        # Check availability
        if not Booking.check_availability(room, check_in, check_out):
            return Response({
                'error': 'Room is not available for selected dates'
            }, status=400)
        
        # Check capacity
        if number_of_guests > room.capacity:
            return Response({
                'error': f'Room capacity is {room.capacity}'
            }, status=400)
        
        # Calculate price
        total_price, nights = Booking.calculate_total_price(
            room.price_per_night, check_in, check_out
        )
        
        # Create booking
        booking = Booking.objects.create(
            guest=request.user,
            room=room,
            check_in_date=check_in,
            check_out_date=check_out,
            number_of_guests=number_of_guests,
            price_per_night=room.price_per_night,
            total_nights=nights,
            total_price=total_price,
            guest_name=guest_name or request.user.first_name or 'Guest',
            guest_email=request.user.email,
            guest_phone=guest_phone or request.user.phone or '',
            special_requests=special_requests,
            status='pending'
        )
        
        return Response({
            'success': True,
            'booking_id': booking.id,
            'total_price': str(total_price),
            'nights': nights,
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
            'check_in': b.check_in_date.isoformat(),
            'check_out': b.check_out_date.isoformat(),
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
