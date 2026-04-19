import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  createCard(data: any) {
    return this.http.post(`${this.apiUrl}/cards/`, data);
  }

  getCards(): Observable<any> { return this.http.get(`${this.apiUrl}/cards/`); }
  getTransactions(): Observable<any> { return this.http.get(`${this.apiUrl}/transactions/`); }
  createTransaction(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/transactions/`, data); }
  getDashboard(): Observable<any> { return this.http.get(`${this.apiUrl}/dashboard/`); }
  exportCSV(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export-csv/`, { responseType: 'blob' });
  }
  // + delete, update, etc. for full CRUD
}