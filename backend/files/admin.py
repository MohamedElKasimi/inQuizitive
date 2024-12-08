from django.contrib import admin
from .models import Files

@admin.register(Files)
class FilesAdmin(admin.ModelAdmin):
    list_display = ('id','file_name',  'user', 'upload_date', 'file_size')  # Display desired fields
    list_filter = ('user', 'file_name')  # Optional: Filter by user or file type
    search_fields = ('file_name', 'user__username')  # Search by file name or username

