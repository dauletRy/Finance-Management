import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getCards(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cards/`);
  }

  createCard(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cards/`, data);
  }

  deleteCard(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cards/${id}/`);
  }

  getTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/transactions/`);
  }

  createTransaction(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/transactions/`, data);
  }

  deleteTransaction(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/transactions/${id}/`);
  }

  getDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/`);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories/`);
  }

  exportCSV(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export-csv/`, { responseType: 'blob' });
  }
}