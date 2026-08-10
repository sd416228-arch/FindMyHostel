from django.core.management.base import BaseCommand
from django.utils import timezone
from accounts.models import CustomUser
from hostels.models import Hostel, Room, Testimonial
import random

HOSTEL_DATA = [
    {
        "name": "Himalayan Peace Hostel",
        "description": "A peaceful retreat in the heart of Kathmandu with stunning mountain views. Features a rooftop garden, common lounge, and 24/7 security. Walking distance to major temples and restaurants.",
        "location": "Thamel, Kathmandu",
        "city": "Kathmandu",
        "country": "Nepal",
        "phone": "9801234567",
        "email": "himalayanpeace@hostel.com",
        "wifi": True, "parking": True, "laundry": True, "kitchen": True, "gym": False,
        "base_price": 12000, "rating": 4.8, "reviews_count": 24,
        "cover": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80",
    },
    {
        "name": "Everest View Hostel",
        "description": "Wake up to panoramic mountain views from every room. Modern facilities with a cozy cafe, book exchange, and adventure tour desk. Perfect for trekkers and nature lovers.",
        "location": "Lakeside, Pokhara",
        "city": "Pokhara",
        "country": "Nepal",
        "phone": "9807654321",
        "email": "everestview@hostel.com",
        "wifi": True, "parking": False, "laundry": True, "kitchen": True, "gym": True,
        "base_price": 15000, "rating": 4.5, "reviews_count": 18,
        "cover": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    },
    {
        "name": "Lakeside Retreat Hostel",
        "description": "Located right by Phewa Lake with breathtaking sunset views. Offers bicycle rentals, lakeside BBQ nights, and a vibrant common area. Close to cafes and nightlife.",
        "location": "Lakeside, Pokhara",
        "city": "Pokhara",
        "country": "Nepal",
        "phone": "9805551234",
        "email": "lakeside@hostel.com",
        "wifi": True, "parking": True, "laundry": True, "kitchen": False, "gym": False,
        "base_price": 10000, "rating": 4.9, "reviews_count": 42,
        "cover": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80",
    },
    {
        "name": "Boudha Bliss Hostel",
        "description": "Serene hostel near the Boudhanath Stupa with meditation room and yoga classes. Peaceful atmosphere with a Tibetan-themed decor and organic vegetarian meals.",
        "location": "Boudha, Kathmandu",
        "city": "Kathmandu",
        "country": "Nepal",
        "phone": "9809876543",
        "email": "boudhabliss@hostel.com",
        "wifi": True, "parking": False, "laundry": True, "kitchen": True, "gym": False,
        "base_price": 8000, "rating": 4.6, "reviews_count": 31,
        "cover": "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=900&q=80",
    },
    {
        "name": "Durbar Square Stay",
        "description": "Heritage hostel in a restored Newari building near Kathmandu Durbar Square. Cultural tours, rooftop dining with temple views, and traditional art workshops.",
        "location": "Durbar Square, Kathmandu",
        "city": "Kathmandu",
        "country": "Nepal",
        "phone": "9801112233",
        "email": "durbarsquare@hostel.com",
        "wifi": True, "parking": False, "laundry": False, "kitchen": True, "gym": False,
        "base_price": 9000, "rating": 4.7, "reviews_count": 15,
        "cover": "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=900&q=80",
    },
    {
        "name": "Pokhara Backpackers Hub",
        "description": "Vibrant social hostel with pool, bar, and adventure sports booking. Daily group activities include paragliding, trekking, and city tours. Best for solo travelers.",
        "location": "Lakeside, Pokhara",
        "city": "Pokhara",
        "country": "Nepal",
        "phone": "9804445566",
        "email": "backpackersh@hostel.com",
        "wifi": True, "parking": True, "laundry": True, "kitchen": True, "gym": False,
        "base_price": 11000, "rating": 4.4, "reviews_count": 28,
        "cover": "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?format=fit&crop=w=900&q=80",
    },
]

ROOM_TYPES = ['single', 'double', 'dorm', 'deluxe']
ROOM_IMAGES = [
    "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1598928506311-c55ez637a11a?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
]


class Command(BaseCommand):
    help = 'Seed the database with sample hostels, rooms, and testimonials'

    def handle(self, *args, **options):
        owners = list(CustomUser.objects.filter(role='owner'))
        if not owners:
            self.stdout.write(self.style.ERROR('No owner users found. Create an owner first.'))
            return

        self.stdout.write('Seeding hostels...')
        for i, data in enumerate(HOSTEL_DATA):
            owner = owners[i % len(owners)]
            cover_url = data.pop('cover')
            hostel, created = Hostel.objects.get_or_create(
                name=data['name'],
                defaults={**data, 'owner': owner}
            )
            if created:
                self.stdout.write(f'  Created: {hostel.name}')
            else:
                self.stdout.write(f'  Skipped (exists): {hostel.name}')

            if created:
                for j in range(random.randint(2, 4)):
                    room_type = random.choice(ROOM_TYPES)
                    room, _ = Room.objects.get_or_create(
                        hostel=hostel,
                        room_number=f"{room_type[:4].upper()}-{101 + j}",
                        defaults={
                            'room_type': room_type,
                            'capacity': random.choice([1, 2, 4, 6]),
                            'price_per_night': random.randint(1000, 5000),
                            'description': f"Comfortable {room_type} room with modern amenities.",
                            'has_ac': random.choice([True, True, False]),
                            'has_bathroom': True,
                            'has_tv': random.choice([True, False]),
                            'has_balcony': random.choice([True, False, False]),
                        }
                    )
                    self.stdout.write(f'    Room added: {room}')

        self.stdout.write(self.style.SUCCESS(f'Done! Seeded {len(HOSTEL_DATA)} hostels with rooms.'))