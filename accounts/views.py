from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import CustomUser
from django.contrib import messages

# ============= REGISTER VIEW =============
@require_http_methods(["GET", "POST"])
def register(request):
    """Register new user"""
    if request.user.is_authenticated:
        if request.user.is_hostel_owner():
            return redirect('hostels:owner_dashboard')
        else:
            return redirect('home')
            
    if request.method == 'POST':
        email = request.POST.get('email')
        username = request.POST.get('username')
        password = request.POST.get('password')
        password_confirm = request.POST.get('password_confirm')
        role = request.POST.get('role', 'student')
        phone = request.POST.get('phone', '')
        
        # Validation
        errors = {}
        
        if CustomUser.objects.filter(email=email).exists():
            errors['email'] = 'Email already registered'
        
        if CustomUser.objects.filter(username=username).exists():
            errors['username'] = 'Username already taken'
        
        if password != password_confirm:
            errors['password'] = 'Passwords do not match'
        
        if len(password) < 8:
            errors['password'] = 'Password must be at least 8 characters'
        
        if errors:
            return render(request, 'accounts/register.html', {'errors': errors, 'form_data': request.POST})
        
        # Create user
        user = CustomUser.objects.create_user(
            email=email,
            username=username,
            password=password,
            role=role,
            phone=phone
        )
        
        login(request, user)
        messages.success(request, 'Registration successful! Welcome to FindMyHostel.')
        if user.is_hostel_owner():
            return redirect('hostels:owner_dashboard')
        else:
            return redirect('home')
    
    return render(request, 'accounts/register.html')

# ============= LOGIN VIEW =============
@require_http_methods(["GET", "POST"])
def login_view(request):
    """Login user"""
    if request.user.is_authenticated:
        if request.user.is_hostel_owner():
            return redirect('hostels:owner_dashboard')
        else:
            return redirect('home')

    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        try:
            user = CustomUser.objects.get(email=email)
            user = authenticate(request, username=user.username, password=password)
            
            if user is not None:
                login(request, user)
                messages.success(request, f'Welcome back, {user.email}!')
                
                # Redirect based on role
                if user.is_hostel_owner():
                    return redirect('hostels:owner_dashboard')
                else:
                    return redirect('home')
            else:
                messages.error(request, 'Invalid password')
        except CustomUser.DoesNotExist:
            messages.error(request, 'Email not found')
        
        return render(request, 'accounts/login.html', {'email': email})
    
    return render(request, 'accounts/login.html')

# ============= LOGOUT VIEW =============
@login_required(login_url='accounts:login')
def logout_view(request):
    """Logout user"""
    logout(request)
    messages.success(request, 'You have been logged out successfully')
    return redirect('home')

# ============= PROFILE VIEW =============
@login_required(login_url='accounts:login')
def profile(request):
    """User profile view"""
    user = request.user
    context = {
        'user': user,
        'role': user.get_role_display()
    }
    return render(request, 'accounts/profile.html', context)

# ============= EDIT PROFILE VIEW =============
@login_required(login_url='accounts:login')
@require_http_methods(["GET", "POST"])
def edit_profile(request):
    """Edit user profile"""
    user = request.user
    
    if request.method == 'POST':
        user.phone = request.POST.get('phone', user.phone)
        
        if request.FILES.get('profile_picture'):
            user.profile_picture = request.FILES['profile_picture']
        
        user.save()
        messages.success(request, 'Profile updated successfully')
        return redirect('accounts:profile')
    
    context = {'user': user}
    return render(request, 'accounts/edit_profile.html', context)

# ============= STUDENT REGISTER =============
@require_http_methods(["GET", "POST"])
def student_register(request):
    """Register as student/traveler"""
    if request.user.is_authenticated:
        if request.user.is_hostel_owner():
            return redirect('hostels:owner_dashboard')
        else:
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
        
        if errors:
            return render(request, 'accounts/student_register.html', {'errors': errors, 'form_data': request.POST})
        
        user = CustomUser.objects.create_user(
            email=email,
            username=username,
            password=password,
            role='student',
            phone=phone
        )
        
        login(request, user)
        messages.success(request, 'Registration successful! Welcome to FindMyHostel.')
        return redirect('home')
    
    return render(request, 'accounts/student_register.html')

