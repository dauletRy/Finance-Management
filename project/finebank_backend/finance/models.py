from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta

class Category(models.Model):
    name = models.CharField(max_length=50)
    icon = models.CharField(max_length=10)          # emoji for frontend

    def __str__(self):
        return f"{self.icon} {self.name}"

class Card(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cards')
    name = models.CharField(max_length=100)         # e.g. "Visa •••• 4242"
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (${self.balance})"
    
class TransactionManager(models.Manager):
    def get_weekly_stats(self, user):
        last_week = timezone.now() - timedelta(days=7)
        return self.filter(card__user=user, date__gte=last_week).aggregate(
            total_income=Sum('amount'),
        )

class Transaction(models.Model):
    objects = models.Manager()                     # default
    finance_objects = TransactionManager()             # custom manager (Grade Booster)

    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='transactions')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255)
    transaction_type = models.CharField(max_length=10, choices=[('income', 'Income'), ('expense', 'Expense')])
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.transaction_type} ${self.amount} - {self.description}"

    def save(self, *args, **kwargs):
        # Update card balance automatically on create
        if not self.pk:  # only on creation
            if self.transaction_type == 'expense':
                self.card.balance -= self.amount
            else:
                self.card.balance += self.amount
            self.card.save()
        super().save(*args, **kwargs)

