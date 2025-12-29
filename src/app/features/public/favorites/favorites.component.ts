import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteStore } from '../../../store/favorites/favorite.store';
import { PropertyCardComponent } from '../../../shared/components/property-card/property-card.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { CardComponent } from '../../../shared/ui/card/card.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, PropertyCardComponent, PaginationComponent, CardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          My Favorites
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          {{ store.total() }} {{ store.total() === 1 ? 'property' : 'properties' }} saved
        </p>
      </div>

      <!-- Loading -->
      @if (store.loading()) {
        <div class="flex justify-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }

      <!-- Error -->
      @else if (store.error()) {
        <app-card>
          <div class="text-center py-8">
            <p class="text-red-600 dark:text-red-400">{{ store.error() }}</p>
          </div>
        </app-card>
      }

      <!-- Favorites Grid -->
      @else if (store.favorites().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (property of store.favorites(); track property.id) {
            <app-property-card 
              [property]="property" 
              [showGallery]="true"
              [showFavorite]="true"
            />
          }
        </div>

        <!-- Pagination -->
        @if (store.total() > store.pageSize()) {
          <app-pagination
            [currentPage]="store.page()"
            [totalItems]="store.total()"
            [itemsPerPage]="store.pageSize()"
            (pageChange)="onPageChange($event)"
            class="mt-8"
          />
        }
      }

      <!-- Empty State -->
      @else {
        <div class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No favorites yet</h3>
          <p class="mt-2 text-gray-500 dark:text-gray-400">Start adding properties to your favorites to see them here.</p>
        </div>
      }
    </div>
  `,
  styles: ``
})
export class FavoritesComponent {
  store = inject(FavoriteStore);

  ngOnInit() {
    this.store.loadFavorites({ page: 0, pageSize: 10 });
  }

  onPageChange(page: number) {
    this.store.loadFavorites({ page, pageSize: 10 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
