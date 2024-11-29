from django.urls import path
from .views import FileUploadView, FileListView, HighScoreUpdate

urlpatterns = [
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('listFiles/', FileListView.as_view(), name='file-list'),
    path('updateScore/', HighScoreUpdate.as_view(), name='score-update')
]
