from django.urls import path
from .views import GenerateQuizView, CreateLobbyView, JoinLobbyView, GetLobbyView

urlpatterns = [
    path('generateQuiz/<int:file_id>/', GenerateQuizView.as_view(), name='generate_quiz'),  # CBV for quiz generation
    path('create-lobby/', CreateLobbyView.as_view(), name='create_lobby'),  # CBV for creating a lobby
    path('join-lobby/<str:code>/', JoinLobbyView.as_view(), name='join_lobby'),  # CBV for joining a lobby
    path('lobby-details/<str:code>/', GetLobbyView.as_view(), name='lobby_details'),  # CBV for getting lobby details
]
