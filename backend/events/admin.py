from django.contrib import admin

from .models import Category, Event


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'label']


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'date', 'city', 'featured']
    list_filter = ['category', 'featured', 'source']
    search_fields = ['title', 'venue', 'city']
