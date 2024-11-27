import google.generativeai as genai
from django.http import JsonResponse, HttpResponseBadRequest
from django.conf import settings
from files.models import Files
from django.shortcuts import get_object_or_404
import os
import logging
import json

# Set up logging for debugging
logger = logging.getLogger(__name__)

# Configure Gemini model with API key
genai.configure(api_key=settings.SECRET_KEY)

def generateQuiz(request, fileId):
    if request.method != "GET":
        logger.warning("Non-GET request made to generateQuiz")
        return HttpResponseBadRequest({"error": "Only GET requests are allowed!"})

    # Fetch and validate the file object
    try:
        uploadedFile = get_object_or_404(Files, id=fileId)
    except Exception as e:
        logger.error(f"File with id {fileId} not found: {e}")
        return JsonResponse({"error": "File not found in the database!"}, status=404)

    # Ensure the file exists in the media directory
    file_path = uploadedFile.file.path  # Use the `file` field's path
    if not os.path.exists(file_path):
        logger.error(f"File not found on the server: {file_path}")
        return JsonResponse({"error": "File not found on the server!"}, status=404)

    try:
        # Upload file to Gemini API
        uploaded_file = genai.upload_file(file_path)

        # Check if the upload was successful
        if not uploaded_file.name:
            logger.error("File upload to Gemini failed.")
            return JsonResponse({"error": "Failed to upload file to Gemini."}, status=500)

        # Use the Gemini API to generate content based on the uploaded file
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = (
            "Based on the content of this document, generate a quiz with exactly 10 questions. "
            "Each question should include the following in JSON format:\n"
            "- `question`: The text of the question.\n"
            "- `options`: A list of 4 possible answers (strings).\n"
            "- `correctAnswer`: The index (0, 1, 2, or 3) of the correct answer in the options.\n\n"
            "The questions should test key details, themes, or topics from the document."
        )

        response = model.generate_content([prompt, uploaded_file])

        # Remove the triple backticks if they are in the response
        if response.text.startswith("```json") and response.text.endswith("```"):
            response_text = response.text[7:-3].strip()  # Remove the backticks and any extra whitespace
        else:
            response_text = response.text

        # Directly return the raw JSON response from the Gemini API
        try:
            quiz_content = json.loads(response_text)  # Convert raw text into a JSON object
            return JsonResponse({"quiz": quiz_content}, status=200)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse the generated content: {e}")
            return JsonResponse({"error": "Failed to parse the generated content."}, status=500)

    except Exception as e:
        # Log and return any exceptions that occur
        logger.exception(f"Error during quiz generation: {e}")
        return JsonResponse({"error": str(e)}, status=500)
