import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InquiryRequest, InquiryResponse } from '../models/inquiry.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InquiryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/inquiries`;

  createInquiry(propertyId: number, request: InquiryRequest): Observable<InquiryResponse> {
    return this.http.post<InquiryResponse>(`${this.apiUrl}/create-inquiry/${propertyId}`, request);
  }

  getInquiriesForProperty(propertyId: number, page: number, size: number): Observable<{ content: InquiryResponse[]; totalElements: number }> {
    const params = { page: page.toString(), size: size.toString() };
    return this.http.get<any>(`${this.apiUrl}/get-inquiries/${propertyId}`, { params });
  }

  getMyInquiries(page: number, size: number): Observable<{ content: InquiryResponse[]; totalElements: number }> {
    const params = { page: page.toString(), size: size.toString() };
    return this.http.get<any>(`${this.apiUrl}/my-inquiries`, { params });
  }

  getReceivedInquiries(page: number, size: number): Observable<{ content: InquiryResponse[]; totalElements: number }> {
    const params = { page: page.toString(), size: size.toString() };
    return this.http.get<any>(`${this.apiUrl}/received-inquiries`, { params });
  }

  updateInquiryStatus(inquiryId: number, status: string): Observable<InquiryResponse> {
    return this.http.patch<InquiryResponse>(`${this.apiUrl}/update-status/${inquiryId}?status=${status}`, {});
  }
}
