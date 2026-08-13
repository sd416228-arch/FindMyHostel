from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hostels', '0004_reservation'),
    ]

    operations = [
        migrations.RenameField(
            model_name='hostel',
            old_name='base_price',
            new_name='monthly_rent',
        ),
        migrations.RenameField(
            model_name='room',
            old_name='price_per_night',
            new_name='monthly_rent',
        ),
    ]
