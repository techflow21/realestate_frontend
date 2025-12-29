import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div class="text-center">
        <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">403</h1>
        <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Unauthorized Access
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          You don't have permission to access this page.
        </p>
        <a routerLink="/">
          <app-button>Go Home</app-button>
        </a>
      </div>
    </div>
  `,
  styles: ``
})
export class UnauthorizedComponent {}
