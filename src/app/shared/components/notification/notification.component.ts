import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from './notification.service';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes, faCheckCircle, faExclamationCircle, faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      @for (notification of notificationService.notifications(); track notification.id) {
        <div 
          [class]="getNotificationClasses(notification.type)"
          class="flex items-start p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out"
        >
          <div class="flex-shrink-0">
            @switch (notification.type) {
              @case ('success') {
                <fa-icon [icon]="['fas', 'check-circle']" class="h-5 w-5" />
              }
              @case ('error') {
                <fa-icon [icon]="['fas', 'exclamation-circle']" class="h-5 w-5" />
              }
              @case ('warning') {
                <fa-icon [icon]="['fas', 'exclamation-triangle']" class="h-5 w-5" />
              }
              @case ('info') {
                <fa-icon [icon]="['fas', 'info-circle']" class="h-5 w-5" />
              }
            }
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium">{{ notification.message }}</p>
          </div>
          <button
            (click)="notificationService.dismiss(notification.id)"
            class="ml-4 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <fa-icon [icon]="['fas', 'times']" class="h-5 w-5" />
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class NotificationComponent {
  notificationService = inject(NotificationService);

  constructor(library: FaIconLibrary) {
    library.addIcons(faTimes, faCheckCircle, faExclamationCircle, faExclamationTriangle, faInfoCircle);
  }

  getNotificationClasses(type: string): string {
    const baseClasses = 'notification-enter';
    const typeClasses = {
      success: 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100',
      error: 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-100',
      warning: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      info: 'bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
    };
    return `${baseClasses} ${typeClasses[type as keyof typeof typeClasses] || typeClasses.info}`;
  }
}
