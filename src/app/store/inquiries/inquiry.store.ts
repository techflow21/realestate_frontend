import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { InquiryService } from '../../core/services/inquiry.service';
import { InquiryResponse } from '../../core/models/inquiry.model';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';

interface InquiryState {
  myInquiries: InquiryResponse[];
  receivedInquiries: InquiryResponse[];
  loading: boolean;
  error: string | null;
  myTotal: number;
  receivedTotal: number;
  page: number;
  pageSize: number;
}

const initialState: InquiryState = {
  myInquiries: [],
  receivedInquiries: [],
  loading: false,
  error: null,
  myTotal: 0,
  receivedTotal: 0,
  page: 0,
  pageSize: 10
};

export const InquiryStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, inquiryService = inject(InquiryService)) => ({
    loadMyInquiries: rxMethod<{ page?: number; pageSize?: number }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ page = 0, pageSize = 10 }) =>
          inquiryService.getMyInquiries(page, pageSize).pipe(
            tap((response) => {
              patchState(store, {
                myInquiries: response.content,
                myTotal: response.totalElements,
                page,
                pageSize,
                loading: false
              });
            }),
            catchError((error) => {
              patchState(store, { 
                loading: false, 
                error: error.message || 'Failed to load inquiries' 
              });
              return of(null);
            })
          )
        )
      )
    ),

    loadReceivedInquiries: rxMethod<{ page?: number; pageSize?: number }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ page = 0, pageSize = 10 }) =>
          inquiryService.getReceivedInquiries(page, pageSize).pipe(
            tap((response) => {
              patchState(store, {
                receivedInquiries: response.content,
                receivedTotal: response.totalElements,
                page,
                pageSize,
                loading: false
              });
            }),
            catchError((error) => {
              patchState(store, { 
                loading: false, 
                error: error.message || 'Failed to load inquiries' 
              });
              return of(null);
            })
          )
        )
      )
    ),

    updateStatus: rxMethod<{ inquiryId: number; status: string }>(
      pipe(
        switchMap(({ inquiryId, status }) =>
          inquiryService.updateInquiryStatus(inquiryId, status).pipe(
            tap((updated) => {
              // Update the inquiry in the receivedInquiries list
              patchState(store, {
                receivedInquiries: store.receivedInquiries().map(inq => 
                  inq.id === inquiryId ? updated : inq
                )
              });
            }),
            catchError((error) => {
              console.error('Failed to update inquiry status:', error);
              return of(null);
            })
          )
        )
      )
    )
  }))
);
