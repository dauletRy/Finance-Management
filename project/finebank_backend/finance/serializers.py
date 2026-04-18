from rest_framework import serializers
from .models import Card, Transaction, Category
from django.contrib.auth import get_user_model

User = get_user_model()

class LoginSerializer(serializers.Serializer):          # Serializer (not Model)
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class DashboardSummarySerializer(serializers.Serializer):  # Serializer (not Model)
    total_balance = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_income = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_expense = serializers.DecimalField(max_digits=12, decimal_places=2)
    recent_transactions = serializers.ListField()

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['id', 'name', 'balance']

class TransactionSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=False)
    card = serializers.PrimaryKeyRelatedField(queryset=Card.objects.all())

    class Meta:
        model = Transaction
        fields = ['id', 'card', 'category', 'amount', 'description', 'transaction_type', 'date']

    def create(self, validated_data):
        request = self.context['request']
        card = validated_data['card']
        if card.user != request.user:
            raise serializers.ValidationError("You do not own this card.")
        return super().create(validated_data)

    def update(self, instance, validated_data):
        old_amount = instance.amount
        old_type = instance.transaction_type
        card = instance.card

        # reverse old effect
        if old_type == 'expense':
            card.balance += old_amount
        else:
            card.balance -= old_amount

        # apply new values
        instance = super().update(instance, validated_data)

        if instance.transaction_type == 'expense':
            card.balance -= instance.amount
        else:
            card.balance += instance.amount

        card.save()
        return instance