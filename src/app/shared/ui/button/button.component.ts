import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <button
      [class]="classes()"
      [disabled]="_disabled()"
      (click)="onClick.emit($event)"
    >
      @if (icon) {
        <fa-icon [icon]="icon" class="mr-2" />
      }
      <ng-content />
    </button>
  `,
  styles: ``
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() set disabled(value: boolean) {
    this._disabled.set(value);
  }
  @Input() icon?: string;
  
  @Output() onClick = new EventEmitter<Event>();
  
  protected _disabled = signal(false);
  
  protected readonly classes = computed(() => {
    const base = 'font-medium rounded-lg transition-all focus:ring-2 focus:ring-offset-2';
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };
    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
      danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
      outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-blue-500'
    };
    return `${base} ${sizes[this.size]} ${variants[this.variant]}`;
  });
}
