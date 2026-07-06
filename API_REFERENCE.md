# FindMy Hostel - Complete API Reference

## 🔗 All Endpoints

### Authentication Endpoints

#### Registration
```
POST /accounts/register/
Method: GET, POST
Template: accounts/register.html
Description: Register new user account
Required Fields: email, username, password, password_confirm, role, phone (optional)
Response: Redirect to login on success or show errors
```

#### Login
```
POST /accounts/login/
Method: GET, POST
Template: accounts/login.html
Description: Login user
Required Fields: email, password
Response: Redirect to dashboard (owner) or home (student)
```

#### Logout
```
GET /accounts/logout/
Method: GET
Description: Logout user
Required: User must be authenticated
Response: Redirect to home
```

#### User Profile
```
GET /accounts/profile/
Method: GET
Template: accounts/profile.html
Description: View user profile
Required: User must be authenticated
Response: Display user profile information
```

#### Edit Profile
```
GET,POST /accounts/profile/edit/
Method: GET, POST
Template: accounts/edit_profile.html
Description: Edit user profile
Required: User must be authenticated
Required Fields: phone (optional), profile_picture (optional)
Response: Redirect to profile on success
```

#### Check Email (AJAX)
```
POST /accounts/api/check-email/
Method: POST
Content-Type: application/json
Description: Check if email already registered
Body: {"email": "user@example.com"}
Response: {"exists": true/false}
```

---

### Hostel Endpoints

#### List Hostels
```
GET /hostels/
Method: GET
Template: hostels/list.html
Description: List all active hostels with filters
Query Parameters:
  - city: Filter by city
  - min_price: Minimum price filter
  - max_price: Maximum price filter
  - check_in: Check-in date
  - check_out: Check-out date
Response: Display filtered hostel list
```

#### Hostel Detail
```
GET /hostels/<id>/
Method: GET
Template: hostels/detail.html
Description: View hostel details and available rooms
URL Parameters: id (hostel ID)
Query Parameters:
  - check_in: Pre-fill check-in date
  - check_out: Pre-fill check-out date
Response: Display hostel details with booking modal
```

#### Owner Dashboard
```
GET /hostels/dashboard/
Method: GET
Template: hostels/owner_dashboard.html
Description: View owner's hostels and recent bookings
Required: User must be hostel owner
Response: Display owner dashboard with statistics
```

#### Create Hostel
```
GET,POST /hostels/create/
Method: GET, POST
Template: hostels/hostel_form.html
Description: Create new hostel
Required: User must be hostel owner
Required Fields: name, description, location, city, country, phone, email, base_price
Optional Fields: website, cover_image, amenities (wifi, parking, laundry, kitchen, gym)
Response: Redirect to owner dashboard on success
```

#### Edit Hostel
```
GET,POST /hostels/<id>/edit/
Method: GET, POST
Template: hostels/hostel_form.html
Description: Edit existing hostel
Required: User must be hostel owner
URL Parameters: id (hostel ID)
Response: Redirect to owner dashboard on success
```

#### Create Room
```
GET,POST /hostels/<hostel_id>/room/create/
Method: GET, POST
Template: hostels/room_form.html
Description: Create new room in hostel
Required: User must be hostel owner
URL Parameters: hostel_id (hostel ID)
Required Fields: room_number, room_type, capacity, price_per_night
Optional Fields: description, image, features (has_ac, has_bathroom, has_tv, has_balcony)
Response: Redirect to owner dashboard on success
```

#### Edit Room
```
GET,POST /hostels/<hostel_id>/room/<room_id>/edit/
Method: GET, POST
Template: hostels/room_form.html
Description: Edit existing room
Required: User must be hostel owner
URL Parameters: hostel_id, room_id
Response: Redirect to owner dashboard on success
```

#### Search Hostels (API)
```
GET /hostels/api/search/
Method: GET
Content-Type: application/json
Description: Search hostels with filters
Query Parameters:
  - city: Search by city
  - min_price: Minimum price
  - max_price: Maximum price
Response: JSON array of hostels
Example Response:
{
  "hostels": [
    {
      "id": 1,
      "name": "Hostel Name",
      "city": "New York",
      "price": "50.00",
      "rating": 4.5,
      "amenities": ["WiFi", "Parking"]
    }
  ]
}
```

