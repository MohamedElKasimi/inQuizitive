# Generated by Django 4.2.6 on 2024-11-28 20:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0002_alter_files_file_size'),
    ]

    operations = [
        migrations.AddField(
            model_name='files',
            name='high_score',
            field=models.PositiveBigIntegerField(blank=True, null=True),
        ),
    ]
