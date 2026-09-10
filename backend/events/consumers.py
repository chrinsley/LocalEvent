from channels.generic.websocket import AsyncWebsocketConsumer
import json


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        user = self.scope.get("user")
        print(user)

        print("WebSocket user:", user)
        print("Authenticated:", user.is_authenticated)

        self.room_name = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_group_name = f"chat_{self.room_name}"

        if not user or not user.is_authenticated:
            print("WebSocket authentication failed")

            await self.close()
            return

        print("WebSocket authentication successful")

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