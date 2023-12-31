# Generated by Django 4.2.6 on 2023-10-25 18:13

from django.contrib.auth.models import User
from django.db import migrations
from django.utils import timezone


def seed(apps, schema_editor):
    User.objects.create_user(
        username="admin",
        email="quinterosp.juan@gmail.com",
        password="admin",
        last_login=timezone.now(),
        is_superuser=True,
        is_staff=True,
    )

 # Is 'unseed' even a word? 🤔
def unseed(apps, schema_editor):
    User.objects.get(username="admin").delete()

class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(code=seed, reverse_code=unseed)
    ]
