import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';


interface AuthResponse {
  token: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isTokenValid());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(loginForm:any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, loginForm)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.setUser(response.username);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  getUser(): any {
    const user = localStorage.getItem("username");
    return user ? JSON.parse(user) : null;
  }

  private setToken(token: string): void {
    localStorage.setItem("token", token);
  }

  private setUser(user: any): void {
    localStorage.setItem("username", JSON.stringify(user));
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return true;
  }

}