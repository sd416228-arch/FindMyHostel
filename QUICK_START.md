# 🚀 FindMy Hostel - Quick Start Guide (5 Minutes)

## ⚡ Start the Server (Already Running!)

Server is running at: **http://localhost:8000**

If you need to restart:
```bash
cd "d:\FindMy Hostel"
python manage.py runserver
```

---

## 🎯 First Steps

### 1. Access Admin Panel
```
URL: http://localhost:8000/admin/
```
Create a superuser first:
```bash
python manage.py createsuperuser
# Enter: email, password
```

### 2. Create Test Data

**Option A: Via Admin Panel**
1. Go to /admin/
2. Login with superuser credentials
3. Click "Users" → "Add User"
4. Create test accounts:
   - Student: email=student@test.com, role=student
   - Owner: email=owner@test.com, role=owner

**Option B: Via Shell (Advanced)**
```bash
python manage.py shell
>>> from accounts.models import CustomUser
>>> 
>>> # Create student
>>> student = CustomUser.objects.create_user(
...     email='student@test.com',
...     username='student',
...     password='testpass123',
...     role='student'
... )
>>>
>>> # Create owner
>>> owner = CustomUser.objects.create_user(
...     email='owner@test.com',
...     username='owner',
...     password='testpass123',
...     role='owner'
... )
>>>
>>> # Create a hostel
>>> from hostels.models import Hostel
>>> hostel = Hostel.objects.create(
...     owner=owner,
...     name='Test Hostel',
...     description='A test hostel',
...     location='123 Main St',
...     city='New York',
...     country='USA',
...     phone='1234567890',
...     email='hostel@test.com',
...     base_price=50.00
... )
>>>
>>> # Create a room
>>> from hostels.models import Room
>>> room = Room.objects.create(
...     hostel=hostel,
...     room_number='101',
...     room_type='dorm',
...     capacity=4,
...     price_per_night=25.00
... )
>>> exit()
```

---

## 🧪 Test the Application

### User Flows to Test

**1. Student Registration & Booking**
```
1. Go to http://localhost:8000/accounts/register/
2. Register with:
   - Email: teststudent@example.com
   - Username: teststudent
   - Role: Student
   - Password: TestPass123
3. Login at http://localhost:8000/accounts/login/
4. Go to http://localhost:8000/hostels/
5. Click on a hostel
6. Click "Book Now" and fill in dates
7. Submit booking
8. Check http://localhost:8000/bookings/ to see your booking
```

**2. Hostel Owner Flow**
```
1. Register as hostel owner
   - Role: Hostel Owner
2. Login
3. Go to http://localhost:8000/hostels/dashboard/
4. Click "Add New Hostel"
5. Fill in details:
   - Name: My Test Hostel
   - City: TestCity
   - Price: 50
   - Add amenities (WiFi, etc.)
6. Create hostel
7. Click "Add Room"
8. Create room:
   - Room Number: 101
   - Type: Dorm
   - Capacity: 4
   - Price: 25.00
9. Go back to dashboard - see your hostel
```

**3. Admin Functions**
```
1. Go to http://localhost:8000/admin/
2. View Users, Hostels, Rooms, Bookings
3. Can edit/delete any object
```

---

## 📊 View Database

### SQLite Browser
```bash
# Use this to explore the database
sqlite3 db.sqlite3
sqlite> .tables
sqlite> SELECT * FROM accounts_customuser;
sqlite> SELECT * FROM hostels_hostel;
sqlite> SELECT * FROM bookings_booking;
sqlite> .exit
```

Or use a GUI tool:
- **DB Browser for SQLite** (free) - https://sqlitebrowser.org/
- **SQLiteStudio** (free) - https://sqlitestudio.pl/

---

## 🔍 Check API Endpoints

```bash
# Open in browser or use curl

# Search hostels
curl http://localhost:8000/hostels/api/search/?city=NewYork

# Get hostel detail
curl http://localhost:8000/hostels/api/1/

# Check availability (requires auth)
curl -X POST http://localhost:8000/hostels/api/check-availability/ \
  -H "X-CSRFToken: TOKEN" \
  -d "room_id=1&check_in=2024-06-15&check_out=2024-06-18"
```

---

## 🐛 Common Issues & Fixes

### Issue: Port 8000 Already in Use
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process (Windows)
taskkill /PID <PID> /F