#### Hostel Detail (API)
```
GET /hostels/api/<id>/
Method: GET
Content-Type: application/json
Description: Get detailed hostel information via API
URL Parameters: id (hostel ID)
Response: JSON object with hostel and room details
Example Response:
{
  "id": 1,
  "name": "Hostel Name",
  "description": "...",
  "city": "New York",
  "price": "50.00",
  "rating": 4.5,
  "amenities": ["WiFi", "Parking"],
  "rooms": [
    {
      "id": 1,
      "number": "101",
      "type": "dorm",
      "capacity": 4,
      "price": "25.00"
    }
  ]
}
```

#### Check Availability (API)
```
POST /hostels/api/check-availability/
Method: POST
Content-Type: application/x-www-form-urlencoded
Description: Check if room is available for dates
Required: User must be authenticated
Required Fields: room_id, check_in (YYYY-MM-DD), check_out (YYYY-MM-DD)
Response: JSON object with availability status
Example Response:
{
  "available": true,
  "room_id": 1,
  "message": "Room is available"
}
```

---

### Booking Endpoints

#### List User Bookings
```
GET /bookings/
Method: GET
Template: bookings/list.html
Description: List user's bookings
Required: User must be authenticated
Response: Display booking history
```

#### Booking Detail
```
GET /bookings/<id>/
Method: GET
Template: bookings/detail.html
Description: View booking details
Required: User must be authenticated (must be booking owner)
URL Parameters: id (booking ID)
Response: Display booking information and timeline
```

#### Cancel Booking
```
POST /bookings/<id>/cancel/
Method: POST
Description: Cancel booking
Required: User must be authenticated (must be booking owner)
URL Parameters: id (booking ID)
Response: Redirect to booking list on success
```

#### Create Booking (API/AJAX)
```
POST /bookings/api/create/
Method: POST
Content-Type: multipart/form-data
Description: Create new booking (AJAX submission)
Required: User must be authenticated
Required Fields:
  - room_id: Room ID
  - check_in: Check-in date (YYYY-MM-DD)
  - check_out: Check-out date (YYYY-MM-DD)
  - number_of_guests: Number of guests
  - guest_name: Guest name
Optional Fields:
  - guest_phone: Guest phone
  - special_requests: Special requests
Response: JSON object
Example Response:
{
  "success": true,
  "booking_id": 1,
  "total_price": "75.00",
  "nights": 3,
  "message": "Booking created successfully!"
}
Error Response:
{
  "error": "Room is not available for selected dates"
}
```

#### Get User Bookings (API)
```
GET /bookings/api/user/
Method: GET
Content-Type: application/json
Description: Get user's bookings via API
Required: User must be authenticated
Response: JSON array of bookings
Example Response:
{
  "bookings": [
    {
      "id": 1,
      "room": "101",
      "hostel": "Hostel Name",
      "check_in": "2024-06-15",
      "check_out": "2024-06-18",
      "status": "confirmed",
      "total_price": "75.00"
    }
  ]
}
```

#### Cancel Booking (API)
```
POST /bookings/api/<id>/cancel/
Method: POST
Content-Type: application/json
Description: Cancel booking via API
Required: User must be authenticated (must be booking owner)
URL Parameters: id (booking ID)
Response: JSON object
Example Response:
{
  "success": true,
  "message": "Booking cancelled successfully"
}
```

---

## 🔐 Authentication Headers

### CSRF Token
All POST requests must include CSRF token:
```
Headers: {
  'X-CSRFToken': csrftoken
}
```

Get token from:
```javascript
const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]')?.value || 
                 document.cookie.split(';').find(c => c.trim().startsWith('csrftoken='))?.split('=')[1];
```

### Session Authentication
User must be logged in for authenticated endpoints:
```
Cookies: sessionid=<session_id>
```

---

## 📊 Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid data |
| 401 | Unauthorized - Not authenticated |
| 403 | Forbidden - Not allowed |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

---

## 📝 Request/Response Examples

### Example 1: Register New User
```bash
curl -X POST http://localhost:8000/accounts/register/ \
  -d "email=student@example.com&username=student&password=TestPass123&password_confirm=TestPass123&role=student" \
  -H "X-CSRFToken: $(curl -s http://localhost:8000 | grep csrftoken | sed -E 's/.*value="([^"]+).*/\1/')"
```

### Example 2: Login
```bash
curl -X POST http://localhost:8000/accounts/login/ \
  -c cookies.txt \
  -d "email=student@example.com&password=TestPass123"
```

