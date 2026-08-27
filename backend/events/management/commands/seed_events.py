from django.core.management.base import BaseCommand

from events.models import Category, Event


CATEGORIES = [
    {
        'id': 'concerts',
        'label': 'Concerts',
        'description': 'Live music, gigs, and open-air performances near you',
        'icon': '🎵',
        'gradient': 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
    },
    {
        'id': 'football',
        'label': 'Football',
        'description': 'Matches, watch parties, and local league fixtures',
        'icon': '⚽',
        'gradient': 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
    },
    {
        'id': 'festivals',
        'label': 'Festivals',
        'description': 'Street fairs, cultural celebrations, and food festivals',
        'icon': '🎪',
        'gradient': 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fbbf24 100%)',
    },
]

EVENTS = [
    {
        'title': 'Summer Nights Live',
        'description': (
            'An outdoor concert series featuring local indie bands, food trucks, '
            'and a sunset DJ set. Bring a blanket and enjoy music under the stars.'
        ),
        'category': 'concerts',
        'date': '2026-07-12',
        'time': '18:00',
        'venue': 'Riverside Amphitheater',
        'city': 'Portland',
        'image': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
        'source': 'facebook',
        'price': 'From $25',
        'attendees': 842,
        'featured': True,
    },
    {
        'title': 'Jazz & Soul Evening',
        'description': (
            'Intimate jazz session with rotating guest vocalists. Craft cocktails '
            'and small plates available at the venue bar.'
        ),
        'category': 'concerts',
        'date': '2026-07-18',
        'time': '20:00',
        'venue': 'Blue Note Lounge',
        'city': 'Portland',
        'image': 'https://images.unsplash.com/photo-1415201364774-f6f0ff26b1b6?w=800&q=80',
        'source': 'whatsapp',
        'price': 'Free',
        'attendees': 156,
        'featured': False,
    },
    {
        'title': 'Acoustic Unplugged',
        'description': (
            'Stripped-back acoustic sets from three rising singer-songwriters. '
            'Limited seating — arrive early.'
        ),
        'category': 'concerts',
        'date': '2026-08-02',
        'time': '19:30',
        'venue': 'The Loft Studio',
        'city': 'Seattle',
        'image': 'https://images.unsplash.com/photo-1459749411175-04bf6984a0fa?w=800&q=80',
        'source': 'local',
        'price': '$15',
        'attendees': 89,
        'featured': False,
    },
    {
        'title': 'City Derby Watch Party',
        'description': (
            'Big-screen viewing of the local derby with commentary, half-time quiz, '
            'and fan zone activities for all ages.'
        ),
        'category': 'football',
        'date': '2026-07-20',
        'time': '14:00',
        'venue': 'Metro Sports Bar',
        'city': 'Portland',
        'image': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
        'source': 'facebook',
        'price': 'Free entry',
        'attendees': 1200,
        'featured': True,
    },
    {
        'title': 'Sunday League Finals',
        'description': (
            "Championship match of the community Sunday league. Family-friendly "
            "atmosphere with kids' activities at halftime."
        ),
        'category': 'football',
        'date': '2026-07-27',
        'time': '11:00',
        'venue': 'Greenfield Park',
        'city': 'Portland',
        'image': 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80',
        'source': 'whatsapp',
        'price': 'Free',
        'attendees': 340,
        'featured': False,
    },
    {
        'title': '5-a-Side Tournament',
        'description': (
            'Register your team for a fast-paced 5-a-side tournament. Prizes for '
            'winners and best goal of the day.'
        ),
        'category': 'football',
        'date': '2026-08-09',
        'time': '09:00',
        'venue': 'Urban Pitch Complex',
        'city': 'Seattle',
        'image': 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80',
        'source': 'local',
        'price': '$40 per team',
        'attendees': 64,
        'featured': False,
    },
    {
        'title': 'Harvest Street Festival',
        'description': (
            'Three days of live music, artisan markets, street food from 40 vendors, '
            'and a lantern parade on Saturday night.'
        ),
        'category': 'festivals',
        'date': '2026-08-15',
        'time': '10:00',
        'venue': 'Old Town Square',
        'city': 'Portland',
        'image': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
        'source': 'facebook',
        'price': 'Weekend pass $35',
        'attendees': 5200,
        'featured': True,
    },
    {
        'title': 'Global Food & Culture Fair',
        'description': (
            "Celebrate diverse cuisines with cooking demos, cultural performances, "
            "and a kids' craft corner."
        ),
        'category': 'festivals',
        'date': '2026-07-25',
        'time': '12:00',
        'venue': 'Community Center Grounds',
        'city': 'Portland',
        'image': 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
        'source': 'whatsapp',
        'price': 'Free',
        'attendees': 890,
        'featured': False,
    },
    {
        'title': 'Neon Night Market',
        'description': (
            'Evening market with neon art installations, live DJs, vintage clothing '
            'stalls, and late-night street eats.'
        ),
        'category': 'festivals',
        'date': '2026-08-22',
        'time': '17:00',
        'venue': 'Warehouse District',
        'city': 'Seattle',
        'image': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
        'source': 'local',
        'price': '$10',
        'attendees': 2100,
        'featured': False,
    },
]


class Command(BaseCommand):
    help = 'Seed categories and events into the database'

    def handle(self, *args, **options):
        for cat_data in CATEGORIES:
            Category.objects.update_or_create(id=cat_data['id'], defaults=cat_data)

        Event.objects.all().delete()

        for event_data in EVENTS:
            category_id = event_data.pop('category')
            category = Category.objects.get(id=category_id)
            Event.objects.create(category=category, **event_data)

        self.stdout.write(
            self.style.SUCCESS(
                f'Seeded {Category.objects.count()} categories and '
                f'{Event.objects.count()} events.'
            )
        )
