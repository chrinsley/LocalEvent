from django.contrib.messages import api
from django.db.models import Q
from pydantic import Json
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import generics
from .models import Category, Event, User, Booking
from .serializers import CategorySerializer, EventSerializer, UserSerializer, BookingSerializer, ViewBookingSerializer
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import os
from openai import OpenAI
from rest_framework.response import Response




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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def User(request):
    user = request.user
    serializer = UserSerializer(user)
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
            
        # Fallback to a lighter serializer for lists or other actions
        return ViewBookingSerializer
    

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)