# Or use different port
python manage.py runserver 8001
```

### Issue: Database Locked
```bash
# Delete and recreate database
rm db.sqlite3
python manage.py migrate
```

### Issue: Images Not Loading
```bash
# Make sure MEDIA_URL is set in settings.py
# Restart server
python manage.py runserver
```

### Issue: Static Files Missing
```bash
python manage.py collectstatic --noinput
```

---

## 📱 Responsive Design Testing

**Test on Different Screen Sizes:**

### Mobile (DevTools → iPhone 12)
```
http://localhost:8000/
- Navbar should collapse to hamburger
- Cards should stack vertically
- Forms should fit screen
```

### Tablet (DevTools → iPad)
```
- Sidebar should be visible
- Two-column layout
```

### Desktop (Full screen)
```
- Three-column layout
- All features visible
```

---

## ✅ Quality Assurance Checklist

### Quick 10-Minute QA Test

```
[ ] Homepage loads without errors
    http://localhost:8000/

[ ] Can register new user
    http://localhost:8000/accounts/register/

[ ] Can login with credentials
    http://localhost:8000/accounts/login/

[ ] Hostel list displays
    http://localhost:8000/hostels/

[ ] Can view hostel detail
    http://localhost:8000/hostels/1/

[ ] Booking modal opens and closes
    - Click "Book Now" on hostel detail

[ ] User dashboard shows info
    http://localhost:8000/accounts/profile/

[ ] Admin panel accessible
    http://localhost:8000/admin/

[ ] No JavaScript errors in console
    - Open DevTools (F12) → Console tab
    - Should show: "✅ FindMy Hostel JavaScript loaded"

[ ] Responsive on mobile (F12 → Toggle device)
    - Navbar collapses
    - Content readable
```

---

## 📞 Key URLs

| URL | Purpose |
|-----|---------|
| http://localhost:8000/ | Home page |
| http://localhost:8000/admin/ | Admin panel |
| http://localhost:8000/accounts/register/ | Registration |
| http://localhost:8000/accounts/login/ | Login |
| http://localhost:8000/accounts/profile/ | User profile |
| http://localhost:8000/hostels/ | Browse hostels |
| http://localhost:8000/hostels/dashboard/ | Owner dashboard |
| http://localhost:8000/bookings/ | My bookings |
| http://localhost:8000/hostels/api/search/ | Search API |

---

## 🎨 Customize Colors

Edit `templates/base.html`:
```css
:root {
    --primary-color: #6366f1;      /* Change this */
    --secondary-color: #ec4899;    /* Or this */
}
```

---

## 📚 Full Documentation Files

```
d:\FindMy Hostel\
├── README.md                  ← Main documentation
├── PROJECT_GUIDE.md           ← Complete guide
├── TESTING_AND_DEBUGGING.md   ← Testing guide
├── TASK_CHECKLIST.md          ← Your to-do list
└── QUICK_START.md             ← This file
```

---

## ⚙️ Next Steps

1. **Create test data** (follow the shell commands above)
2. **Test all user flows** (registration, booking, management)
3. **Run the test suite**:
   ```bash
   python manage.py test
   ```
4. **Review admin panel** and create content
5. **Test on mobile** using DevTools
6. **Check documentation** for detailed guides

---

## 💡 Pro Tips

### Tip 1: View Database in Real-Time
Open two terminals:
1. Terminal 1: `python manage.py runserver`
2. Terminal 2: `sqlite3 db.sqlite3` → Browse tables

### Tip 2: Test Availability Logic
```bash
python manage.py shell
>>> from bookings.models import Booking
>>> from hostels.models import Room
>>> room = Room.objects.first()
>>> 
>>> from datetime import date
>>> check_in = date(2024, 6, 15)
>>> check_out = date(2024, 6, 18)
>>> 
>>> available = Booking.check_availability(room, check_in, check_out)
>>> print(f"Available: {available}")
```

### Tip 3: Create Bulk Test Data
```bash
python manage.py shell < load_test_data.py
```

### Tip 4: Debug Queries
Add to settings.py:
```python
LOGGING = {
    'loggers': {
        'django.db.backends': {
            'level': 'DEBUG',
        },
    },
}
```

---

## 🎉 You're All Set!

Your FindMy Hostel application is fully functional with:
- ✅ User authentication
- ✅ Hostel management
- ✅ Booking system
- ✅ Double-booking prevention
- ✅ AJAX functionality
- ✅ Admin interface
- ✅ APIs

**Start testing now!** 🚀

Questions? Check:
- README.md for overview
- PROJECT_GUIDE.md for detailed docs
- TESTING_AND_DEBUGGING.md for test cases

---

**Happy booking! 🏨**
