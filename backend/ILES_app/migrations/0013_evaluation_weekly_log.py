"""
Placeholder migration created to restore missing migration node.
This migration intentionally contains no operations; it preserves migration
history ordering so subsequent migration 0014 can run without NodeNotFoundError.
"""
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ILES_app', '0001_initial'),
    ]

    operations = []
