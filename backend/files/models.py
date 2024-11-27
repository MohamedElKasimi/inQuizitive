from django.db import models
from users.models import User
# Create your models here.
class Files(models.Model):
    
    FILE_TYPES = [
        ('PDF', 'PDF Document'),
        ('TXT', 'Text File'),
        ('DOCX', 'Word Document'),
        ('PPTX', 'PowerPoint Presentation'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploads')
    file = models.FileField(upload_to='uploads/%Y/%m/%d/')
    file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=4, choices=FILE_TYPES)
    upload_date = models.DateTimeField(auto_now_add=True)
    file_size = models.PositiveIntegerField(null=True, blank=True, help_text="File size in bytes")
    
    def __str__(self):
        return f"{self.file_name} uploaded by {self.user.username}"