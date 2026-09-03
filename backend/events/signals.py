from django.core.mail import send_mail
from django.dispatch import receiver
from .models import User
from django.db.models.signals import post_save

@receiver(post_save, sender=User, dispatch_uid="send_welcome_email")
def send_welcome_email(sender,instance, created,**kwargs):
    if created:
        send_mail("welcome", "Welcome to LocalEvent", "jchrinsley2@gmail.com", [instance.email], fail_silently=False)