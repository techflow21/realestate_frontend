import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property } from '../models/property.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/favorites`;

  addToFavorites(propertyId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add-favorite/${propertyId}`, {});
  }

  removeFromFavorites(propertyId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-favorite/${propertyId}`);
  }

  getUserFavorites(page: number, size: number): Observable<{ content: Property[]; totalElements: number }> {
    const params = { page: page.toString(), size: size.toString() };
    return this.http.get<any>(`${this.apiUrl}/my-favorites`, { params });
  }

  isFavorite(propertyId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check/${propertyId}`);
  }
}
