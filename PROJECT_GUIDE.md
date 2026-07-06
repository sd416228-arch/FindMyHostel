# FindMy Hostel - Complete Project Guide

## QUICK START COMMANDS

```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations accounts hostels bookings
python manage.py migrate

# Create superuser (admin account)
python manage.py createsuperuser

# Run development server
python manage.py runserver

# Run tests
python manage.py test

# Collect static files (for production)
python manage.py collectstatic --noinput
```

**Access:**
- Admin: http://localhost:8000/admin
- Home: http://localhost:8000/
- Browse Hostels: http://localhost:8000/hostels/

---

## PROJECT STRUCTURE

```
FindMy Hostel/
├── config/                 # Project settings
│   ├── settings.py        # Django settings
│   ├── urls.py            # Main URL routing
│   ├── wsgi.py
│   └── asgi.py
├── accounts/              # User authentication
│   ├── models.py          # CustomUser model
│   ├── views.py           # Auth views
│   ├── urls.py
│   ├── admin.py
│   └── templates/accounts/
│       ├── register.html
│       ├── login.html
│       ├── profile.html
│       └── edit_profile.html
├── hostels/               # Hostel management
│   ├── models.py          # Hostel, Room models
│   ├── views.py           # Hostel views & APIs
│   ├── urls.py
│   ├── admin.py
│   └── templates/hostels/
│       ├── list.html
│       ├── detail.html
│       ├── owner_dashboard.html
│       ├── hostel_form.html
│       └── room_form.html
├── bookings/              # Booking system
│   ├── models.py          # Booking model
│   ├── views.py           # Booking views & APIs
│   ├── urls.py
│   ├── tests.py           # Test cases
│   ├── admin.py
│   └── templates/bookings/
│       ├── list.html
│       └── detail.html
├── templates/             # Base templates
│   ├── base.html          # Base template
│   └── home.html          # Home page
├── static/                # CSS, JS, images
├── media/                 # User uploads
├── manage.py
├── requirements.txt
├── .env                   # Environment variables
├── db.sqlite3             # SQLite database
└── README.md
```

---

## FEATURE BREAKDOWN

### 1. Authentication System ✅
- [x] Custom User model (email as username, role field)
- [x] Registration form with validation
- [x] Login with role-based redirects
- [x] User profile & edit profile
- [x] Real-time email validation (AJAX)
- [x] Password validation (min 8 chars)

### 2. Hostel Management ✅
- [x] Hostel listing with filters (city, price)
- [x] Hostel detail page
- [x] Amenities (WiFi, Parking, Laundry, Kitchen, Gym)
- [x] Owner dashboard
- [x] Create/Edit hostel
- [x] Add/Edit rooms
- [x] Room features (AC, Bathroom, TV, Balcony)

### 3. Booking System ✅
- [x] Booking model with dates & status
- [x] Double-booking prevention (SQLite compatible)
- [x] Total price calculation
- [x] AJAX booking flow
- [x] Booking list & detail
- [x] Cancel booking
- [x] Availability check API
- [x] Booking history for users

### 4. Frontend ✅
- [x] Bootstrap 5 responsive design
- [x] Navigation navbar with role-based links
- [x] Home page with hero section
- [x] Hostel listing page
- [x] Hostel detail with booking modal
- [x] Search & filter functionality
- [x] User dashboard

### 5. APIs ✅
- [x] Hostel search API
- [x] Hostel detail API
- [x] Room availability check
- [x] Booking creation
- [x] User bookings list
- [x] Cancel booking

---

## USER ROLES & WORKFLOWS

### Student/Traveler Workflow
1. Register with email
2. Browse hostels by city/price
3. View hostel details
4. Check availability for dates
5. Submit booking via AJAX
6. View booking history
7. Cancel booking if needed

### Hostel Owner Workflow
1. Register as owner
2. Create hostel profile
3. Add multiple rooms
4. View bookings dashboard
5. Edit hostel/room details
6. Monitor bookings in real-time

---

## DATABASE SCHEMA (SQLite)

### CustomUser
- id (PK)
- email (unique)
- username
- password
- role (student/owner)
- phone
- profile_picture
- is_verified
- created_at

### Hostel
- id (PK)
- owner (FK to CustomUser)
- name
- description
- location, city, country
- phone, email, website
- amenities (wifi, parking, laundry, kitchen, gym)
- base_price
- rating, reviews_count
- cover_image
- is_active, is_verified
- created_at, updated_at

### Room
- id (PK)
- hostel (FK to Hostel)
- room_number
- room_type (single/double/dorm/deluxe)
- capacity
- price_per_night
- features (has_ac, has_bathroom, has_tv, has_balcony)
- image
- is_available
- created_at, updated_at

### Booking
- id (PK)
- guest (FK to CustomUser)
- room (FK to Room)
- check_in_date, check_out_date
- number_of_guests
- price_per_night
- total_nights, total_price
- status (pending/confirmed/checked_in/completed/cancelled)
- guest_name, guest_email, guest_phone
- special_requests
- created_at, updated_at

---

## AVAILABILITY LOGIC (SQLite Compatible)

### Double Booking Prevention

