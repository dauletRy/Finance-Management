from django.core.management.base import BaseCommand
from finance.models import Category


class Command(BaseCommand):
    help = 'Seeds the database with default finance categories and emojis'

    def handle(self, *args, **options):
        categories = [
            {"name": "Food", "icon": "🍔"},
            {"name": "Transport", "icon": "🚕"},
            {"name": "Tech", "icon": "💻"},
            {"name": "Shopping", "icon": "🛍️"},
            {"name": "Entertainment", "icon": "🎥"},
            {"name": "Health", "icon": "🏥"},
            {"name": "Salary", "icon": "💰"},
            {"name": "Freelance", "icon": "💼"},
            {"name": "Bills", "icon": "📄"},
            {"name": "Groceries", "icon": "🛒"},
            {"name": "Travel", "icon": "✈️"},
            {"name": "Gym", "icon": "🏋️"},
            {"name": "Subscriptions", "icon": "📺"},
            {"name": "Other", "icon": "🔖"},
        ]

        created_count = 0
        for cat in categories:
            obj, created = Category.objects.get_or_create(
                name=cat["name"],
                defaults={"icon": cat["icon"]}
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'✓ Created: {cat["icon"]} {cat["name"]}'))
            else:
                self.stdout.write(self.style.WARNING(f'⚠️ Already exists: {cat["icon"]} {cat["name"]}'))

        self.stdout.write(self.style.SUCCESS(f'\n🎉 Seed completed! {created_count} new categories added.'))