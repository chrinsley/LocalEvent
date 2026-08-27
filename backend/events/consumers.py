from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings
import json


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        self.room_name = self.scope["url_route"]["kwargs"]["room_id"]

        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()


    async def receive(self, text_data):

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "room_id": self.room_name,
                "username": "User",
                "message": text_data,
            }
        )


    async def chat_message(self, event):

        await self.send(
            text_data=json.dumps({
                "message": event["message"],
            })
        )


    async def disconnect(self, close_code):

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )