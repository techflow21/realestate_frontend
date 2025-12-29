import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { FavoriteService } from '../../core/services/favorite.service';
import { Property } from '../../core/models/property.model';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';

interface FavoriteState {
  favorites: Property[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  favoriteIds: Set<number>;
}

const initialState: FavoriteState = {
  favorites: [],
  loading: false,
  error: null,
  total: 0,
  page: 0,
  pageSize: 10,
  favoriteIds: new Set<number>()
};

export const FavoriteStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, favoriteService = inject(FavoriteService)) => ({
    loadFavorites: rxMethod<{ page?: number; pageSize?: number }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ page = 0, pageSize = 10 }) =>
          favoriteService.getUserFavorites(page, pageSize).pipe(
            tap((response) => {
              const favoriteIds = new Set(response.content.map(p => p.id));
              patchState(store, {
                favorites: response.content,
                total: response.totalElements,
                page,
                pageSize,
                favoriteIds,
                loading: false
              });
            }),
            catchError((error) => {
              patchState(store, { 
                loading: false, 
                error: error.message || 'Failed to load favorites' 
              });
              return of(null);
            })
          )
        )
      )
    ),

    addToFavorites: rxMethod<number>(
      pipe(
        switchMap((propertyId) =>
          favoriteService.addToFavorites(propertyId).pipe(
            tap(() => {
              const favoriteIds = new Set(store.favoriteIds());
              favoriteIds.add(propertyId);
              patchState(store, { favoriteIds });
            }),
            catchError((error) => {
              console.error('Failed to add to favorites:', error);
              return of(null);
            })
          )
        )
      )
    ),

    removeFromFavorites: rxMethod<number>(
      pipe(
        switchMap((propertyId) =>
          favoriteService.removeFromFavorites(propertyId).pipe(
            tap(() => {
              const favoriteIds = new Set(store.favoriteIds());
              favoriteIds.delete(propertyId);
              patchState(store, { 
                favoriteIds,
                favorites: store.favorites().filter(p => p.id !== propertyId),
                total: Math.max(0, store.total() - 1)
              });
            }),
            catchError((error) => {
              console.error('Failed to remove from favorites:', error);
              return of(null);
            })
          )
        )
      )
    ),

    checkFavorite: rxMethod<number>(
      pipe(
        switchMap((propertyId) =>
          favoriteService.isFavorite(propertyId).pipe(
            tap((isFavorite) => {
              const favoriteIds = new Set(store.favoriteIds());
              if (isFavorite) {
                favoriteIds.add(propertyId);
              } else {
                favoriteIds.delete(propertyId);
              }
              patchState(store, { favoriteIds });
            }),
            catchError((error) => {
              console.error('Failed to check favorite status:', error);
              return of(null);
            })
          )
        )
      )
    ),

    isFavorite(propertyId: number): boolean {
      return store.favoriteIds().has(propertyId);
    }
  }))
);
