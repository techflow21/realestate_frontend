import { Injectable, inject, computed } from '@angular/core';
import { signalStore, withState, withMethods, withHooks, withComputed, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { AuthService } from '../../core/services/auth.service';
import { pipe, switchMap, tap, catchError, of, EMPTY } from 'rxjs';
import { JwtResponse, LoginRequest, RegisterRequest } from '../../core/models/auth.model';

type AuthState = {
  user: JwtResponse | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  loginSuccess: boolean;
};

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  loginSuccess: false
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  
  withComputed(({ user, token }) => ({
    isAuthenticated: computed(() => !!token()),
    isAdmin: computed(() => user()?.roles?.includes('ROLE_ADMIN') ?? false),
    userName: computed(() => {
      const currentUser = user();
      return currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '';
    }),
    userRoles: computed(() => user()?.roles ?? []),
  })),
  
  withMethods((store, authService = inject(AuthService)) => ({
    login: rxMethod<LoginRequest>(
      pipe(
        switchMap((credentials) => {
          patchState(store, { loading: true, error: null, loginSuccess: false });
          return authService.login(credentials).pipe(
            tap((response: JwtResponse) => {
              patchState(store, {
                user: response,
                token: response.token,
                loading: false,
                loginSuccess: true
              });
              localStorage.setItem('token', response.token);
              localStorage.setItem('user', JSON.stringify(response));
            }),
            catchError((error: any) => {
              patchState(store, {
                error: error?.error?.message || 'Login failed',
                loading: false,
                loginSuccess: false
              });
              return EMPTY;
            })
          );
        })
      )
    ),
    register: rxMethod<RegisterRequest>(
      pipe(
        switchMap((request) => {
          patchState(store, { loading: true, error: null });
          return authService.register(request).pipe(
            tap((response: any) => {
              patchState(store, { loading: false });
            }),
            catchError((error: any) => {
              patchState(store, {
                error: error?.error?.message || 'Registration failed',
                loading: false
              });
              return EMPTY;
            })
          );
        })
      )
    ),
    verifyEmail: rxMethod<string>(
      pipe(
        switchMap((token) => {
          return authService.verifyEmail(token).pipe(
            tap((response: any) => {
              console.log('Email verified');
            }),
            catchError((error: any) => {
              console.error('Verification failed', error);
              return EMPTY;
            })
          );
        })
      )
    ),
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      patchState(store, {
        user: null,
        token: null,
        loading: false,
        error: null,
        loginSuccess: false
      });
    },
    resetLoginSuccess: () => {
      patchState(store, { loginSuccess: false });
    }
  })),
  withHooks({
    onInit(store) {
      // Restore auth state from localStorage
      const token = localStorage.getItem('token');
      const userJson = localStorage.getItem('user');
      
      if (token && userJson) {
        try {
          const user: JwtResponse = JSON.parse(userJson);
          
          // Optional: Check if token is expired
          try {
            const parts = token.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(atob(parts[1]));
              if (payload.exp && payload.exp * 1000 < Date.now()) {
                // Token expired, clear everything
                console.warn('Token expired, clearing auth state');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return;
              }
            }
          } catch (e) {
            console.warn('Could not decode token for expiration check');
          }
          
          // Restore the state
          patchState(store, {
            user,
            token,
            loading: false,
            error: null
          });
          
          console.log('Auth state restored:', { email: user.email, roles: user.roles });
        } catch (e) {
          console.error('Failed to restore auth state:', e);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    }
  })
);
