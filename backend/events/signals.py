from django.db.models.signals import post_save
from django.conf import settings
from django.core.mail import send_mail
from django.dispatch import receiver

from .models import User

@receiver(post_save, sender=User, dispatch_uid="send_welcome_email")
def send_welcome_email(sender, instance, created, **kwargs):
    if created:
        send_mail(
            "Welcome to LocalEvent",
            "Welcome to LocalEvent",
            settings.DEFAULT_FROM_EMAIL,
            [instance.email],
            fail_silently=False,
        )