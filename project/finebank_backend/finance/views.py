from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import HttpResponse
import csv
from .models import Card, Transaction, Category
from django.db.models import Sum
from .serializers import (
    LoginSerializer, DashboardSummarySerializer,
    CardSerializer, TransactionSerializer, CategorySerializer
)
from decimal import Decimal

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = authenticate(username=serializer.validated_data['username'],
                            password=serializer.validated_data['password'])
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {'id': user.id, 'username': user.username}
            })
        return Response({'error': 'Invalid credentials'}, status=400)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    return Response({'message': 'Logged out successfully'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    cards = Card.objects.filter(user=request.user)
    total_balance = sum(c.balance for c in cards)
    transactions = Transaction.objects.filter(card__user=request.user)[:10]

    total_income = Transaction.objects.filter(
        card__user=request.user, transaction_type='income'
    ).aggregate(Sum('amount'))['amount__sum'] or Decimal('0')

    total_expense = Transaction.objects.filter(
        card__user=request.user, transaction_type='expense'
    ).aggregate(Sum('amount'))['amount__sum'] or Decimal('0')

    serializer = DashboardSummarySerializer({
        'total_balance': total_balance,
        'total_income': total_income,
        'total_expense': total_expense,
        'recent_transactions': TransactionSerializer(transactions, many=True).data
    })
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_transactions_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="finebank_transactions.csv"'
    writer = csv.writer(response)
    writer.writerow(['Date', 'Card', 'Type', 'Category', 'Description', 'Amount'])
    transactions = Transaction.objects.filter(card__user=request.user).order_by('-date')
    for t in transactions:
        writer.writerow([
            t.date.strftime('%Y-%m-%d %H:%M'),
            t.card.name,
            t.transaction_type,
            t.category.name if t.category else '',
            t.description,
            t.amount
        ])
    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def weekly_stats(request):
    stats = Transaction.finance_objects.get_weekly_stats(request.user)
    return Response(stats)

class CategoryList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = Category.objects.all()
        return Response(CategorySerializer(categories, many=True).data)

class CardListCreate(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cards = Card.objects.filter(user=request.user)
        return Response(CardSerializer(cards, many=True).data)

    def post(self, request):
        serializer = CardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class TransactionListCreate(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = Transaction.objects.filter(card__user=request.user)
        return Response(TransactionSerializer(transactions, many=True).data)

    def post(self, request):
        serializer = TransactionSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class TransactionDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Transaction.objects.get(pk=pk, card__user=user)
        except Transaction.DoesNotExist:
            return None

    def get(self, request, pk):
        transaction = self.get_object(pk, request.user)
        if not transaction:
            return Response(status=404)
        return Response(TransactionSerializer(transaction).data)

    def put(self, request, pk):
        transaction = self.get_object(pk, request.user)
        if not transaction:
            return Response(status=404)
        serializer = TransactionSerializer(transaction, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        transaction = self.get_object(pk, request.user)
        if not transaction:
            return Response(status=404)
        card = transaction.card
        if transaction.transaction_type == 'expense':
            card.balance += transaction.amount
        else:
            card.balance -= transaction.amount
        card.save()
        transaction.delete()
        return Response(status=204)

class CardDetail(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            card = Card.objects.get(pk=pk, user=request.user)
            card.delete()
            return Response(status=204)
        except Card.DoesNotExist:
            return Response(status=404)