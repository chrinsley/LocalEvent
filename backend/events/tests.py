from django.contrib.auth import get_user_model
from django.core import mail
from django.test import TestCase, override_settings


@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class WelcomeEmailSignalTests(TestCase):
	def test_new_user_receives_welcome_email(self):
		user = get_user_model().objects.create_user(
			username='new-user',
			email='new-user@example.com',
			password='password123',
		)

		self.assertEqual(len(mail.outbox), 1)
		self.assertEqual(mail.outbox[0].to, [user.email])
		self.assertEqual(mail.outbox[0].subject, 'Welcome to LocalEvent')
		self.assertIn('Your local experiences start here.', mail.outbox[0].alternatives[0][0])
		self.assertIn('Your account is ready.', mail.outbox[0].body)

	def test_existing_user_update_does_not_send_another_email(self):
		user = get_user_model().objects.create_user(
			username='existing-user',
			email='existing-user@example.com',
			password='password123',
		)
		mail.outbox.clear()

		user.first_name = 'Updated'
		user.save()

		self.assertEqual(mail.outbox, [])
