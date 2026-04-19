from django.urls import path
from .views import (
    login_view, logout_view, dashboard_stats, export_transactions_csv,
    CardListCreate, CardDetail, TransactionListCreate, TransactionDetail,
    CategoryList, weekly_stats
)

urlpatterns = [
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('dashboard/', dashboard_stats, name='dashboard'),
    path('export-csv/', export_transactions_csv, name='export-csv'),
    path('weekly-stats/', weekly_stats, name='weekly-stats'),
    path('cards/', CardListCreate.as_view(), name='card-list'),
    path('cards/<int:pk>/', CardDetail.as_view(), name='card-detail'),
    path('transactions/', TransactionListCreate.as_view(), name='transaction-list'),
    path('transactions/<int:pk>/', TransactionDetail.as_view(), name='transaction-detail'),
    path('categories/', CategoryList.as_view()),
]