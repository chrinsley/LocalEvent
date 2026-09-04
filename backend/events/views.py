
from django.db.models import Q
from pydantic import Json
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import generics
from .models import Category, Event, User, Booking
from .serializers import CategorySerializer, EventSerializer, UserSerializer, BookingSerializer, ViewBookingSerializer, CurrentUserSerializer
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import os

from rest_framework.response import Response

from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from google.oauth2 import id_token
from google.auth.transport import requests

import os




class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'id'

    @action(detail=True, methods=['get'])
    def events(self, request, id=None):
        category = self.get_object()
        events = Event.objects.filter(category=category)
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.select_related('category').all()
    serializer_class = EventSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        featured = self.request.query_params.get('featured')
        search = self.request.query_params.get('search', '').strip()

        if category:
            qs = qs.filter(category_id=category)
        if featured == 'true':
            qs = qs.filter(featured=True)
        if search:
            qs = qs.filter(
                Q(title__icontains=search)
                | Q(venue__icontains=search)
                | Q(city__icontains=search)
                | Q(description__icontains=search)
            )
        return qs


class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.filter(is_staff=False)
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    if request.method == 'PATCH':
        serializer = CurrentUserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
    else:
        serializer = CurrentUserSerializer(user)
    return Response(serializer.data)


class BookingViewset(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action in ['create', 'retrieve']:
            return BookingSerializer
            
        
        return ViewBookingSerializer
    

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



User = get_user_model()


class GoogleLoginView(APIView):
    permission_classes = [AllowAny]
    

    def post(self, request):
       

        google_token = request.data.get("credential")

        if not google_token:
            return Response(
                {"error": "Google credential is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Verify the ID token with Google
            idinfo = id_token.verify_oauth2_token(
                google_token,
                requests.Request(),
                os.environ.get("GOOGLE_CLIENT_ID")
            )

        except ValueError:
            return Response(
                {"error": "Invalid Google token"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Information returned by Google
        google_id = idinfo.get("sub")
        email = idinfo.get("email")
        name = idinfo.get("name", "")
        picture = idinfo.get("picture")

        if not email:
            return Response(
                {"error": "Google account has no email"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Find existing user
        user = User.objects.filter(email=email).first()

        # Create user if they don't exist
        if not user:
            username = email.split("@")[0]

            # Make username unique
            original_username = username
            counter = 1

            while User.objects.filter(username=username).exists():
                username = f"{original_username}{counter}"
                counter += 1

            user = User.objects.create_user(
                username=username,
                email=email
            )

            user.set_unusable_password()
            user.save()

        # Generate JWT
        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "name": name,
                "picture": picture,
            }
        })