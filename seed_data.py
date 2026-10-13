import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from accounts.models import CustomUser
from hostels.models import Hostel, Room, Review, Testimonial, HostelImage
from bookings.models import Booking
from datetime import date, timedelta
from django.core.files import File

def seed():
    print("Seeding initial FindMyHostel data...")

    # 1. Create or get Admin
    admin_user, _ = CustomUser.objects.get_or_create(
        email="admin@findmyhostel.com",
        defaults={
            "username": "admin",
            "role": "admin",
            "is_staff": True,
            "is_superuser": True,
            "is_verified": True,
            "phone": "9841234567",
        }
    )
    admin_user.set_password("Admin@12345")
    admin_user.save()

    # 2. Create Hostel Owners
    owner1, _ = CustomUser.objects.get_or_create(
        email="owner.kirtipur@findmyhostel.com",
        defaults={
            "username": "ramesh_adhikari",
            "role": "owner",
            "is_verified": True,
            "phone": "9851098765",
        }
    )
    owner1.set_password("Owner@12345")
    owner1.save()

    owner2, _ = CustomUser.objects.get_or_create(
        email="owner.baneshwor@findmyhostel.com",
        defaults={
            "username": "sunita_shrestha",
            "role": "owner",
            "is_verified": True,
            "phone": "9841987654",
        }
    )
    owner2.set_password("Owner@12345")
    owner2.save()

    # 3. Create Student Users
    student1, _ = CustomUser.objects.get_or_create(
        email="student.aarav@gmail.com",
        defaults={
            "username": "aarav_sharma",
            "role": "student",
            "is_verified": True,
            "phone": "9860123456",
        }
    )
    student1.set_password("Student@12345")
    student1.save()

    student2, _ = CustomUser.objects.get_or_create(
        email="student.priya@gmail.com",
        defaults={
            "username": "priya_thapa",
            "role": "student",
            "is_verified": True,
            "phone": "9812345678",
        }
    )
    student2.set_password("Student@12345")
    student2.save()

    # Image filenames
    img_hero = "hero_nepal_hostel_1791902363505.jpg"
    img_dorm = "hostel_dorm_room_1791902365623.jpg"
    img_private = "hostel_private_room_1791902365637.jpg"

    hostels_data = [
        {
            "name": "Kirtipur Scholar Student Residence",
            "owner": owner1,
            "description": "Quiet, study-oriented premium student residence situated right near Tribhuvan University campus. Features high-speed fiber internet, wholesome Nepali home-cooked meals 3 times a day, inverter power backup, and quiet study rooms.",
            "location": "Naya Bazaar, Kirtipur Gate",
            "city": "Kathmandu",
            "country": "Nepal",
            "phone": "9851098765",
            "email": "kirtipur.scholar@gmail.com",
            "website": "https://findmyhostel.com",
            "monthly_rent": 9500,
            "rating": 4.9,
            "reviews_count": 28,
            "wifi": True,
            "parking": True,
            "laundry": True,
            "kitchen": True,
            "gym": False,
            "cover_img": img_hero,
            "rooms": [
                {"number": "101", "type": "single", "capacity": 1, "rent": 12500, "ac": False, "bath": True, "tv": False, "balcony": True, "img": img_private},
                {"number": "102", "type": "double", "capacity": 2, "rent": 9500, "ac": False, "bath": True, "tv": False, "balcony": False, "img": img_hero},
                {"number": "201", "type": "dormitory", "capacity": 4, "rent": 7500, "ac": False, "bath": False, "tv": False, "balcony": False, "img": img_dorm},
            ]
        },
        {
            "name": "Baneshwor Central Youth Living",
            "owner": owner2,
            "description": "Located in the heart of New Baneshwor, walking distance from Apex College, Ace, and major TU institutes. Designed for ambitious students with modern wooden bunk cubicles, 24/7 security, rooftop cafeteria, and gym facility.",
            "location": "Shankhamul Road, New Baneshwor",
            "city": "Kathmandu",
            "country": "Nepal",
            "phone": "9841987654",
            "email": "baneshwor.central@gmail.com",
            "website": "https://findmyhostel.com",
            "monthly_rent": 11000,
            "rating": 4.8,
            "reviews_count": 42,
            "wifi": True,
            "parking": True,
            "laundry": True,
            "kitchen": True,
            "gym": True,
            "cover_img": img_dorm,
            "rooms": [
                {"number": "A1", "type": "single", "capacity": 1, "rent": 14000, "ac": True, "bath": True, "tv": True, "balcony": True, "img": img_private},
                {"number": "A2", "type": "double", "capacity": 2, "rent": 11000, "ac": True, "bath": True, "tv": False, "balcony": True, "img": img_hero},
                {"number": "B1", "type": "dormitory", "capacity": 4, "rent": 8500, "ac": False, "bath": True, "tv": False, "balcony": False, "img": img_dorm},
            ]
        },
        {
            "name": "Pulchowk Tech Hub & Hostel",
            "owner": owner1,
            "description": "The premier hostel choice for engineering and IT students in Lalitpur. High-speed dual fiber connections, collaborative study tables with power strips, clean hot showers, and healthy hygienic meals.",
            "location": "Near Pulchowk Engineering Campus, Patan",
            "city": "Lalitpur",
            "country": "Nepal",
            "phone": "9801239876",
            "email": "pulchowk.hostel@gmail.com",
            "website": "https://findmyhostel.com",
            "monthly_rent": 10500,
            "rating": 4.9,
            "reviews_count": 35,
            "wifi": True,
            "parking": True,
            "laundry": True,
            "kitchen": True,
            "gym": True,
            "cover_img": img_private,
            "rooms": [
                {"number": "P1", "type": "single", "capacity": 1, "rent": 13500, "ac": False, "bath": True, "tv": False, "balcony": True, "img": img_private},
                {"number": "P2", "type": "double", "capacity": 2, "rent": 10500, "ac": False, "bath": True, "tv": False, "balcony": False, "img": img_hero},
            ]
        },
        {
            "name": "Pokhara Lakeside Student Villa",
            "owner": owner2,
            "description": "Peaceful lakeside student home offering clean scenic accommodation, panoramic mountain views, warm family hospitality, and peaceful study ambience near Prithvi Narayan Campus.",
            "location": "Lakeside, Ward 6",
            "city": "Pokhara",
            "country": "Nepal",
            "phone": "9866543210",
            "email": "pokhara.studentvilla@gmail.com",
            "website": "https://findmyhostel.com",
            "monthly_rent": 8500,
            "rating": 4.7,
            "reviews_count": 19,
            "wifi": True,
            "parking": True,
            "laundry": True,
            "kitchen": True,
            "gym": False,
            "cover_img": img_hero,
            "rooms": [
                {"number": "L1", "type": "single", "capacity": 1, "rent": 11500, "ac": False, "bath": True, "tv": False, "balcony": True, "img": img_private},
                {"number": "L2", "type": "double", "capacity": 2, "rent": 8500, "ac": False, "bath": False, "tv": False, "balcony": True, "img": img_dorm},
            ]
        },
        {
            "name": "Putalisadak Scholar Nest",
            "owner": owner1,
            "description": "Right in the educational core of Kathmandu, ideal for CA, medical entrance, and language exam preparation students. Soundproofed windows, hygienic canteen, and biometric entry.",
            "location": "Putalisadak, Opposite Star Mall",
            "city": "Kathmandu",
            "country": "Nepal",
            "phone": "9841122334",
            "email": "putalisadak.nest@gmail.com",
            "website": "https://findmyhostel.com",
            "monthly_rent": 10000,
            "rating": 4.8,
            "reviews_count": 22,
            "wifi": True,
            "parking": False,
            "laundry": True,
            "kitchen": True,
            "gym": False,
            "cover_img": img_dorm,
            "rooms": [
                {"number": "S1", "type": "single", "capacity": 1, "rent": 13000, "ac": True, "bath": True, "tv": False, "balcony": False, "img": img_private},
                {"number": "S2", "type": "double", "capacity": 2, "rent": 10000, "ac": False, "bath": True, "tv": False, "balcony": False, "img": img_hero},
            ]
        },
        {
            "name": "Kupondole Heritage Residence",
            "owner": owner2,
            "description": "Tranquil setting surrounded by greenery yet 5 minutes from Thapathali bridge. Features solar hot water, study library, organic kitchen garden, and high-speed mesh WiFi.",
            "location": "Kupondole Heights, Lalitpur",
            "city": "Lalitpur",
            "country": "Nepal",
            "phone": "9851234567",
            "email": "kupondole.heritage@gmail.com",
            "website": "https://findmyhostel.com",
            "monthly_rent": 11500,
            "rating": 4.9,
            "reviews_count": 31,
            "wifi": True,
            "parking": True,
            "laundry": True,
            "kitchen": True,
            "gym": True,
            "cover_img": img_hero,
            "rooms": [
                {"number": "K1", "type": "single", "capacity": 1, "rent": 14500, "ac": True, "bath": True, "tv": True, "balcony": True, "img": img_private},
                {"number": "K2", "type": "double", "capacity": 2, "rent": 11500, "ac": False, "bath": True, "tv": False, "balcony": True, "img": img_dorm},
            ]
        }
    ]

    for h_data in hostels_data:
        rooms_info = h_data.pop("rooms")
        cover_img_name = h_data.pop("cover_img")

        hostel, created = Hostel.objects.get_or_create(
            name=h_data["name"],
            defaults={**h_data, "is_active": True, "is_verified": True}
        )

        cover_path = os.path.join("media", "hostels", cover_img_name)
        if os.path.exists(cover_path) and not hostel.cover_image:
            with open(cover_path, 'rb') as f:
                hostel.cover_image.save(cover_img_name, File(f), save=True)

        for r_data in rooms_info:
            r_img_name = r_data.pop("img")
            room, _ = Room.objects.get_or_create(
                hostel=hostel,
                room_number=r_data["number"],
                defaults={
                    "room_type": r_data["type"],
                    "capacity": r_data["capacity"],
                    "monthly_rent": r_data["rent"],
                    "has_ac": r_data["ac"],
                    "has_bathroom": r_data["bath"],
                    "has_tv": r_data["tv"],
                    "has_balcony": r_data["balcony"],
                    "is_available": True
                }
            )
            r_img_path = os.path.join("media", "hostels", r_img_name)
            if os.path.exists(r_img_path) and not room.image:
                with open(r_img_path, 'rb') as f:
                    room.image.save(r_img_name, File(f), save=True)

    # 4. Create Testimonials
    testimonials_data = [
        {
            "user": student1,
            "role": "Engineering Student (TU)",
            "content": "Finding a hostel near Pulchowk Campus used to take 2 weeks of physical walking door-to-door. With FindMyHostel, I verified the room, confirmed food quality through reviews, and reserved in 5 minutes.",
            "rating": 5,
        },
        {
            "user": student2,
            "role": "Medical Student (IOM)",
            "content": "As a girl moving from Pokhara to Kathmandu for MBBS studies, safety and clean food were my top priorities. The verified badges and clear photos matched reality 100%.",
            "rating": 5,
        },
        {
            "user": owner1,
            "role": "Hostel Owner (Kirtipur)",
            "content": "Managing our 40 beds used to involve messy paper ledgers and random calls. Now student booking requests come directly to our portal with verified phone numbers.",
            "rating": 5,
        }
    ]

    for t in testimonials_data:
        Testimonial.objects.get_or_create(
            user=t["user"],
            role=t["role"],
            content=t["content"],
            defaults={"rating": t["rating"], "is_active": True}
        )

    # 5. Create a sample Booking for student1 so review and booking history are populated
    first_room = Room.objects.first()
    if first_room:
        Booking.objects.get_or_create(
            guest=student1,
            room=first_room,
            starting_date=date.today() - timedelta(days=5),
            defaults={
                "total_nights": 30,
                "number_of_guests": 1,
                "monthly_rent": first_room.monthly_rent,
                "total_price": first_room.monthly_rent,
                "status": "confirmed",
                "guest_name": "Aarav Sharma",
                "guest_email": student1.email,
                "guest_phone": "9860123456",
                "special_requests": "Quiet corner bed preferred for exam preparation."
            }
        )

    print("Seeding complete! Hostels:", Hostel.objects.count(), "Rooms:", Room.objects.count())

if __name__ == "__main__":
    seed()