# ============= STUDENT LOGIN =============
@require_http_methods(["GET", "POST"])
def student_login(request):
    """Login as student/traveler"""
    if request.user.is_authenticated:
        if request.user.is_hostel_owner():
            return redirect('hostels:owner_dashboard')
        else:
            return redirect('home')

    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        try:
            user = CustomUser.objects.get(email=email)
            user_auth = authenticate(request, username=user.username, password=password)
            
            if user_auth is not None:
                if user_auth.is_student():
                    login(request, user_auth)
                    messages.success(request, f'Welcome back, {user_auth.email}!')
                    return redirect('home')
                else:
                    messages.error(request, 'This account is registered as owner. Please login with owner account.')
            else:
                messages.error(request, 'Invalid password')
        except CustomUser.DoesNotExist:
            messages.error(request, 'Email not found')
        
        return render(request, 'accounts/student_login.html', {'email': email})
    
    return render(request, 'accounts/student_login.html')

# ============= OWNER REGISTER =============
@require_http_methods(["GET", "POST"])
def owner_register(request):
    """Register as hostel owner"""
    if request.user.is_authenticated:
        if request.user.is_hostel_owner():
            return redirect('hostels:owner_dashboard')
        else:
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
        
        if errors:
            return render(request, 'accounts/owner_register.html', {'errors': errors, 'form_data': request.POST})
        
        user = CustomUser.objects.create_user(
            email=email,
            username=username,
            password=password,
            role='owner',
            phone=phone
        )
        
        login(request, user)
        messages.success(request, 'Registration successful! Welcome to your owner dashboard.')
        return redirect('hostels:owner_dashboard')
    
    return render(request, 'accounts/owner_register.html')

@login_required(login_url='accounts:student_login')
def student_dashboard(request):
    """Student/traveler dashboard"""
    from bookings.models import Booking
    from django.utils import timezone
    
    user = request.user
    today = timezone.now().date()
    
    # Get all bookings for this user
    all_bookings = Booking.objects.filter(guest=user).order_by('-created_at')
    
    # Current and upcoming bookings
    current_bookings = all_bookings.filter(
        status__in=['pending', 'confirmed', 'checked_in'],
        check_in_date__lte=today,
        check_out_date__gt=today
    ) | all_bookings.filter(
        status__in=['pending', 'confirmed', 'checked_in'],
        check_in_date__gt=today
    )
    
    # Past bookings
    past_bookings = all_bookings.filter(
        status__in=['completed', 'cancelled']
    ) | all_bookings.filter(
        check_out_date__lte=today,
        status__in=['pending', 'confirmed', 'checked_in']
    )
    
    # Count unique countries
    countries = set()
    for booking in all_bookings:
        if booking.room.hostel.country:
            countries.add(booking.room.hostel.country)
    
    context = {
        'user': user,
        'current_bookings': current_bookings[:5],
        'past_bookings': past_bookings[:5],
        'all_bookings': all_bookings,
        'countries_count': len(countries),
    }
    
    return render(request, 'accounts/student_dashboard.html', context)

# ============= OWNER LOGIN =============
@require_http_methods(["GET", "POST"])
def owner_login(request):
    """Login as hostel owner"""
    if request.user.is_authenticated:
        if request.user.is_hostel_owner():
            return redirect('hostels:owner_dashboard')
        else:
            return redirect('home')

    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        try:
            user = CustomUser.objects.get(email=email)
            user_auth = authenticate(request, username=user.username, password=password)
            
            if user_auth is not None:
                if user_auth.is_hostel_owner():
                    login(request, user_auth)
                    messages.success(request, f'Welcome to your dashboard, {user_auth.email}!')
                    return redirect('hostels:owner_dashboard')
                else:
                    messages.error(request, 'This account is registered as traveler. Please login with traveler account.')
            else:
                messages.error(request, 'Invalid password')
        except CustomUser.DoesNotExist:
            messages.error(request, 'Email not found')
        
        return render(request, 'accounts/owner_login.html', {'email': email})
    
    return render(request, 'accounts/owner_login.html')

# ============= API ENDPOINT: Check if email exists =============
@csrf_exempt
def check_email_api(request):
    """API to check if email exists (for AJAX validation)"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email', '').lower()
            exists = CustomUser.objects.filter(email=email).exists()
            return JsonResponse({'exists': exists})
        except:
            return JsonResponse({'error': 'Invalid request'}, status=400)
    return JsonResponse({'error': 'Only POST allowed'}, status=405)
