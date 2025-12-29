import { Component, Input, Output, EventEmitter, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, ButtonComponent, FontAwesomeModule],
  template: `
    <div class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6">
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700 dark:text-gray-300">
            Showing
            <span class="font-medium">{{ startIndex() + 1 }}</span>
            to
            <span class="font-medium">{{ endIndex() }}</span>
            of
            <span class="font-medium">{{ totalItems }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <app-button
              variant="outline"
              size="sm"
              [disabled]="currentPage === 0"
              (click)="goToPage(currentPage - 1)"
            >
              <fa-icon [icon]="['fas', 'chevron-left']" />
            </app-button>

            @for (page of pages(); track page) {
              @if (page === '...') {
                <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">...</span>
              } @else {
                <button
                  [class]="getPageButtonClass(page)"
                  (click)="goToPage(+page - 1)"
                >
                  {{ page }}
                </button>
              }
            }

            <app-button
              variant="outline"
              size="sm"
              [disabled]="currentPage >= totalPages() - 1"
              (click)="goToPage(currentPage + 1)"
            >
              <fa-icon [icon]="['fas', 'chevron-right']" />
            </app-button>
          </nav>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class PaginationComponent {
  @Input() currentPage = 0;
  @Input() totalItems = 0;
  @Input() itemsPerPage = 10;
  @Output() pageChange = new EventEmitter<number>();

  private library = inject(FaIconLibrary);

  constructor() {
    this.library.addIcons(faChevronLeft, faChevronRight);
  }

  protected readonly startIndex = computed(() => this.currentPage * this.itemsPerPage);
  protected readonly endIndex = computed(() => Math.min(this.startIndex() + this.itemsPerPage, this.totalItems));
  protected readonly totalPages = computed(() => Math.ceil(this.totalItems / this.itemsPerPage));

  protected readonly pages = computed(() => {
    const pages: (number | '...')[] = [];
    const total = this.totalPages();
    const current = this.currentPage + 1;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 4) pages.push('...');
      const start = Math.max(2, current - 2);
      const end = Math.min(total - 1, current + 2);
      for (let i = start; i <= end; i++) pages.push(i);
      if (current < total - 3) pages.push('...');
      pages.push(total);
    }
    return pages;
  });

  getPageButtonClass(page: number | string): string {
    const baseClass = 'relative inline-flex items-center px-4 py-2 text-sm font-medium border';
    const isActive = page === this.currentPage + 1;
    
    if (isActive) {
      return `${baseClass} bg-blue-600 text-white border-blue-600 hover:bg-blue-700`;
    }
    return `${baseClass} bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700`;
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages()) {
      this.pageChange.emit(page);
    }
  }
}
