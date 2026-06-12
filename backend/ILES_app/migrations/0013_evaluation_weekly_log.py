from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("ILES_app", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="evaluation",
            name="weekly_log",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="evaluations",
                to="ILES_app.weeklylog",
            ),
        ),
    ]
