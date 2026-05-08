import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_USERS, User } from '../mock-data/users.mock';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'fastpass_auth_token';

  constructor() { }

  login(email: string, password: string): Observable<{ token: string, user: User }> {
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Simulate token generation
      const mockToken = `mock-token-${user.id}-${Date.now()}`;
      localStorage.setItem(this.TOKEN_KEY, mockToken);
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return of({ token: mockToken, user: userWithoutPassword as User }).pipe(delay(500)); // Add delay to simulate network request
    } else {
      return throwError(() => new Error('Invalid email or password')).pipe(delay(500));
    }
  }

  logout(): Observable<void> {
    // Phase 1: Mock Data & Auth Guard
    localStorage.removeItem(this.TOKEN_KEY);
    return of(undefined).pipe(delay(500)); // Simulate network latency

    /* 
    // Phase 2: Backend Integration (Session-based)
    // Replace the above mock logic with the following HTTP call when the backend is ready:
    // return this.http.post('/api/v1/auth/logout', {}, { withCredentials: true });
    */
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
