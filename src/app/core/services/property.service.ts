import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Property, PropertyRequest } from '../models/property.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api`;

  // ——— Public ———
  getProperties(
    page: number,
    size: number,
    filters: {
      keyword?: string;
      active?: boolean | null;
      minPrice?: number | null;
      maxPrice?: number | null;
      bedrooms?: number | null;
    }
  ): Observable<{ content: Property[]; totalElements: number }> {
    const params: any = {
      page,
      size,
      ...filters
    };
    // Clean nulls
    Object.keys(params).forEach(key => params[key] == null && delete params[key]);
    
    return this.http.get<any>(`${this.apiUrl}/properties/public`, { params }).pipe(
      map(res => ({
        content: res.content as Property[],
        totalElements: res.totalElements
      }))
    );
  }

  getFeaturedProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.apiUrl}/properties/public?size=6`);
  }

  getPropertyById(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.apiUrl}/properties/view-property/${id}`);
  }

  // ——— Admin ———
  createProperty(request: PropertyRequest): Observable<Property> {
    const formData = new FormData();
    
    // Build property object matching backend expectations
    const propertyData: any = {
      title: request.title,
      description: request.description,
      price: request.price,
      address: request.address,
      city: request.city,
      state: request.state,
      zipCode: request.zipCode,
      propertyType: request.propertyType,
      status: request.status
    };
    
    if (request.bedrooms !== undefined && request.bedrooms !== null) {
      propertyData.bedrooms = request.bedrooms;
    }
    if (request.bathrooms !== undefined && request.bathrooms !== null) {
      propertyData.bathrooms = request.bathrooms;
    }
    if (request.areaSqft !== undefined && request.areaSqft !== null) {
      propertyData.areaSqft = request.areaSqft;
    }
    
    // Send as 'property' not 'request' to match backend
    const propertyBlob = new Blob([JSON.stringify(propertyData)], { type: 'application/json' });
    formData.append('property', propertyBlob, 'property.json');

    // Add images array
    if (request.images && request.images.length > 0) {
      request.images.forEach((file) => {
        formData.append('images', file, file.name);
      });
    }

    return this.http.post<Property>(`${this.apiUrl}/properties/add-property`, formData);
  }

  updateProperty(id: number, request: PropertyRequest): Observable<Property> {
    const formData = new FormData();
    
    // Build property object matching backend expectations
    const propertyData: any = {
      title: request.title,
      description: request.description,
      price: request.price,
      address: request.address,
      city: request.city,
      state: request.state,
      zipCode: request.zipCode,
      propertyType: request.propertyType,
      status: request.status
    };
    
    if (request.bedrooms !== undefined && request.bedrooms !== null) {
      propertyData.bedrooms = request.bedrooms;
    }
    if (request.bathrooms !== undefined && request.bathrooms !== null) {
      propertyData.bathrooms = request.bathrooms;
    }
    if (request.areaSqft !== undefined && request.areaSqft !== null) {
      propertyData.areaSqft = request.areaSqft;
    }
    
    // Send as 'property' not 'request' to match backend
    const propertyBlob = new Blob([JSON.stringify(propertyData)], { type: 'application/json' });
    formData.append('property', propertyBlob, 'property.json');

    // Add new images array
    if (request.images && request.images.length > 0) {
      request.images.forEach((file) => {
        formData.append('images', file, file.name);
      });
    }
    
    // Add existing image URLs if provided
    if (request.existingImageUrls && request.existingImageUrls.length > 0) {
      const existingUrlsBlob = new Blob([JSON.stringify(request.existingImageUrls)], { type: 'application/json' });
      formData.append('existingImageUrls', existingUrlsBlob, 'existingImageUrls.json');
    }

    return this.http.put<Property>(`${this.apiUrl}/properties/update-property/${id}`, formData);
  }

  toggleActive(id: number): Observable<Property> {
    return this.http.put<Property>(`${this.apiUrl}/properties/toggle-active/${id}`, null);
  }

  deleteProperty(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/properties/delete-property/${id}`);
  }

  deletePropertyImages(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/properties/${id}/images`);
  }

  // Admin: Get properties with filters
  getAdminProperties(params: any): Observable<{ content: Property[]; totalElements: number }> {
    return this.http.get<any>(`${this.apiUrl}/properties`, { params }).pipe(
      map(res => ({
        content: res.content as Property[],
        totalElements: res.totalElements
      }))
    );
  }

  // Admin: Export properties to CSV
  exportProperties(filters: any): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/properties/export`, filters, {
      responseType: 'blob'
    });
  }
}