```sql
-- Query to check overlapping bookings
SELECT COUNT(*) FROM bookings
WHERE room_id = ?
  AND status IN ('pending', 'confirmed', 'checked_in')
  AND check_in_date < ?  -- checkout date
  AND check_out_date > ?;  -- checkin date
```

### Key Points
1. Only checks active bookings (pending, confirmed, checked_in)
2. Ignores cancelled & completed bookings
3. Checks date overlap: `check_in_date < checkout AND check_out_date > checkin`
4. Automatically prevents overlapping dates

---

## API ENDPOINTS

### Authentication
- `POST /accounts/register/` - Register user
- `POST /accounts/login/` - Login
- `GET /accounts/logout/` - Logout
- `GET /accounts/profile/` - View profile
- `POST /accounts/profile/edit/` - Edit profile
- `POST /accounts/api/check-email/` - Check email exists (AJAX)

### Hostels
- `GET /hostels/` - List hostels (with filters)
- `GET /hostels/<id>/` - Hostel detail
- `GET /hostels/api/search/` - Search API
- `GET /hostels/api/<id>/` - Hostel detail API
- `GET /hostels/dashboard/` - Owner dashboard
- `POST /hostels/create/` - Create hostel
- `POST /hostels/<id>/edit/` - Edit hostel
- `POST /hostels/<hostel_id>/room/create/` - Create room
- `POST /hostels/<hostel_id>/room/<room_id>/edit/` - Edit room
- `POST /hostels/api/check-availability/` - Check room availability

### Bookings
- `GET /bookings/` - List user bookings
- `GET /bookings/<id>/` - Booking detail
- `POST /bookings/<id>/cancel/` - Cancel booking
- `POST /bookings/api/create/` - Create booking (AJAX)
- `GET /bookings/api/user/` - Get user bookings (JSON)
- `POST /bookings/api/<id>/cancel/` - Cancel booking (AJAX)

---

## AJAX IMPLEMENTATION GUIDE

### Fetch CSRF Token
```javascript
const csrftoken = document.cookie.split(';')
    .find(c => c.trim().startsWith('csrftoken='))
    ?.split('=')[1] || 
    document.querySelector('[name=csrfmiddlewaretoken]')?.value;
```

### Make POST Request
```javascript
fetch('/api/endpoint/', {
    method: 'POST',
    body: new FormData(form),
    headers: {
        'X-CSRFToken': csrftoken
    }
})
.then(r => r.json())
.then(data => {
    if (data.success) {
        alert('Success!');
        location.reload();
    } else {
        alert(data.error);
    }
});
```

---

## ENVIRONMENT VARIABLES (.env)

```
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DATABASE_URL=sqlite:///db.sqlite3

EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

---

## COMMON TASKS

### Add Email Notifications
```python
from django.core.mail import send_mail

def send_booking_confirmation(booking):
    subject = f'Booking Confirmation #{booking.id}'
    message = f'Your booking at {booking.room.hostel.name} is confirmed!'
    send_mail(subject, message, 'info@findmyhostel.com', 
              [booking.guest_email])
```

### Generate Reports
```python
# Bookings by hostel this month
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta

month_ago = timezone.now() - timedelta(days=30)
report = Booking.objects.filter(
    created_at__gte=month_ago,
    status__in=['confirmed', 'completed']
).values('room__hostel__name').annotate(count=Count('id'))
```

### Export to CSV
```python
import csv
from django.http import HttpResponse

def export_bookings(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="bookings.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['Guest', 'Hostel', 'Check-in', 'Check-out', 'Status'])
    
    for booking in Booking.objects.all():
        writer.writerow([
            booking.guest_name,
            booking.room.hostel.name,
            booking.check_in_date,
            booking.check_out_date,
            booking.status
        ])
    
    return response
```

---

## TROUBLESHOOTING

### Database Issues
```bash
# Reset database (development only)
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser

# Check migrations status
python manage.py showmigrations
```

### Static Files Not Loading
```bash
# Collect static files
python manage.py collectstatic --noinput

# Clear cache
python manage.py clear_cache
```

### CSRF Token Errors
- Ensure `{% csrf_token %}` in forms
- Use correct header in AJAX: `'X-CSRFToken': csrftoken`
- Check `MIDDLEWARE` includes `CsrfViewMiddleware`

---

## PRODUCTION DEPLOYMENT

### Recommended Services
- **Hosting:** Heroku, DigitalOcean, AWS
- **Database:** PostgreSQL (not SQLite)
- **Static Files:** AWS S3, Cloudinary
- **Email:** SendGrid, Mailgun
- **Monitoring:** Sentry

### Pre-deployment Checklist
```bash
# Run all tests
python manage.py test

# Check for security issues
python manage.py check --deploy

# Collect static files
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate

# Create superuser on production
python manage.py createsuperuser
```

---

## FUTURE ENHANCEMENTS

1. **Payments:** Stripe/PayPal integration
2. **Reviews:** Star ratings & comments
3. **Wishlist:** Save favorite hostels
4. **Notifications:** Email/SMS alerts
5. **Admin Dashboard:** Analytics & reporting
6. **Mobile App:** React Native version
7. **Calendar:** Interactive availability calendar
8. **Messaging:** Direct messaging between users
9. **Multi-language:** i18n support
10. **Dark Mode:** Theme switching

---
