from django.db import migrations, models


def fill_missing_user_emails(apps, schema_editor):
    CustomUser = apps.get_model('ILES_app', 'CustomUser')

    seen_emails = set()

    for user in CustomUser.objects.order_by('id'):
        current_email = (user.email or '').strip().lower()
        email = current_email or f"{user.username or 'user'}@iles.local".lower()
        local_part, _, domain = email.partition('@')
        if not domain:
            local_part = user.username or 'user'
            domain = 'iles.local'

        unique_email = f"{local_part}@{domain}".lower()
        counter = 1

        while unique_email in seen_emails:
            counter += 1
            unique_email = f"{local_part}-{counter}@{domain}".lower()

        seen_emails.add(unique_email)
        user.email = unique_email
        user.save(update_fields=['email'])


class Migration(migrations.Migration):

    dependencies = [
        ('ILES_app', '0010_weeklylog_draft_status'),
    ]

    operations = [
        migrations.RunPython(fill_missing_user_emails, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='customuser',
            name='email',
            field=models.EmailField(max_length=254, unique=True),
        ),
    ]
