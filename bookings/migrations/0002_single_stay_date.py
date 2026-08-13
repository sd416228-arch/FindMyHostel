from django.db import migrations, models


def backfill_stay_date(apps, schema_editor):
    Booking = apps.get_model('bookings', 'Booking')
    for booking in Booking.objects.all():
        booking.stay_date = booking.check_in_date
        booking.save(update_fields=['stay_date'])


class Migration(migrations.Migration):

    dependencies = [
        ('bookings', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='stay_date',
            field=models.DateField(null=True),
        ),
        migrations.RunPython(backfill_stay_date, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='booking',
            name='stay_date',
            field=models.DateField(),
        ),
        migrations.RemoveField(
            model_name='booking',
            name='check_in_date',
        ),
        migrations.RemoveField(
            model_name='booking',
            name='check_out_date',
        ),
        migrations.AddConstraint(
            model_name='booking',
            constraint=models.UniqueConstraint(
                condition=models.Q(('status__in', ['pending', 'confirmed', 'checked_in'])),
                fields=('room', 'stay_date'),
                name='unique_room_stay_date_active',
            ),
        ),
    ]
