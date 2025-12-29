import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { AuthStore } from '../../../store/auth/auth.store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeToggleComponent],
  template: `
    <nav class="bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <a routerLink="/" class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              RealEstate
            </a>
          </div>

          <div class="hidden md:flex items-center space-x-4">
            <a routerLink="/" routerLinkActive="text-blue-600" [routerLinkActiveOptions]="{exact: true}" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2">
              Home
            </a>

            @if (isAuthenticated()) {
              <a routerLink="/favorites" routerLinkActive="text-blue-600" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2">
                Favorites
              </a>
              <a routerLink="/my-inquiries" routerLinkActive="text-blue-600" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2">
                My Inquiries
              </a>
              @if (isAdmin()) {
                <a routerLink="/admin/dashboard" routerLinkActive="text-blue-600" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2">
                  Dashboard
                </a>
              }
              <button (click)="logout()" 
                class="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2"
              >
                Logout
              </button>
            } @else {
              <a routerLink="/auth/login" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2">
                Login
              </a>
              <a routerLink="/auth/register" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Register
              </a>
            }
            
            <app-theme-toggle />
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden flex items-center">
            <button 
              (click)="mobileMenuOpen.set(!mobileMenuOpen())"
              class="text-gray-700 dark:text-gray-300 p-2"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      @if (mobileMenuOpen()) {
        <div class="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <a routerLink="/" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-blue-100 dark:bg-blue-900" [routerLinkActiveOptions]="{exact: true}" class="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              Home
            </a>
            @if (isAuthenticated()) {
              <a routerLink="/favorites" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-blue-100 dark:bg-blue-900" class="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Favorites
              </a>
              <a routerLink="/my-inquiries" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-blue-100 dark:bg-blue-900" class="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                My Inquiries
              </a>
              @if (isAdmin()) {
                <a routerLink="/admin/dashboard" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-blue-100 dark:bg-blue-900" class="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Dashboard
                </a>
              }
              <button 
                (click)="logout()" 
                class="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            } @else {
              <a routerLink="/auth/login" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-blue-100 dark:bg-blue-900" class="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Login
              </a>
              <a routerLink="/auth/register" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-blue-100 dark:bg-blue-900" class="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Register
              </a>
            }
          </div>
        </div>
      }
    </nav>
  `,
  styles: ``
})
export class NavbarComponent {
  private authStore = inject(AuthStore);
  private router = inject(Router);
  
  mobileMenuOpen = signal(false);
  isAuthenticated = this.authStore.isAuthenticated;
  isAdmin = this.authStore.isAdmin;

  logout() {
    this.authStore.logout();
    this.router.navigate(['/auth/login']);
  }
}
