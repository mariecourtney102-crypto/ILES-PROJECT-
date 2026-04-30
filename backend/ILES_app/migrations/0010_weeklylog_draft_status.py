from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ILES_app', '0009_notification'),
    ]

    operations = [
        migrations.AlterField(
            model_name='weeklylog',
            name='status',
            field=models.CharField(
                choices=[
                    ('draft', 'Draft'),
                    ('pending', 'Pending'),
                    ('approved', 'Approved'),
                    ('rejected', 'Rejected'),
                ],
                default='draft',
                max_length=10,
            ),
        ),
    ]
