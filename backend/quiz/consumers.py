from channels.generic.websocket import AsyncWebsocketConsumer
import json

class LobbyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.lobby_id = self.scope['url_route']['kwargs']['lobby_id']
        self.lobby_group_name = f"lobby_{self.lobby_id}"

        # Join lobby group
        await self.channel_layer.group_add(
            self.lobby_group_name,
            self.channel_name
        )

        # Accept the WebSocket connection
        await self.accept()

    async def disconnect(self, close_code):
        # Leave lobby group
        await self.channel_layer.group_discard(
            self.lobby_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        # Parse the incoming WebSocket message
        data = json.loads(text_data)
        message = data.get('message', '')

        # Broadcast the message to the group
        await self.channel_layer.group_send(
            self.lobby_group_name,
            {
                'type': 'lobby_message',
                'message': message
            }
        )

    async def lobby_message(self, event):
        # Send the message to WebSocket
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))