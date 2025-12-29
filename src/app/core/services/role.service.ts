import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Role {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class RoleService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/admin`;
  
  // Cache roles for 5 minutes
  private rolesCache: { data: Role[]; timestamp: number } | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  getRoles(): Observable<Role[]> {
    // Return from cache if valid
    if (this.rolesCache && Date.now() - this.rolesCache.timestamp < this.CACHE_DURATION) {
      return of(this.rolesCache.data);
    }

    return this.http.get<Role[]>(`${this.apiUrl}/roles`).pipe(
      tap(roles => {
        this.rolesCache = {
          data: roles,
          timestamp: Date.now()
        };
      })
    );
  }

  createRole(name: string): Observable<Role> {
    this.clearCache();
    return this.http.post<Role>(`${this.apiUrl}/create-role`, { name });
  }

  updateRole(id: number, name: string): Observable<Role> {
    this.clearCache();
    return this.http.put<Role>(`${this.apiUrl}/update-role/${id}`, { name });
  }

  deleteRole(id: number): Observable<void> {
    this.clearCache();
    return this.http.delete<void>(`${this.apiUrl}/delete-role/${id}`);
  }

  // Admin: Assign roles to user
  assignRolesToUser(userId: number, roleIds: number[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/users/${userId}/roles`, { roleIds });
  }

  // Clear cache when roles change
  clearCache() {
    this.rolesCache = null;
  }
}
