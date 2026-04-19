import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/finance.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login/`, credentials).pipe(
      tap((res) => {
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);
        localStorage.setItem('username', res.user.username);
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUsername(): string {
    return localStorage.getItem('username') || 'User';
  }
}