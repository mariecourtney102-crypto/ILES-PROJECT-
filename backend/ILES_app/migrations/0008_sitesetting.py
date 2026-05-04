from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ILES_app', '0007_feedback'),
    ]

    operations = [
        migrations.CreateModel(
            name='SiteSetting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('site_name', models.CharField(default='ILES', max_length=100)),
                ('admin_email', models.EmailField(blank=True, max_length=254)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
