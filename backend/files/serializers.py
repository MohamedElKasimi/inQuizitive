from rest_framework import serializers
from .models import Files

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Files
        fields = ['id', 'file', 'file_name', 'file_type', 'upload_date', 'file_size']
        extra_kwargs = {'file_size': {'required': False}}