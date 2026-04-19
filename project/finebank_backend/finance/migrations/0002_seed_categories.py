from django.db import migrations


def seed_categories(apps, schema_editor):
    Category = apps.get_model('finance', 'Category')
    categories = [
        ('Food & Dining', '🍔'),
        ('Transport', '🚗'),
        ('Shopping', '🛍️'),
        ('Housing & Utilities', '🏠'),
        ('Health & Medicine', '💊'),
        ('Entertainment', '🎬'),
        ('Education', '📚'),
        ('Salary', '💰'),
        ('Transfer', '🔄'),
        ('Other', '📦'),
    ]
    for name, icon in categories:
        Category.objects.create(name=name, icon=icon)


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_categories),
    ]