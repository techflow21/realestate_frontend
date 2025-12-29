import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent, FontAwesomeModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          (click)="close()"
        ></div>

        <!-- Modal -->
        <div class="flex min-h-screen items-center justify-center p-4">
          <div 
            [class]="'relative bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all w-full max-h-[90vh] overflow-y-auto ' + getMaxWidthClass()"
            (click)="$event.stopPropagation()"
          >
            <!-- Header -->
            <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ title }}
              </h3>
              <button
                (click)="close()"
                class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <fa-icon [icon]="['fas', 'times']" class="h-5 w-5" />
              </button>
            </div>

            <!-- Content -->
            <div class="p-4">
              <ng-content />
            </div>

            <!-- Footer -->
            @if (showFooter) {
              <div class="flex justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700">
                <ng-content select="[slot='footer']" />
                @if (!hasCustomFooter) {
                  <app-button variant="outline" (click)="close()">
                    Cancel
                  </app-button>
                  <app-button 
                    [disabled]="disableConfirm"
                    (click)="confirm.emit()"
                  >
                    {{ confirmText }}
                  </app-button>
                }
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host ::ng-deep .modal-enter {
      opacity: 0;
      transform: scale(0.95);
    }
    :host ::ng-deep .modal-enter-active {
      opacity: 1;
      transform: scale(1);
      transition: opacity 200ms, transform 200ms;
    }
    :host ::ng-deep .modal-exit {
      opacity: 1;
      transform: scale(1);
    }
    :host ::ng-deep .modal-exit-active {
      opacity: 0;
      transform: scale(0.95);
      transition: opacity 200ms, transform 200ms;
    }
  `]
})
export class ModalComponent {
  @Input() title = '';
  @Input() confirmText = 'Confirm';
  @Input() showFooter = true;
  @Input() disableConfirm = false;
  @Input() size: ModalSize = 'lg';
  @Input() hasCustomFooter = false;
  
  @Output() openChange = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<void>();
  
  isOpen = signal(false);

  constructor(library: FaIconLibrary) {
    library.addIcons(faTimes);
  }

  getMaxWidthClass(): string {
    const sizes = {
      sm: 'max-w-md',
      md: 'max-w-2xl',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl'
    };
    return sizes[this.size];
  }

  open() {
    this.isOpen.set(true);
    this.openChange.emit(true);
  }

  close() {
    this.isOpen.set(false);
    this.openChange.emit(false);
  }
}
