from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, EventViewSet, UserListCreateView, User, BookingViewset

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('events', EventViewSet, basename='event')
router.register('booking', BookingViewset, basename='booking')


urlpatterns = [
    path('', include(router.urls)),
    path('users/', UserListCreateView.as_view(), name='user-list-create'),
    path('me/', User, name='user'),
    # path('openai/', openai, name='openai')
]
