from django.db import models
from django.conf import settings

class Lobby(models.Model):
    lobby_id = models.CharField(max_length=10, unique=True)  # Unique lobby code
    host = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='hosted_lobbies')
    players = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='joined_lobbies', blank=True)
    status = models.CharField(
        max_length=20,
        choices=[('waiting', 'Waiting'), ('active', 'Active'), ('completed', 'Completed')],
        default='waiting'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Lobby {self.lobby_id} - Host: {self.host.username}"
