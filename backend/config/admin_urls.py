from django.urls import include, path
from rest_framework.routers import DefaultRouter


from events.admin_views import AdminCategoryViewSet, AdminEventViewSet, AdminUserViewSet, AdminUserRetrieveUpdateDestroyView, AdminCurrentUserView

router = DefaultRouter()
router.register('categories', AdminCategoryViewSet, basename='admin-category')
router.register('events', AdminEventViewSet, basename='admin-event')


urlpatterns = [
    path('', include(router.urls)),
    path('users/', AdminUserViewSet.as_view(), name='admin-user'),
    path(
        'me/',
        AdminCurrentUserView.as_view(),
        name='admin-me'
    ),
    path('users/<int:pk>/', AdminUserRetrieveUpdateDestroyView.as_view(), name='admin-user-detail'),
]
