from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware

from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser

from rest_framework_simplejwt.tokens import AccessToken


@database_sync_to_async
def get_user_from_token(token):

    try:
        print("JWT token received")

        access_token = AccessToken(token)

        print("JWT token is valid")

        user_id = access_token["user_id"]

        print("JWT user_id:", user_id)

        User = get_user_model()

        user = User.objects.get(id=user_id)

        print("Django user found:", user)

        return user

    except Exception as e:

        print("JWT ERROR:", repr(e))

        return AnonymousUser()


class JWTAuthMiddleware(BaseMiddleware):

    async def __call__(self, scope, receive, send):

        query_string = scope.get(
            "query_string",
            b""
        ).decode()

        print("WebSocket query string exists:", bool(query_string))

        query_params = parse_qs(query_string)

        token = query_params.get(
            "token",
            [None]
        )[0]

        print("WebSocket token exists:", bool(token))

        if token:

            scope["user"] = await get_user_from_token(token)

        else:

            scope["user"] = AnonymousUser()

        print("Middleware user:", scope["user"])

        return await super().__call__(
            scope,
            receive,
            send
        )