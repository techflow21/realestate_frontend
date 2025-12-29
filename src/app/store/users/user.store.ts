import { Injectable, inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, EMPTY } from 'rxjs';
import { User, UpdateUserRequest } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';

type UserState = {
  users: User[];
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  total: number;
  filters: {
    email: string;
    role: string | null;
  };
};

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  page: 1,
  pageSize: 10,
  total: 0,
  filters: {
    email: '',
    role: null
  }
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, userService = inject(UserService)) => ({
    loadUsers: rxMethod<{ page: number; filters?: Partial<UserState['filters']> }>(
      pipe(
        switchMap(({ page, filters }) => {
          const newFilters = { ...store.filters(), ...filters };
          patchState(store, { loading: true, error: null, page, filters: newFilters });
          return userService.getUsers(page - 1, store.pageSize(), newFilters).pipe(
            tap((response: any) => {
              patchState(store, {
                users: response.content,
                total: response.totalElements,
                loading: false
              });
            }),
            catchError((error: any) => {
              patchState(store, {
                error: error?.message || 'Failed to load users',
                loading: false
              });
              return EMPTY;
            })
          );
        })
      )
    ),

    updateUser: rxMethod<{ id: number; request: UpdateUserRequest }>(
      pipe(
        switchMap(({ id, request }) => {
          patchState(store, { loading: true, error: null });
          return userService.updateUser(id, request).pipe(
            tap((updated: any) => {
              patchState(store, {
                users: store.users().map(u => u.id === id ? updated : u),
                loading: false
              });
            }),
            catchError((error: any) => {
              patchState(store, {
                error: error?.message || 'Failed to update user',
                loading: false
              });
              return EMPTY;
            })
          );
        })
      )
    ),

    toggleEnabled: rxMethod<{ id: number; enabled: boolean }>(
      pipe(
        switchMap(({ id, enabled }) => {
          return userService.toggleEnabled(id, enabled).pipe(
            tap((updated: any) => {
              patchState(store, {
                users: store.users().map(u => u.id === id ? updated : u)
              });
            }),
            catchError((error: any) => {
              console.error('Toggle failed', error);
              return EMPTY;
            })
          );
        })
      )
    ),

    deleteUser: rxMethod<number>(
      pipe(
        switchMap((id) => {
          return userService.deleteUser(id).pipe(
            tap((response: any) => {
              patchState(store, {
                users: store.users().filter(u => u.id !== id),
                total: store.total() - 1
              });
            }),
            catchError((error: any) => {
              console.error('Delete failed', error);
              return EMPTY;
            })
          );
        })
      )
    )
  }))
);
