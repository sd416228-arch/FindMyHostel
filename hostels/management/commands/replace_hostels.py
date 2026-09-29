"""
Management command to replace all real or generic hostel names in the database
with authentic, realistic-sounding Nepali dummy names, descriptions, locations,
and clear all cover photos and gallery images.
"""
from django.core.management.base import BaseCommand
from hostels.models import Hostel, HostelImage

# Mapping by ID (for existing database records)
HOSTEL_ID_REPLACEMENTS = {
    1: {
        'name': 'Annapurna Sunrise Boys & Girls Hostel',
        'location': 'New Baneshwor',
        'city': 'Kathmandu',
        'country': 'Nepal',
        'phone': '9841504206',
        'email': 'info@annapurnasunrise.edu.np',
        'description': 'Modern and well-equipped student accommodation situated in New Baneshwor, offering peaceful study spaces, high-speed WiFi, nutritious meals, power backup, and 24/7 security.',
        'website': '',
    },
    3: {
        'name': 'Bagmati Serene Student Haven',
        'location': 'Shankhamul',
        'city': 'Kathmandu',
        'country': 'Nepal',
        'phone': '9807654321',
        'email': 'contact@bagmatihaven.com',
        'description': 'Comfortable and affordable living near Shankhamul with clean furnished rooms, dedicated study hall, hot water facilities, and a supportive community environment for college students.',
        'website': '',
    },
    4: {
        'name': 'Phewa Lakeview Youth Hostel',
        'location': 'Lakeside',
        'city': 'Pokhara',
        'country': 'Nepal',
        'phone': '9805551234',
        'email': 'stay@phewalakeview.com',
        'description': 'Scenic student and traveler hostel located near Phewa Lake in Pokhara, featuring bright ventilated rooms, quiet reading area, laundry facilities, and mountain views.',
        'website': '',
    },
    5: {
        'name': 'Boudhanath Peace Residence',
        'location': 'Boudha',
        'city': 'Kathmandu',
        'country': 'Nepal',
        'phone': '9809876543',
        'email': 'peace@boudharesidence.com',
        'description': 'Tranquil and secure accommodation near the historic Boudha Stupa, offering spacious rooms, hygienic dining, solar backup, and CCTV surveillance.',
        'website': '',
    },
    6: {
        'name': 'Janaki Model Girls Residence',
        'location': 'Tinkune',
        'city': 'Kathmandu',
        'country': 'Nepal',
        'phone': '9801112233',
        'email': 'care@janakigirls.com',
        'description': 'Safe, disciplined, and comfortable all-girls hostel in Tinkune, convenient for college students and working women. Includes 24/7 warden, CCTV, and healthy home-style meals.',
        'website': '',
    },
    7: {
        'name': 'Sagarmatha Scholars Hostel',
        'location': 'Putalisadak',
        'city': 'Kathmandu',
        'country': 'Nepal',
        'phone': '9808275832',
        'email': 'info@sagarmathascholars.com',
        'description': 'Premier educational hub hostel right in Putalisadak, ideal for competitive exam students and undergraduates. Features power backup, study desks, and high-speed internet.',
        'website': '',
    },
}

# General fallback list of realistic dummy hostel names
FALLBACK_HOSTEL_NAMES = [
    ('Machapuchre Valley Hostel', 'Damside', 'Pokhara', 'Scenic mountain view hostel with great amenities and study environment.'),
    ('Kumari Heritage Stay', 'Basantapur', 'Kathmandu', 'Cozy heritage-themed hostel with traditional Nepali hospitality and modern comfort.'),
    ('Dhaulagiri Explorers Hub', 'Prithvi Chowk', 'Pokhara', 'Youthful hostel offering quiet study corners, community lounge, and fast internet.'),
    ('Lalupate Student Home', 'Koteshwor', 'Kathmandu', 'Quiet and friendly student home with home-cooked meals and warm ambiance.'),
    ('Mount Kailash Youth Residence', 'Chabahil', 'Kathmandu', 'Conveniently located residence with clean dorms and private rooms for students.'),
]


class Command(BaseCommand):
    help = 'Replace all real/sample hostel names in the DB with authentic realistic dummy names and clear photos'

    def handle(self, *args, **options):
        hostels = Hostel.objects.all().order_by('id')
        updated = 0

        fallback_idx = 0
        for hostel in hostels:
            if hostel.id in HOSTEL_ID_REPLACEMENTS:
                data = HOSTEL_ID_REPLACEMENTS[hostel.id]
                for field, value in data.items():
                    setattr(hostel, field, value)
                self.stdout.write(f'  Updated [ID {hostel.id}]: "{hostel.name}"')
            else:
                name, loc, city, desc = FALLBACK_HOSTEL_NAMES[fallback_idx % len(FALLBACK_HOSTEL_NAMES)]
                fallback_idx += 1
                hostel.name = f"{name} {hostel.id}"
                hostel.location = loc
                hostel.city = city
                hostel.description = desc
                hostel.email = f"info.hostel{hostel.id}@nepalstay.com"
                hostel.website = ""
                self.stdout.write(f'  Updated with fallback [ID {hostel.id}]: "{hostel.name}"')

            # Clear cover image (user specified: no photo needed)
            if hostel.cover_image:
                hostel.cover_image = ''
                self.stdout.write(f'    Cleared cover image for: {hostel.name}')

            hostel.save()
            updated += 1

        # Clear any gallery images
        gallery_count = HostelImage.objects.count()
        if gallery_count:
            HostelImage.objects.all().delete()
            self.stdout.write(f'  Deleted {gallery_count} gallery image(s)')

        self.stdout.write(self.style.SUCCESS(f'Successfully updated {updated} hostel(s) with realistic dummy names and cleared all images.'))
