# Generated by Django 4.2.6 on 2024-12-03 15:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0003_files_high_score'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='files',
            name='file_type',
        ),
    ]
