from rest_framework import viewsets
from .models import Category, Event, User
from .serializers import CategorySerializer, EventSerializer, AdminUserSerializer, UserSerializer
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework import generics


class AdminCategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'id'


class AdminEventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.select_related('category').all()
    serializer_class = EventSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'pk'


class AdminUserViewSet(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [AllowAny]

class AdminUserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [AllowAny]
    lookup_field = 'pk'


class AdminCurrentUserView(generics.RetrieveAPIView):
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]
    def get_object(self):
        return self.request.user
