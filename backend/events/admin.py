from django.contrib import admin

from .models import Category, Event, Booking


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'label']

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'event', 'date']

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'date', 'city', 'featured']
    list_filter = ['category', 'featured', 'source']
    search_fields = ['title', 'venue', 'city']
