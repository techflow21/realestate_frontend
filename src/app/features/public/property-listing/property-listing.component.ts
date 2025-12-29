import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyStore } from '../../../store/properties/property.store';
import { PropertyCardComponent } from '../../../shared/components/property-card/property-card.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { CardComponent } from '../../../shared/ui/card/card.component';

@Component({
  selector: 'app-property-listing',
  standalone: true,
  imports: [CommonModule, PropertyCardComponent, PaginationComponent, ButtonComponent, CardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Properties for Sale</h1>
          <p class="mt-2 text-gray-600">
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Keyword</label>
            <input
              [value]="filters().keyword"
              (input)="updateFilter('keyword', $any($event.target).value)"
              type="text"
              placeholder="Address, city..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
            <input
              [value]="filters().minPrice ?? ''"
              (input)="updateFilter('minPrice', $any($event.target).value ? +$any($event.target).value : null)"
              type="number"
              placeholder="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
            <input
              [value]="filters().maxPrice ?? ''"
              (input)="updateFilter('maxPrice', $any($event.target).value ? +$any($event.target).value : null)"
              type="number"
              placeholder="1000000"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
            <select
              [value]="filters().bedrooms ?? ''"
              (change)="updateFilter('bedrooms', $any($event.target).value ? +$any($event.target).value : null)"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any</option>
              <option *ngFor="let n of [1,2,3,4,5]" [value]="n">{{ n }}+</option>
            </select>
          </div>
        </div>
      </app-card>

      <!-- Results -->
      @if (store.loading()) {
        <div class="flex justify-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      } @else {
        @if (store.properties().length === 0) {
          <div class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2M7 21h10" />
            </svg>
            <h3 class="mt-2 text-lg font-medium text-gray-900">No properties found</h3>
            <p class="mt-1 text-gray-500">Try adjusting your search filters.</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (property of store.properties(); track property.id) {
              <app-property-card [property]="property" />
            }
          </div>

          <app-pagination
            [currentPage]="store.page()"
            [totalItems]="store.total()"
            [itemsPerPage]="store.pageSize()"
            (pageChange)="onPageChange($event)"
            class="mt-8"
          />
        }
      }
    </div>
  `,
  styles: ``
})
export class PropertyListingComponent {
  protected store = inject(PropertyStore);

  filters = this.store.filters;

  ngOnInit() {
    this.loadProperties(1);
  }

  loadProperties(page: number) {
    this.store.loadProperties({ page });
  }

  onPageChange(page: number) {
    this.loadProperties(page);
  }

  updateFilter(key: string, value: any) {
    const newFilters = { ...this.filters(), [key]: value };
    this.store.loadProperties({ page: 1, filters: newFilters });
  }

  resetFilters() {
    this.store.resetFilters();
    this.loadProperties(1);
  }
}
