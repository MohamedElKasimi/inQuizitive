from django.urls import path
from . import views

urlpatterns = [
    path('generateQuiz/<int:fileId>/', views.generateQuiz, name='generateQuiz'),  # Ensure this is correct
]
