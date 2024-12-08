import json
import os
import random
import string
import logging
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from files.models import Files
from .models import Lobby
import google.generativeai as genai
from django.conf import settings

# Set up logging
logger = logging.getLogger(__name__)

# Configure Gemini model with API key
genai.configure(api_key=settings.SECRET_KEY)

class GenerateQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, file_id):
        try:
            uploaded_file = get_object_or_404(Files, id=file_id, user=request.user)
        except Exception as e:
            logger.error(f"File with id {file_id} not found or does not belong to the user: {e}")
            return Response({"error": "File not found or access denied."}, status=status.HTTP_404_NOT_FOUND)

        file_path = uploaded_file.file.path
        if not os.path.exists(file_path):
            logger.error(f"File not found on the server: {file_path}")
            return Response({"error": "File not found on the server."}, status=status.HTTP_404_NOT_FOUND)

        try:
            uploaded_file_to_gemini = genai.upload_file(file_path)

            if not uploaded_file_to_gemini.name:
                logger.error("File upload to Gemini failed.")
                return Response({"error": "Failed to upload file to Gemini."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = (
                "Based on the content of this document, generate a quiz with exactly 10 questions. "
                "Each question should include the following in JSON format:\n"
                "- `question`: The text of the question.\n"
                "- `options`: A list of 4 possible answers (strings).\n"
                "- `correctAnswer`: The index (0, 1, 2, or 3) of the correct answer in the options.\n\n"
                "The questions should test key details, themes, or topics from the document. The questions should increase in difficulty and be relevant to the actual course material. The quiz should be in the dominant language of the document. Avoid questions about the context (Author, title, metadata) of the document and focus solely on the material."
            )

            response = model.generate_content([prompt, uploaded_file_to_gemini])
            response_text = response.text.strip()

            # Check if the response contains JSON
            if response_text.startswith("```json") and response_text.endswith("```"):
                response_text = response_text[7:-3].strip()

            try:
                quiz_content = json.loads(response_text)  # Parse the JSON response
                return Response({"quiz": quiz_content}, status=status.HTTP_200_OK)
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse the generated content: {e}")
                return Response({"error": "Failed to parse the generated content."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.exception(f"Error during quiz generation: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CreateLobbyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        lobby_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

        # Create a new Lobby instance
        lobby = Lobby.objects.create(
            host=request.user,
            lobby_id=lobby_code
        )

        # Add the host to the players list
        lobby.players.add(request.user)

        return Response({
            "lobby_id": lobby.id,
            "code": lobby.lobby_id,
            "host": lobby.host.username,
            "players": [player.username for player in lobby.players.all()],
        }, status=status.HTTP_201_CREATED)


class JoinLobbyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, code):
        try:
            lobby = Lobby.objects.get(lobby_id=code)
        except Lobby.DoesNotExist:
            return Response({"error": "Lobby not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check if the user is already in the lobby
        if request.user in lobby.players.all():
            return Response({"error": "You are already in this lobby"}, status=status.HTTP_400_BAD_REQUEST)

        # Add the user to the players list
        lobby.players.add(request.user)

        return Response({
            "lobby_id": lobby.id,
            "code": lobby.lobby_id,
            "host": lobby.host.username,
            "players": [player.username for player in lobby.players.all()],
        }, status=status.HTTP_200_OK)


class GetLobbyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, code):
        try:
            lobby = Lobby.objects.get(lobby_id=code)
        except Lobby.DoesNotExist:
            return Response({"error": "Lobby not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "lobby_id": lobby.id,
            "code": lobby.lobby_id,
            "host": lobby.host.username,
            "players": [player.username for player in lobby.players.all()],
            "status": lobby.status,
        }, status=status.HTTP_200_OK)
