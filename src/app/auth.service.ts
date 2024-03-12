// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://192.168.1.19:3000/auth'; // replace with your NestJS server URL
  private tokenKey = 'authToken';

  constructor(private http: HttpClient, private cookies: CookieService) {}

  login(username: string, password: string): Observable<any> {
    // Fix: Observable type
    return this.http
      .post<any>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap((response) => {
          if (response && response.access_token) {
            localStorage.setItem(this.tokenKey, response.access_token);
          }
        }),
        catchError((error: any) => {
          console.error('Error during login:', error);
          
          throw error;
          
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.cookies.get('access-token') ? true : false;
    // return !!localStorage.getItem(this.tokenKey);
  }
}
