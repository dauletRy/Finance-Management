import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card, Transaction, Category, DashboardSummary, NewCard, NewTransaction, WeeklyStats } from '../models/finance.models';

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getCards(): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.apiUrl}/cards/`);
  }

  createCard(data: NewCard): Observable<Card> {
    return this.http.post<Card>(`${this.apiUrl}/cards/`, data);
  }

  deleteCard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cards/${id}/`);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions/`);
  }

  createTransaction(data: NewTransaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/transactions/`, data);
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/transactions/${id}/`);
  }

  getDashboard(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/dashboard/`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories/`);
  }

  exportCSV(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export-csv/`, { responseType: 'blob' });
  }

  getWeeklyStats(): Observable<WeeklyStats> {
    return this.http.get<WeeklyStats>(`${this.apiUrl}/weekly-stats/`);
  }
}