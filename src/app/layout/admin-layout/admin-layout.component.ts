import { Component, signal, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { AuthStore } from '../../store/auth/auth.store';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faBell, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, ThemeToggleComponent, FontAwesomeModule],
  template: `
    <div class="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <!-- Sidebar - Fixed -->
      <app-sidebar [isOpen]="sidebarOpen" (toggle)="toggleSidebar()" />

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Admin Top Bar -->
        <header class="bg-white dark:bg-gray-800 shadow-md h-16 flex items-center justify-between px-4 md:px-6 z-10">
          <!-- Left: Menu Toggle -->
          <button (click)="toggleSidebar()"
            class="md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2"
          >
            <fa-icon [icon]="['fas', 'bars']" class="text-xl" />
          </button>

          <a href="/"><div class="hidden md:block text-lg font-semibold text-gray-800 dark:text-white">
            Home
          </div></a>

          <!-- Right: User Info & Actions -->
          <div class="flex items-center space-x-4">
            <!-- Theme Toggle -->
            <app-theme-toggle />

            <!-- Notifications -->
            <button class="relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2">
              <fa-icon [icon]="['fas', 'bell']" class="text-xl" />
              <span class="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            <!-- User Menu -->
            <div class="relative">
              <button
                (click)="toggleUserMenu()"
                class="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {{ getUserInitials() }}
                </div>
                <div class="hidden md:block text-left">
                  <div class="text-sm font-medium">{{ authStore.userName() }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Administrator</div>
                </div>
              </button>

              <!-- Dropdown Menu -->
              @if (userMenuOpen()) {
                <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50">
                  <a href="#"
                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <fa-icon [icon]="['fas', 'user']" class="mr-2" />
                    Profile
                  </a>
                  <button (click)="logout()"
                    class="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <fa-icon [icon]="['fas', 'sign-out-alt']" class="mr-2" />
                    Logout
                  </button>
                </div>
              }
            </div>
          </div>
        </header>

        <!-- Main Content with proper padding for top bar -->
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
          <div class="max-w-7xl mx-auto">
            <router-outlet />
          </div>
        </main>
      </div>
    </div>

    <!-- Mobile Sidebar Overlay -->
    @if (sidebarOpen()) {
      <div
        (click)="toggleSidebar()"
        class="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
      ></div>
    }
  `,
  styles: ``
})
export class AdminLayoutComponent {
  protected authStore = inject(AuthStore);
  private router = inject(Router);
  
  sidebarOpen = signal(false);
  userMenuOpen = signal(false);

  constructor(library: FaIconLibrary) {
    library.addIcons(faBars, faBell, faUser, faSignOutAlt);
  }

  toggleSidebar() {
    this.sidebarOpen.update(val => !val);
  }

  toggleUserMenu() {
    this.userMenuOpen.update(val => !val);
  }

  getUserInitials(): string {
    const user = this.authStore.user();
    if (!user) return 'A';
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || 'A';
  }

  logout() {
    this.authStore.logout();
    this.router.navigate(['/auth/login']);
  }
}
