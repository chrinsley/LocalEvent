from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()

class Category(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    label = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=10)
    gradient = models.CharField(max_length=200)

    class Meta:
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.label


class Event(models.Model):
    SOURCE_CHOICES = [
        ('facebook', 'Facebook'),
        ('whatsapp', 'WhatsApp'),
        ('local', 'Local listing'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='events'
    )
    date = models.DateField()
    time = models.TimeField()
    venue = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    image = models.URLField()
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES)
    price = models.CharField(max_length=50)
    attendees = models.PositiveIntegerField(default=0)
    featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['date', 'time']

    def __str__(self):
        return self.title
