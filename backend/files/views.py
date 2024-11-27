from django.shortcuts import render
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
