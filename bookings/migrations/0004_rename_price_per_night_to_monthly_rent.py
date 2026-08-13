from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bookings', '0003_remove_booking_bookings_bo_guest_i_261eaf_idx_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='booking',
            old_name='price_per_night',
            new_name='monthly_rent',
        ),
    ]
