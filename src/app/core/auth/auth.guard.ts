import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../../store/auth/auth.store';

export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const isAuthenticated = authStore.isAuthenticated();
  const token = authStore.token();
  
  console.log('[authGuard] Checking authentication:', {
    isAuthenticated,
    hasToken: !!token,
    route: state.url
  });
  
  if (isAuthenticated) {
    console.log('[authGuard] Access granted');
    return true;
  }
  
  console.warn('[authGuard] Access denied - redirecting to login');
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
