# Generated by Django 5.2 on 2025-05-31 13:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_remove_organizations_image_organizations_org_logo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='organizations',
            name='contact',
            field=models.CharField(blank=True, max_length=15, null=True, unique=True),
        ),
    ]
