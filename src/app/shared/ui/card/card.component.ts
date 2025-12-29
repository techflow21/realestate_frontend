import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      @if (title) {
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ title }}
        </h3>
      }
      <ng-content />
    </div>
  `,
  styles: ``
})
export class CardComponent {
  @Input() title?: string;
}
