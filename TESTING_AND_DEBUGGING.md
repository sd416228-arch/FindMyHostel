# FindMy Hostel - Testing, Debugging & Deployment Guide

## TESTING

### Unit Tests for Booking Logic

Create `bookings/tests.py`:

```python
from django.test import TestCase
from django.utils import timezone
from django.contrib.auth import get_user_model
from datetime import timedelta
from hostels.models import Hostel, Room
from bookings.models import Booking

User = get_user_model()

class BookingAvailabilityTests(TestCase):
    """Test cases for booking availability and double-booking prevention"""
    
    def setUp(self):
        """Set up test data"""
        self.owner = User.objects.create_user(
            email='owner@test.com',
            username='owner',
            password='testpass123',
            role='owner'
        )
        
        self.guest = User.objects.create_user(
            email='guest@test.com',
            username='guest',
            password='testpass123',
            role='student'
        )
        
        self.hostel = Hostel.objects.create(
            owner=self.owner,
            name='Test Hostel',
            description='A test hostel',
            location='123 Main St',
            city='TestCity',
            country='TestCountry',
            phone='1234567890',
            email='hostel@test.com',
            base_price=50.00
        )
        
        self.room = Room.objects.create(
            hostel=self.hostel,
            room_number='101',
            room_type='dorm',
            capacity=4,
            price_per_night=25.00
        )
    
    def test_booking_availability_no_conflicts(self):
        """Test that room is available when no bookings exist"""
        check_in = timezone.now().date() + timedelta(days=5)
        check_out = check_in + timedelta(days=3)
        
        available = Booking.check_availability(self.room, check_in, check_out)
        self.assertTrue(available)
    
    def test_booking_availability_with_conflict(self):
        """Test double-booking prevention"""
        # Create first booking
        check_in1 = timezone.now().date() + timedelta(days=5)
        check_out1 = check_in1 + timedelta(days=3)
        
        Booking.objects.create(
            guest=self.guest,
            room=self.room,
            check_in_date=check_in1,
            check_out_date=check_out1,
            number_of_guests=2,
            price_per_night=25.00,
            total_nights=3,
            total_price=75.00,
            guest_name='Guest 1',
            guest_email='guest1@test.com',
            guest_phone='1111111111',
            status='confirmed'
        )
        
        # Try to book overlapping dates
        check_in2 = check_in1 + timedelta(days=1)
        check_out2 = check_out1 + timedelta(days=1)
        
        available = Booking.check_availability(self.room, check_in2, check_out2)
        self.assertFalse(available)
    
    def test_booking_availability_after_checkout(self):
        """Test that room is available after checkout date"""
        # Create first booking
        check_in1 = timezone.now().date() + timedelta(days=5)
        check_out1 = check_in1 + timedelta(days=3)
        
        Booking.objects.create(
            guest=self.guest,
            room=self.room,
            check_in_date=check_in1,
            check_out_date=check_out1,
            number_of_guests=2,
            price_per_night=25.00,
            total_nights=3,
            total_price=75.00,
            guest_name='Guest 1',
            guest_email='guest1@test.com',
            guest_phone='1111111111',
            status='confirmed'
        )
        
        # Book after checkout
        check_in2 = check_out1 + timedelta(days=1)
        check_out2 = check_in2 + timedelta(days=2)
        
        available = Booking.check_availability(self.room, check_in2, check_out2)
        self.assertTrue(available)
    
    def test_total_price_calculation(self):
        """Test booking price calculation"""
        check_in = timezone.now().date()
        check_out = check_in + timedelta(days=5)
        
        total_price, nights = Booking.calculate_total_price(25.00, check_in, check_out)
        
        self.assertEqual(nights, 5)
        self.assertEqual(total_price, 125.00)
    
    def test_invalid_checkout_date(self):
        """Test that checkout before checkin raises error"""
        check_in = timezone.now().date() + timedelta(days=5)
        check_out = check_in - timedelta(days=1)
        
        with self.assertRaises(ValueError):
            Booking.calculate_total_price(25.00, check_in, check_out)

class BookingModelTests(TestCase):
    """Test booking model methods"""
    
    def setUp(self):
        self.guest = User.objects.create_user(
            email='guest@test.com',
            username='guest',
            password='testpass123'
        )
        
        self.owner = User.objects.create_user(
            email='owner@test.com',
            username='owner',
            password='testpass123',
            role='owner'
        )
        
        self.hostel = Hostel.objects.create(
            owner=self.owner,
            name='Test Hostel',
            location='123 Main St',
            city='TestCity',
            country='TestCountry',
            phone='1234567890',
            email='hostel@test.com'
        )
        
        self.room = Room.objects.create(
            hostel=self.hostel,
            room_number='101',
            room_type='dorm',
            capacity=4,
            price_per_night=25.00
        )
    
    def test_booking_is_active(self):
        """Test is_active method"""
        booking = Booking.objects.create(
            guest=self.guest,
            room=self.room,
            check_in_date=timezone.now().date() + timedelta(days=1),
            check_out_date=timezone.now().date() + timedelta(days=3),
            number_of_guests=2,
            price_per_night=25.00,
            total_nights=2,
            total_price=50.00,
            guest_name='Test Guest',
            guest_email='guest@test.com',
            guest_phone='1234567890',
            status='confirmed'
        )
        
        self.assertTrue(booking.is_active())
    
    def test_booking_str_representation(self):
        """Test booking string representation"""
        booking = Booking.objects.create(
            guest=self.guest,
            room=self.room,
            check_in_date=timezone.now().date() + timedelta(days=1),
            check_out_date=timezone.now().date() + timedelta(days=3),
            number_of_guests=2,
            price_per_night=25.00,
            total_nights=2,
            total_price=50.00,
            guest_name='Test Guest',
            guest_email='guest@test.com',
            guest_phone='1234567890'
        )
        
        self.assertEqual(str(booking), f"Booking {booking.id} - guest@test.com")
```

