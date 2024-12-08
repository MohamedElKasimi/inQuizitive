from django.db import models
from users.models import User
# Create your models here.
class Files(models.Model):
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploads')
    file = models.FileField(upload_to='uploads/%Y/%m/%d/')
    file_name = models.CharField(max_length=255)
    upload_date = models.DateTimeField(auto_now_add=True)
    file_size = models.PositiveIntegerField(null=True, blank=True, help_text="File size in bytes")
    high_score = models.PositiveBigIntegerField(null = True, blank = True)
    
    def __str__(self):
        return f"{self.file_name} uploaded by {self.user.username}"