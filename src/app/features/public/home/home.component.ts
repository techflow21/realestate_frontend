import { Component, inject, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PropertyStore } from '../../../store/properties/property.store';
import { PropertyCardComponent } from '../../../shared/components/property-card/property-card.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { CardComponent } from '../../../shared/ui/card/card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PropertyCardComponent, PaginationComponent, ButtonComponent, CardComponent],
  template: `
    <div class="min-h-screen">
      <!-- Hero Section -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-4xl font-bold mb-6">
            Find Your Dream Home
          </h1>
          <p class="text-xl mb-6">
            Explore thousands of properties for sale and rent
          </p>
        </div>
      </div>

      <!-- Features Section -->
      <div class="bg-gray-50 dark:bg-gray-900 py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-4xl mb-4">🏠</div>
              <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Wide Selection</h3>
              <p class="text-gray-600 dark:text-gray-400">Browse thousands of properties</p>
            </div>
            <div class="text-center">
              <div class="text-4xl mb-4">🔍</div>
              <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Easy Search</h3>
              <p class="text-gray-600 dark:text-gray-400">Find your perfect home quickly</p>
            </div>
            <div class="text-center">
              <div class="text-4xl mb-4">💼</div>
              <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Expert Support</h3>
              <p class="text-gray-600 dark:text-gray-400">Professional assistance available</p>
            </div>
          </div>
        </div>
      </div>


      <!-- Properties Listing -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
              Available Properties
            </h2>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              {{ store.total() }} properties found
            </p>
          </div>
          <app-button (click)="resetFilters()" variant="outline">
            Reset Filters
          </app-button>
        </div>

        <!-- Filters -->
        <app-card class="mb-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keyword</label>
              <input [value]="filters().keyword"
                (input)="updateFilter('keyword', $any($event.target).value)"
                type="text" placeholder="Address, city..."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min Price</label>
              <input
                [value]="filters().minPrice ?? ''"
                (input)="updateFilter('minPrice', $any($event.target).value ? +$any($event.target).value : null)"
                type="number"
                placeholder="0"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Price</label>
              <input
                [value]="filters().maxPrice ?? ''"
                (input)="updateFilter('maxPrice', $any($event.target).value ? +$any($event.target).value : null)"
                type="number"
                placeholder="1000000"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bedrooms</label>
              <select
                [value]="filters().bedrooms ?? ''"
                (change)="updateFilter('bedrooms', $any($event.target).value ? +$any($event.target).value : null)"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                <option value="">Any</option>
                @for (n of [1,2,3,4,5]; track n) {
                  <option [value]="n">{{ n }}+</option>
                }
              </select>
            </div>
          </div>
        </app-card>
        
        @if (store.loading()) {
          <div class="flex justify-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        } @else if (store.properties().length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-2 mb-8">
            @for (property of store.properties(); track property.id) {
              <app-property-card 
                [property]="property" 
                [showGallery]="true"
                [showFavorite]="true"
              />
            }
          </div>

          <app-pagination [currentPage]="store.page()"
            [totalItems]="store.total()"
            [itemsPerPage]="store.pageSize()"
            (pageChange)="onPageChange($event)"
            class="mt-8" />
        } @else {
          <div class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2M7 21h10" />
            </svg>
            <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">No properties found</h3>
            <p class="mt-1 text-gray-500 dark:text-gray-400">Try adjusting your search filters.</p>
          </div>
        }
      </div>

    </div>
  `,
  styles: ``
})
export class HomeComponent implements OnInit {
  store = inject(PropertyStore);
  private router = inject(Router);
  
  filters = this.store.filters;
  
  ngOnInit() {
    this.loadProperties(0);
  }

  loadProperties(page: number) {
    this.store.loadProperties({ page });
  }

  onPageChange(page: number) {
    this.loadProperties(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateFilter(key: string, value: any) {
    const newFilters = { ...this.filters(), [key]: value };
    this.store.loadProperties({ page: 0, filters: newFilters });
  }

  resetFilters() {
    this.store.resetFilters();
    this.loadProperties(0);
  }
}
