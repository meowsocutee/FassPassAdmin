import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { UserRole } from '../mock-data/users.mock';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles: UserRole[] = route.data?.['roles'] ?? [];

  if (authService.hasRole(allowedRoles)) {
    return true;
  }

  // Not authorized — redirect to dashboard
  return router.createUrlTree(['/dashboard']);
};
