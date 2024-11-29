import json
import os
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Files
from .serializers import FileSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

# View for uploading a file
class FileUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

        file_serializer = FileSerializer(data=request.data)
        
        if file_serializer.is_valid():
            # Save the file first
            file_instance = file_serializer.save(user=request.user)
            
            # Calculate file size (in bytes) and save it
            file_instance.file_size = file_instance.file.size  # Get size of uploaded file
            file_instance.save()

            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# View to list all files uploaded by the current user
class FileListView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request):
        files = Files.objects.filter(user=request.user)  # Filter files uploaded by the authenticated user
        serializer = FileSerializer(files, many=True)
        return Response(serializer.data)
    

class HighScoreUpdate(APIView):

    def post(self, request, *args, **kwargs):  # Add 'self' as the first argument
        try:
            data = request.data  # DRF provides `request.data` for parsed JSON payload
            file_id = data.get('fileID')
            score = data.get('score')

            if not all([file_id, score]):
                return Response({'error': 'fileID and score are required'}, status=400)

            # Get the file and update the high score
            file = get_object_or_404(Files, id=file_id)
            file.high_score = score
            file.save()

            return Response({'message': 'High score updated', 'file_id': file.id, 'high_score': file.high_score})
        except Exception as e:
            return Response({'error': f'An error occurred: {str(e)}'}, status=400)
        
class FileDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, file_id):
        # Fetch the file, ensuring it belongs to the authenticated user
        file = get_object_or_404(Files, id=file_id, user=request.user)

        # Get the file path
        file_path = file.file.path  # Assuming the file field in the model is named 'file'

        # Delete the file object from the database
        file.delete()

        # Remove the file from the filesystem
        if os.path.exists(file_path):
            os.remove(file_path)

        return Response({'message': 'File and associated data deleted successfully'}, status=status.HTTP_204_NO_CONTENT)