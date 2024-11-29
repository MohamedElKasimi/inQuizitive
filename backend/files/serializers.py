from rest_framework import serializers
from .models import Files

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Files
        fields = ['id', 'file', 'file_name', 'upload_date', 'file_size', 'high_score']
        extra_kwargs = {'file_size': {'required': False}}