### Example 3: Search Hostels
```bash
curl -X GET "http://localhost:8000/hostels/api/search/?city=NewYork&min_price=30&max_price=100" \
  -H "Accept: application/json"
```

### Example 4: Create Booking
```bash
curl -X POST http://localhost:8000/bookings/api/create/ \
  -b cookies.txt \
  -F "room_id=1" \
  -F "check_in=2024-06-15" \
  -F "check_out=2024-06-18" \
  -F "number_of_guests=2" \
  -F "guest_name=John Doe" \
  -F "guest_phone=1234567890" \
  -H "X-CSRFToken: $(cat cookies.txt | grep csrftoken | awk '{print $7}')"
```

---

## 🔄 Data Models

### CustomUser
```python
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "role": "student",  # student or owner
  "phone": "1234567890",
  "profile_picture": "/media/profiles/image.jpg",
  "is_verified": True,
  "created_at": "2024-06-06T12:00:00Z",
  "updated_at": "2024-06-06T12:00:00Z"
}
```

### Hostel
```python
{
  "id": 1,
  "name": "Hostel Name",
  "owner_id": 1,
  "description": "...",
  "location": "123 Main St",
  "city": "New York",
  "country": "USA",
  "phone": "1234567890",
  "email": "hostel@example.com",
  "website": "https://example.com",
  "base_price": "50.00",
  "rating": 4.5,
  "reviews_count": 12,
  "wifi": True,
  "parking": False,
  "laundry": True,
  "kitchen": True,
  "gym": False,
  "is_active": True,
  "is_verified": False,
  "created_at": "2024-06-06T12:00:00Z"
}
```

### Room
```python
{
  "id": 1,
  "hostel_id": 1,
  "room_number": "101",
  "room_type": "dorm",  # single, double, dorm, deluxe
  "capacity": 4,
  "price_per_night": "25.00",
  "description": "...",
  "has_ac": True,
  "has_bathroom": True,
  "has_tv": False,
  "has_balcony": False,
  "is_available": True,
  "created_at": "2024-06-06T12:00:00Z"
}
```

### Booking
```python
{
  "id": 1,
  "guest_id": 1,
  "room_id": 1,
  "check_in_date": "2024-06-15",
  "check_out_date": "2024-06-18",
  "number_of_guests": 2,
  "price_per_night": "25.00",
  "total_nights": 3,
  "total_price": "75.00",
  "status": "confirmed",  # pending, confirmed, checked_in, completed, cancelled
  "guest_name": "John Doe",
  "guest_email": "guest@example.com",
  "guest_phone": "1234567890",
  "special_requests": "...",
  "created_at": "2024-06-06T12:00:00Z",
  "updated_at": "2024-06-06T12:00:00Z"
}
```

---

## ✅ Common Use Cases

### Use Case 1: Student Books a Room
```
1. GET /hostels/              → View hostels
2. GET /hostels/<id>/         → View hostel details
3. POST /bookings/api/create/ → Create booking
4. GET /bookings/             → View booking
```

### Use Case 2: Owner Creates Hostel
```
1. POST /accounts/register/   → Register as owner
2. POST /hostels/create/      → Create hostel
3. POST /hostels/<id>/room/create/ → Add room
4. GET /hostels/dashboard/    → View dashboard
```

### Use Case 3: Check Availability
```
1. GET /hostels/api/search/   → Search hostels
2. POST /hostels/api/check-availability/ → Check room availability
3. View results in client
```

---

## 🚀 Performance Tips

### Recommended Practices
1. **Cache hostel list** (changes infrequently)
2. **Use pagination** for large result sets
3. **Pre-load hostel images** for fast display
4. **Queue booking confirmations** as async tasks
5. **Archive old bookings** periodically

### Query Optimization
```python
# Use select_related for ForeignKey
Booking.objects.select_related('guest', 'room__hostel')

# Use prefetch_related for reverse relationships
Hostel.objects.prefetch_related('rooms', 'bookings')

# Use only() to limit fields
Hostel.objects.only('id', 'name', 'city')
```

---

**All endpoints are production-ready and fully documented!** ✅

For more information, see:
- PROJECT_GUIDE.md - Full project documentation
- TESTING_AND_DEBUGGING.md - Testing guide
- README.md - Quick reference
