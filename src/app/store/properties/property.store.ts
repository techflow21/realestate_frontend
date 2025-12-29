import { Injectable, inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, EMPTY, Observable } from 'rxjs';
import { Property, PropertyRequest } from '../../core/models/property.model';
import { PropertyService } from '../../core/services/property.service';

type PropertyState = {
  properties: Property[];
  featured: Property[];
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  total: number;
  filters: {
    keyword: string;
    active: boolean | null;
    minPrice: number | null;
    maxPrice: number | null;
    bedrooms: number | null;
    startDate: Date | null;
    endDate: Date | null;
    sort: string;
  };
};

const initialState: PropertyState = {
  properties: [],
  featured: [],
  loading: false,
  error: null,
  page: 1,
  pageSize: 20,
  total: 0,
  filters: {
    keyword: '',
    active: true,
    minPrice: null,
    maxPrice: null,
    bedrooms: null,
    startDate: null,
    endDate: null,
    sort: 'createdAt,desc'
  }
};

export const PropertyStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, propertyService = inject(PropertyService)) => ({
    // Public: Load featured properties
    loadFeatured: rxMethod<void>(
      pipe(
        switchMap(() => {
          patchState(store, { loading: true, error: null });
          return propertyService.getFeaturedProperties().pipe(
            tap((properties: any) => {
              patchState(store, {
                featured: properties,
                loading: false
              });
            }),
            catchError((error: any) => {
              patchState(store, {
                error: error?.message || 'Failed to load featured properties',
                loading: false
              });
              return EMPTY;
            })
          );
        })
      )
    ),

    // Public: Load paginated properties (with filters)
    loadProperties: rxMethod<{ page: number; filters?: Partial<PropertyState['filters']>; pageSize?: number }>(
      pipe(
        switchMap(({ page, filters, pageSize }) => {
          const newFilters = { ...store.filters(), ...filters };
          const newPageSize = pageSize ?? store.pageSize();
          patchState(store, {
            loading: true,
            error: null,
            page,
            pageSize: newPageSize,
            filters: newFilters
          });

          // Build params (convert from 1-based to 0-based for API)
          const params: any = {
            page: page - 1,
            size: newPageSize,
            sort: newFilters.sort
          };

          // Add filters (skip nulls)
          if (newFilters.keyword) params.keyword = newFilters.keyword;
          if (newFilters.active !== null) params.active = newFilters.active;
          if (newFilters.minPrice) params.minPrice = newFilters.minPrice;
          if (newFilters.maxPrice) params.maxPrice = newFilters.maxPrice;
          if (newFilters.bedrooms) params.bedrooms = newFilters.bedrooms;
          if (newFilters.startDate) params.startDate = newFilters.startDate.toISOString();
          if (newFilters.endDate) params.endDate = newFilters.endDate.toISOString();

          return propertyService.getAdminProperties(params).pipe(
            tap((response: any) => {
              patchState(store, {
                properties: response.content,
                total: response.totalElements,
                loading: false
              });
            }),
            catchError((error: any) => {
              patchState(store, {
                error: error?.message || 'Failed to load properties',
                loading: false
              });
              return EMPTY;
            })
          );
        })
      )
    ),

    // Admin: Create property with images
    createProperty: (request: PropertyRequest): Observable<Property> => {
      patchState(store, { loading: true, error: null });
      return propertyService.createProperty(request).pipe(
        tap((property: any) => {
          // Optimistically add to list
          patchState(store, {
            properties: [property, ...store.properties()],
            total: store.total() + 1,
            loading: false
          });
        }),
        catchError((error: any) => {
          patchState(store, {
            error: error?.message || 'Failed to create property',
            loading: false
          });
          throw error;
        })
      );
    },

    // Admin: Update property
    updateProperty: rxMethod<{ id: number; request: PropertyRequest }>(
      pipe(
        switchMap(({ id, request }) => {
          patchState(store, { loading: true, error: null });
          return propertyService.updateProperty(id, request).pipe(
            tap((updated: any) => {
              patchState(store, {
                properties: store.properties().map(p => p.id === id ? updated : p),
                loading: false
              });
            }),
            catchError((error: any) => {
              patchState(store, {
                error: error?.message || 'Failed to update property',
                loading: false
              });
              return EMPTY;
            })
          );
        })
      )
    ),

    // Admin: Toggle active status
    toggleActive: rxMethod<{ id: number; active: boolean }>(
      pipe(
        switchMap(({ id }) => {
          return propertyService.toggleActive(id).pipe(
            tap((updated: any) => {
              patchState(store, {
                properties: store.properties().map(p => p.id === id ? updated : p)
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

    // Admin: Delete property
    deleteProperty: rxMethod<number>(
      pipe(
        switchMap((id) => {
          return propertyService.deleteProperty(id).pipe(
            tap((response: any) => {
              patchState(store, {
                properties: store.properties().filter(p => p.id !== id),
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
    ),

    // Reset filters
    resetFilters: () => {
      patchState(store, {
        filters: initialState.filters
      });
    }
  }))
);
