from django.conf import settings
from django.db.models.signals import post_save
from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver


@receiver(
    post_save,
    sender=settings.AUTH_USER_MODEL,
    dispatch_uid='send_welcome_email',
)
def send_welcome_email(sender, instance, created, **kwargs):
    if created:
        subject = 'Welcome to LocalEvent'
        text_content = f'''Hi {instance.username},

Welcome to LocalEvent!

Your account is ready. You can now discover local events, find activities in your area, and keep track of the events you do not want to miss.

We are happy to have you with us.
        '''
        html_content = f'''
        <div style="margin:0; padding:32px 16px; background:#f4f7f5; font-family:Arial,sans-serif; color:#1f2933;">
            <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden;">
                <div style="padding:28px 32px; background:#176b5b; color:#ffffff;">
                    <h1 style="margin:0; font-size:28px;">Welcome to LocalEvent</h1>
                    <p style="margin:8px 0 0; font-size:15px;">Your local experiences start here.</p>
                </div>
                <div style="padding:32px;">
                    <p style="margin-top:0; font-size:17px;">Hi {instance.username},</p>
                    <p>Thanks for creating your LocalEvent account. You can now discover local events, find activities in your area, and keep track of the experiences you do not want to miss.</p>
                    <p>Browse what is happening nearby and make your next day out a memorable one.</p>
                    <p style="margin-bottom:0;">We are happy to have you with us.</p>
                </div>
                <div style="padding:20px 32px; background:#eef3f0; color:#52605a; font-size:13px;">
                    You are receiving this email because you created a LocalEvent account.
                </div>
            </div>
        </div>
        '''
        message = EmailMultiAlternatives(
            subject,
            text_content,
            settings.DEFAULT_FROM_EMAIL,
            [instance.email],
        )
        message.attach_alternative(html_content, 'text/html')
        message.send(fail_silently=False)