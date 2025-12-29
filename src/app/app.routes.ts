import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';
import { roleGuard } from './core/auth/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./features/public/home/home.component').then(m => m.HomeComponent) },
      // { 
      //   path: 'properties', 
      //   loadComponent: () => import('./features/public/property-listing/property-listing.component').then(m => m.PropertyListingComponent) 
      // },
      { 
        path: 'property/:id', 
        loadComponent: () => import('./features/public/property-detail/property-detail.component').then(m => m.PropertyDetailComponent) 
      },
      { 
        path: 'favorites', 
        canActivate: [authGuard],
        loadComponent: () => import('./features/public/favorites/favorites.component').then(m => m.FavoritesComponent) 
      },
      { 
        path: 'my-inquiries', 
        canActivate: [authGuard],
        loadComponent: () => import('./features/inquiries/my-inquiries/my-inquiries.component').then(m => m.MyInquiriesComponent) 
      }
    ]
  },
  {
    path: 'auth',
    component: DefaultLayoutComponent,
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN'])],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      {
        path: 'properties',
        children: [
          { path: '', loadComponent: () => import('./features/admin/properties/property-list/property-list.component').then(m => m.PropertyListComponent) },
          { path: 'new', loadComponent: () => import('./features/admin/properties/property-form/property-form.component').then(m => m.PropertyFormComponent) },
          { path: ':id/edit', loadComponent: () => import('./features/admin/properties/property-form/property-form.component').then(m => m.PropertyFormComponent) },
        ]
      },
      {
        path: 'users',
        children: [
          { path: '', loadComponent: () => import('./features/admin/users/user-list/user-list.component').then(m => m.UserListComponent) },
          { path: ':id/edit', loadComponent: () => import('./features/admin/users/user-form/user-form.component').then(m => m.UserFormComponent) },
        ]
      },
      {
        path: 'roles',
        children: [
          { 
            path: '', 
            loadComponent: () => import('./features/admin/roles/role-list/role-list.component').then(m => m.RoleListComponent) 
          }
        ]
      },
      {
        path: 'inquiries',
        children: [
          { 
            path: '', 
            loadComponent: () => import('./features/inquiries/received-inquiries/received-inquiries.component').then(m => m.ReceivedInquiriesComponent) 
          }
        ]
      }
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      { path: 'unauthorized', loadComponent: () => import('./features/errors/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent) },
      { path: '**', loadComponent: () => import('./features/errors/not-found/not-found.component').then(m => m.NotFoundComponent) }
    ]
  }
];
