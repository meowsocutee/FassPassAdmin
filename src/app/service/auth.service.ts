import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_USERS, User, UserRole } from '../mock-data/users.mock';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'fastpass_auth_token';
  private readonly ROLE_KEY = 'fastpass_user_role';
  private readonly USER_KEY = 'fastpass_user_info';

  constructor() { }

  login(email: string, password: string): Observable<{ token: string, user: User }> {
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);

    if (user) {
      // Simulate token generation
      const mockToken = `mock-token-${user.id}-${Date.now()}`;
      localStorage.setItem(this.TOKEN_KEY, mockToken);
      // ✅ Phase 1: Store role and basic user info for RoleGuard & UI
      localStorage.setItem(this.ROLE_KEY, user.role);
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem(this.USER_KEY, JSON.stringify(userWithoutPassword));

      return of({ token: mockToken, user: userWithoutPassword as User }).pipe(delay(500));
    } else {
      return throwError(() => new Error('Invalid email or password')).pipe(delay(500));
    }
  }

  logout(): Observable<void> {
    // Phase 1: Mock Data & Auth Guard
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.USER_KEY);
    return of(undefined).pipe(delay(500));

    /*
    // Phase 2: Backend Integration (Session-based)
    // return this.http.post('/api/v1/auth/logout', {}, { withCredentials: true });
    */
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUserRole(): UserRole | null {
    return localStorage.getItem(this.ROLE_KEY) as UserRole | null;
  }

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) as User : null;
  }

  hasRole(roles: UserRole[]): boolean {
    const role = this.getCurrentUserRole();
    return role ? roles.includes(role) : false;
  }
}
