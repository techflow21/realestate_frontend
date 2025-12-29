import { Component, signal, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faDashboard, 
  faHome, 
  faUsers, 
  faCog,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FontAwesomeModule],
  template: `
    <aside 
      [class]="sidebarClasses()"
      class="bg-gray-800 dark:bg-gray-900 text-white transition-transform duration-300 border-r border-gray-700"
    >
      <!-- Sidebar Header -->
      <div class="h-16 flex items-center justify-center border-b border-gray-700 px-4">
        <h2 class="text-xl font-bold text-blue-400">Admin Panel</h2>
      </div>

      <!-- Navigation Links -->
      <nav class="p-4 overflow-y-auto" style="height: calc(100vh - 4rem);">
        <ul class="space-y-2">
          <li>
            <a 
              routerLink="/admin/dashboard" 
              routerLinkActive="bg-blue-600"
              [routerLinkActiveOptions]="{exact: false}"
              (click)="onLinkClick()"
              class="flex items-center p-3 rounded-lg hover:bg-gray-700 transition cursor-pointer"
            >
              <fa-icon [icon]="['fas', 'dashboard']" class="mr-3 text-lg" />
              <span class="font-medium">Dashboard</span>
            </a>
          </li>
          <li>
            <a 
              routerLink="/admin/properties" 
              routerLinkActive="bg-blue-600"
              [routerLinkActiveOptions]="{exact: false}"
              (click)="onLinkClick()"
              class="flex items-center p-3 rounded-lg hover:bg-gray-700 transition cursor-pointer"
            >
              <fa-icon [icon]="['fas', 'home']" class="mr-3 text-lg" />
              <span class="font-medium">Properties</span>
            </a>
          </li>
          <li>
            <a 
              routerLink="/admin/users" 
              routerLinkActive="bg-blue-600"
              [routerLinkActiveOptions]="{exact: false}"
              (click)="onLinkClick()"
              class="flex items-center p-3 rounded-lg hover:bg-gray-700 transition cursor-pointer"
            >
              <fa-icon [icon]="['fas', 'users']" class="mr-3 text-lg" />
              <span class="font-medium">Users</span>
            </a>
          </li>
          <li>
            <a 
              routerLink="/admin/roles" 
              routerLinkActive="bg-blue-600"
              [routerLinkActiveOptions]="{exact: false}"
              (click)="onLinkClick()"
              class="flex items-center p-3 rounded-lg hover:bg-gray-700 transition cursor-pointer"
            >
              <fa-icon [icon]="['fas', 'cog']" class="mr-3 text-lg" />
              <span class="font-medium">Roles</span>
            </a>
          </li>
          <li>
            <a 
              routerLink="/admin/inquiries" 
              routerLinkActive="bg-blue-600"
              [routerLinkActiveOptions]="{exact: false}"
              (click)="onLinkClick()"
              class="flex items-center p-3 rounded-lg hover:bg-gray-700 transition cursor-pointer"
            >
              <fa-icon [icon]="['fas', 'envelope']" class="mr-3 text-lg" />
              <span class="font-medium">Inquiries</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  `,
  styles: ``
})
export class SidebarComponent {
  @Input() isOpen = signal(false);
  @Output() toggle = new EventEmitter<void>();

  constructor(library: FaIconLibrary) {
    library.addIcons(faDashboard, faHome, faUsers, faCog, faEnvelope);
  }

  sidebarClasses = () => {
    const base = 'fixed md:static top-0 left-0 h-screen w-64 z-40';
    return this.isOpen() 
      ? `${base} translate-x-0` 
      : `${base} -translate-x-full md:translate-x-0`;
  };

  onLinkClick() {
    // Close sidebar on mobile after clicking a link
    if (this.isOpen()) {
      this.toggle.emit();
    }
  }
}
