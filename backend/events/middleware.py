from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import UntypedToken


@database_sync_to_async
def get_user(validated_token):
    user_id = validated_token.get("user_id")
    if not user_id:
        return None

    try:
        return get_user_model().objects.get(id=user_id)
    except get_user_model().DoesNotExist:
        return None


class JWTAuthMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        query_string = scope.get("query_string", b"").decode()
        token = parse_qs(query_string).get("token", [None])[0]
        scope["user"] = None

        if token:
            try:
                validated_token = UntypedToken(token)
                scope["user"] = await get_user(validated_token)
            except (InvalidToken, TokenError):
                pass

        return await self.app(scope, receive, send)