### Running Tests

```bash
# Run all tests
python manage.py test

# Run specific test class
python manage.py test bookings.tests.BookingAvailabilityTests

# Run with verbose output
python manage.py test --verbosity=2
```

---

## DEBUGGING TIPS

### 1. Common Issues & Solutions

#### Issue: CSRF Token Missing in AJAX Requests
```javascript
// Solution: Get CSRF token from cookie
const csrftoken = document.cookie.split(';')
    .find(c => c.trim().startsWith('csrftoken='))
    ?.split('=')[1];

// Use in fetch request
fetch('/api/endpoint/', {
    method: 'POST',
    headers: {'X-CSRFToken': csrftoken}
});
```

#### Issue: SQLite Date Comparison Not Working
```python
# WRONG: Don't use datetime objects with date fields
bookings = Booking.objects.filter(check_in_date=datetime.now())

# CORRECT: Use date objects
from django.utils import timezone
bookings = Booking.objects.filter(check_in_date=timezone.now().date())

# Or use __gte, __lte for ranges
bookings = Booking.objects.filter(
    check_in_date__gte=timezone.now().date(),
    check_in_date__lte=timezone.now().date() + timedelta(days=7)
)
```

#### Issue: Images Not Displaying
```python
# Ensure settings.py has media configuration
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Add to urls.py
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, 
                         document_root=settings.MEDIA_ROOT)
```

#### Issue: Migrations Error
```bash
# Solution: Delete problematic migrations and recreate
python manage.py showmigrations
python manage.py migrate bookings zero  # Rollback app
python manage.py migrate hostels zero
python manage.py migrate accounts zero

# Delete migration files except __init__.py
# Then recreate
python manage.py makemigrations
python manage.py migrate
```

### 2. Query Debugging

```python
# Enable SQL logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}

# Use django.db.connection to see queries
from django.db import connection
print(connection.queries)
```

### 3. Performance Tips

```python
# Use select_related for ForeignKey relationships
bookings = Booking.objects.select_related('guest', 'room__hostel').all()

# Use prefetch_related for reverse relationships
hostels = Hostel.objects.prefetch_related('rooms', 'bookings').all()

# Use only() and defer() to limit fields
hostels = Hostel.objects.only('id', 'name', 'city')

# Use exists() instead of count()
if Booking.objects.filter(room=room).exists():
    print("Room has bookings")
```

### 4. Enable Logging for Booking Conflicts

Create `bookings/logging_config.py`:

```python
import logging

logger = logging.getLogger('bookings')

def log_booking_conflict(room_id, check_in, check_out):
    """Log booking conflicts"""
    logger.warning(
        f"Booking conflict detected for room {room_id} "
        f"from {check_in} to {check_out}"
    )

def log_booking_created(booking_id, guest_email):
    """Log successful booking"""
    logger.info(f"Booking #{booking_id} created for {guest_email}")
```

Add to settings.py:
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'bookings_file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'logs/bookings.log',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'bookings': {
            'handlers': ['bookings_file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
```

---

## GIT BRANCH STRATEGY

### Branch Naming Convention
```
main               # Production ready
dev                # Development branch
feature/auth       # Feature branches
feature/booking
feature/ui
bugfix/csrf-issue
```

### Branch Commands

```bash
# Create and switch to new branch
git checkout -b feature/auth

# Push to remote
git push origin feature/auth

# Create Pull Request from GitHub CLI
gh pr create --base dev --head feature/auth

# Merge to dev
git checkout dev
git merge feature/auth

# Delete branch after merge
git branch -d feature/auth
git push origin --delete feature/auth
```

---

## DEPLOYMENT CHECKLIST

- [ ] Set DEBUG = False in settings.py
- [ ] Update ALLOWED_HOSTS with production domain
- [ ] Update SECRET_KEY with strong key
- [ ] Set up proper database (PostgreSQL recommended)
- [ ] Configure email backend
- [ ] Set up static files collection: `python manage.py collectstatic`
- [ ] Run tests: `python manage.py test`
- [ ] Run migrations: `python manage.py migrate`
- [ ] Set up HTTPS/SSL
- [ ] Configure CORS if needed
- [ ] Set up backups for database
- [ ] Configure logging to files
- [ ] Set up monitoring/alerting

---
