from django.core.management.base import BaseCommand
from django.utils import timezone
from accounts.models import CustomUser
from hostels.models import Hostel, Room, Testimonial
import random

HOSTEL_DATA = [
    {
        "name": "Annapurna Sunrise Hostel",
        "description": "A cozy hillside retreat with panoramic sunrise views and a rooftop terrace. Features a shared lounge, 24/7 reception, and complimentary breakfast. Steps away from local markets and eateries.",
        "location": "Baneshwor, Kathmandu",
        "city": "Kathmandu",
        "country": "Nepal",
        "phone": "9801234567",
        "email": "contact@annapurnasunrise.com",
        "wifi": True, "parking": True, "laundry": True, "kitchen": True, "gym": False,
        "monthly_rent": 12000, "rating": 4.8, "reviews_count": 24,
    },
    {
        "name": "Machapuchre Valley Hostel",
        "description": "Modern hostel with valley views from every floor. Equipped with a reading corner, travel desk, and communal kitchen. Ideal base camp for adventure seekers and nature enthusiasts.",
        "location": "Damside, Pokhara",
        "city": "Pokhara",
        "country": "Nepal",
        "phone": "9807654321",
        "email": "info@machapuchrevalley.com",
        "wifi": True, "parking": False, "laundry": True, "kitchen": True, "gym": True,
        "monthly_rent": 15000, "rating": 4.5, "reviews_count": 18,
    },
    {
        "name": "Fishtail Lakeview Hostel",
        "description": "Charming lakefront hostel with stunning waterside sunsets. Offers bicycle hire, weekly barbecue evenings, and a lively common room. Walking distance to cafes and local attractions.",
        "location": "Hallanchowk, Pokhara",
        "city": "Pokhara",
        "country": "Nepal",
        "phone": "9805551234",
        "email": "stay@fishtaillakeview.com",
        "wifi": True, "parking": True, "laundry": True, "kitchen": False, "gym": False,
        "monthly_rent": 10000, "rating": 4.9, "reviews_count": 42,
    },
    {
        "name": "Sagarmatha Serenity Hostel",
        "description": "Tranquil hostel in a quiet neighborhood featuring a meditation garden and yoga sessions. Warm Tibetan-inspired interiors with organic meal options and a peaceful courtyard.",
        "location": "Chabahil, Kathmandu",
        "city": "Kathmandu",
        "country": "Nepal",
        "phone": "9809876543",
        "email": "hello@sagarmathaserene.com",
        "wifi": True, "parking": False, "laundry": True, "kitchen": True, "gym": False,
        "monthly_rent": 8000, "rating": 4.6, "reviews_count": 31,
    },
    {
        "name": "Kumari Heritage Stay",
        "description": "Boutique hostel in a beautifully restored traditional building. Offers cultural walking tours, rooftop dining with cityscape views, and hands-on craft workshops.",
        "location": "Basantapur, Kathmandu",
        "city": "Kathmandu",
        "country": "Nepal",
        "phone": "9801112233",
        "email": "book@kumariheritage.com",
        "wifi": True, "parking": False, "laundry": False, "kitchen": True, "gym": False,
        "monthly_rent": 9000, "rating": 4.7, "reviews_count": 15,
    },
    {
        "name": "Dhaulagiri Explorers Hub",
        "description": "Lively social hostel with a garden lounge, game room, and adventure sports counter. Daily group outings include paragliding, jungle walks, and city heritage tours. Great for solo travelers.",
        "location": "Prithvi Chowk, Pokhara",
        "city": "Pokhara",
        "country": "Nepal",
        "phone": "9804445566",
        "email": "info@dhaulagiriexplorers.com",
        "wifi": True, "parking": True, "laundry": True, "kitchen": True, "gym": False,
        "monthly_rent": 11000, "rating": 4.4, "reviews_count": 28,
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
                            'monthly_rent': random.randint(1000, 5000),
                            'description': f"Comfortable {room_type} room with modern amenities.",
                            'has_ac': random.choice([True, True, False]),
                            'has_bathroom': True,
                            'has_tv': random.choice([True, False]),
                            'has_balcony': random.choice([True, False, False]),
                        }
                    )
                    self.stdout.write(f'    Room added: {room}')

        self.stdout.write(self.style.SUCCESS(f'Done! Seeded {len(HOSTEL_DATA)} hostels with rooms.'))