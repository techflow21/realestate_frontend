import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../../store/auth/auth.store';

export const roleGuard = (roles: string[]): CanActivateFn => {
  return (route, state) => {
    const authStore = inject(AuthStore);
    const router = inject(Router);
    const userRoles = authStore.userRoles();
    const isAuthenticated = authStore.isAuthenticated();
    const user = authStore.user();
    
    console.log('[roleGuard] Checking roles:', {
      requiredRoles: roles,
      userRoles,
      isAuthenticated,
      userEmail: user?.email,
      route: state.url
    });
    
    if (!isAuthenticated) {
      console.warn('[roleGuard] User not authenticated');
      router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    
    const hasRole = userRoles && roles.some(r => userRoles.includes(r));
    
    if (hasRole) {
      console.log('[roleGuard] Access granted - user has required role');
      return true;
    }
    
    console.warn('[roleGuard] Access denied - user lacks required roles');
    router.navigate(['/unauthorized']);
    return false;
  };
};
