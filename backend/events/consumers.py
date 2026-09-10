from channels.generic.websocket import AsyncWebsocketConsumer
import json


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
       

        self.room_name = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_group_name = f"chat_{self.room_name}"


        await self.accept()

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "room_id": self.room_name,
                "username": self.scope["user"].username,
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

        if hasattr(self, "room_group_name"):

            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )