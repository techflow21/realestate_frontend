import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../../store/auth/auth.store';

export const guestGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const isAuthenticated = authStore.isAuthenticated();
  
  if (!isAuthenticated) return true;
  
  // Redirect authenticated users to home or admin dashboard
  const isAdmin = authStore.isAdmin();
  router.navigate([isAdmin ? '/admin/dashboard' : '/']);
  return false;
};
