import { Component, inject, computed, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { take, finalize } from 'rxjs';
import { PropertyStore } from '../../../../store/properties/property.store';
import { Property, PropertyRequest } from '../../../../core/models/property.model';
import { PropertyService } from '../../../../core/services/property.service';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { PropertyFormComponent } from '../property-form/property-form.component';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { environment } from '../../../../../environments/environment';
import { 
  faSearch, 
  faFilter, 
  faTrash, 
  faEdit, 
  faToggleOn, 
  faToggleOff,
  faDownload,
  faPlus
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent, PaginationComponent, FontAwesomeModule, DatePipe, ModalComponent, PropertyFormComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Properties Management</h1>
        <div class="flex space-x-3 mt-4 md:mt-0">
          <app-button variant="outline" (click)="exportCSV()">
            <fa-icon [icon]="['fas', 'download']" class="mr-2" />
            Export CSV
          </app-button>
          <app-button (click)="openAddModal()">
            <fa-icon [icon]="['fas', 'plus']" class="mr-2" />
            Add Property
          </app-button>
        </div>
      </div>

      <!-- Filters Card -->
      <app-card>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Keyword -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keyword</label>
            <div class="relative">
              <input
                [value]="filters().keyword"
                (input)="updateFilter('keyword', $any($event.target).value)"
                type="text"
                placeholder="Title, address..."
                class="w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <fa-icon [icon]="['fas', 'search']" class="text-gray-400" />
              </div>
            </div>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              [value]="filters().active ?? ''"
              (change)="updateFilter('active', parseBoolean($any($event.target).value))"
              class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <!-- Price Range -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Price Range
            </label>
            <div class="grid grid-cols-2 gap-2">
              <input
                [value]="filters().minPrice ?? ''"
                (input)="updateFilter('minPrice', parseNumber($any($event.target).value))"
                type="number"
                placeholder="Min"
                class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                [value]="filters().maxPrice ?? ''"
                (input)="updateFilter('maxPrice', parseNumber($any($event.target).value))"
                type="number"
                placeholder="Max"
                class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Date Range -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Created Date
            </label>
            <div class="grid grid-cols-2 gap-2">
              <input
                [value]="filters().startDate ? formatDate(filters().startDate!) : ''"
                (change)="onStartDateChange($any($event.target).value)"
                type="date"
                class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                [value]="filters().endDate ? formatDate(filters().endDate!) : ''"
                (change)="onEndDateChange($any($event.target).value)"
                type="date"
                class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Bedrooms -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bedrooms</label>
            <select
              [value]="filters().bedrooms ?? ''"
              (change)="updateFilter('bedrooms', parseNumber($any($event.target).value))"
              class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any</option>
              <option *ngFor="let n of [1,2,3,4,5,6]" [value]="n">
                {{ n }}+ Bedrooms
              </option>
            </select>
          </div>

          <!-- Actions -->
          <div class="flex items-end">
            <app-button 
              variant="outline" 
              (click)="resetFilters()" 
              class="w-full"
            >
              <fa-icon [icon]="['fas', 'filter']" class="mr-2" />
              Reset
            </app-button>
          </div>
        </div>
      </app-card>

      <!-- Results Summary -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <p class="text-sm text-gray-700 dark:text-gray-300">
          Showing <span class="font-medium">{{ startIndex() + 1 }}</span> to 
          <span class="font-medium">{{ endIndex() }}</span> of 
          <span class="font-medium">{{ store.total() }}</span> results
        </p>
        <div class="mt-2 md:mt-0">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Sort by:</label>
          <select
            [value]="filters().sort"
            (change)="onSortChange($any($event.target).value)"
            class="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="createdAt,desc">Newest First</option>
            <option value="createdAt,asc">Oldest First</option>
            <option value="price,desc">Price: High to Low</option>
            <option value="price,asc">Price: Low to High</option>
          </select>
        </div>
      </div>

      <!-- Properties Table -->
      <app-card>
        @if (store.loading()) {
          <div class="flex justify-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        } @else {
          <div class="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Property</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Owner</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                @for (property of store.properties(); track property.id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        @if (property.images && property.images.length > 0) {
                          <div class="flex-shrink-0 h-10 w-10">
                            <img [src]="property.images[0]" alt="Cover" class="h-10 w-10 rounded object-cover" />
                          </div>
                        }
                        <div [class.ml-4]="property.images && property.images.length > 0">
                          <div class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ property.title }}
                          </div>
                          <div class="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                            {{ property.address }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {{ '₦' + (property.price | number) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {{ property.ownerName }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      @if (property.status === 'Active') {
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          ACTIVE
                        </span>
                      } @else {
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                          INACTIVE
                        </span>
                      }
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {{ property.createdAt | date: 'short' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        (click)="toggleActive(property)"
                        class="mr-3 transform transition-all duration-200 hover:scale-110"
                        [title]="property.isActive ? 'Deactivate' : 'Activate'"
                      >
                        <fa-icon 
                          [icon]="['fas', property.isActive ? 'toggle-on' : 'toggle-off']" 
                          [class]="property.isActive ? 'text-green-500 text-2xl' : 'text-gray-400 text-2xl'" 
                        />
                      </button>
                      <button
                        (click)="openEditModal(property)"
                        class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3"
                      >
                        <fa-icon [icon]="['fas', 'edit']" />
                      </button>
                      <button
                        (click)="openDeleteModal(property)"
                        class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        <fa-icon [icon]="['fas', 'trash']" />
                      </button>
                    </td>
                  </tr>
                }
                @empty {
                  <tr>
                    <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No properties found
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <app-pagination
            [currentPage]="store.page()"
            [totalItems]="store.total()"
            [itemsPerPage]="store.pageSize()"
            (pageChange)="onPageChange($event)"
            class="mt-4"
          />
        }
      </app-card>

      <!-- Add Property Modal -->
      <app-modal
        #addModal
        title="Add New Property"
        [showFooter]="false"
      >
        <app-property-form
          #addForm
          (submit)="onPropertySubmit($event)"
          (onCancel)="closeAddModal()"
        />
      </app-modal>

      <!-- Edit Property Modal -->
      <app-modal
        #editModal
        title="Edit Property"
        [showFooter]="false"
      >
        @if (loadingPropertyDetails()) {
          <div class="flex justify-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        } @else {
          <app-property-form
            #editForm
            [property]="selectedProperty()"
            (submit)="onPropertyUpdate($event)"
            (onCancel)="closeEditModal()"
          />
        }
      </app-modal>

      <!-- Delete Confirmation Modal -->
      <app-modal
        #deleteModal
        title="Confirm Delete"
        size="sm"
        [hasCustomFooter]="true"
      >
        <div class="space-y-4">
          <p class="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete <strong class="text-red-600 dark:text-red-400">{{ propertyToDelete()?.title }}</strong>?
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            This action cannot be undone.
          </p>
        </div>
        <div slot="footer" class="flex justify-end space-x-3">
          <app-button variant="outline" (click)="closeDeleteModal()">
            Cancel
          </app-button>
          <app-button variant="danger" (click)="confirmDelete()">
            <fa-icon [icon]="['fas', 'trash']" class="mr-2" />
            Delete
          </app-button>
        </div>
      </app-modal>
    </div>
  `,
  styles: ``
})
export class PropertyListComponent {
  protected store = inject(PropertyStore);
  private router = inject(Router);
  private library = inject(FaIconLibrary);
  protected datePipe = inject(DatePipe);
  private propertyService = inject(PropertyService);
  private notificationService = inject(NotificationService);

  @ViewChild('addModal') addModal!: ModalComponent;
  @ViewChild('editModal') editModal!: ModalComponent;
  @ViewChild('deleteModal') deleteModal!: ModalComponent;
  @ViewChild('addForm') addForm!: PropertyFormComponent;
  @ViewChild('editForm') editForm!: PropertyFormComponent;
  
  private submitting = signal(false);
  private editSubmitting = signal(false);
  selectedProperty = signal<Property | null>(null);
  propertyToDelete = signal<Property | null>(null);
  loadingPropertyDetails = signal(false);

  constructor() {
    this.library.addIcons(faSearch, faFilter, faTrash, faEdit, faToggleOn, faToggleOff, faDownload, faPlus);
  }

  // Computed pagination values
  protected readonly startIndex = computed(() => this.store.page() * this.store.pageSize());
  protected readonly endIndex = computed(() => 
    Math.min(this.startIndex() + this.store.pageSize(), this.store.total())
  );

  // Filters signal (proxy to store)
  filters = this.store.filters;

  ngOnInit() {
    // Load all properties (both active and inactive) for admin
    this.loadProperties(0);
  }

  loadProperties(page: number) {
    // Override active filter to null to fetch all properties
    this.store.loadProperties({ page, pageSize: 10, filters: { active: null } });
  }

  onPageChange(page: number) {
    this.loadProperties(page);
  }

  onSortChange(value: string) {
    this.updateFilter('sort', value);
  }

  updateFilter(key: string, value: any) {
    const newFilters = { ...this.filters(), [key]: value };
    this.store.loadProperties({ page: 0, filters: newFilters, pageSize: 10 });
  }

  // Helper: Parse boolean from string
  parseBoolean(value: string): boolean | null {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return null;
  }

  // Helper: Parse number
  parseNumber(value: string): number | null {
    const num = Number(value);
    return isNaN(num) || value === '' ? null : num;
  }

  // Helper: Format date for input
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy') || '';
  }

  resetFilters() {
    this.store.resetFilters();
    this.loadProperties(0);
  }

  toggleActive(property: Property) {
    this.propertyService.toggleActive(property.id)
      .pipe(take(1))
      .subscribe({
        next: (updated) => {
          this.notificationService.success(
            `Property "${property.title}" ${updated.isActive ? 'activated' : 'deactivated'} successfully`
          );
          // Reload to sync with backend
          this.loadProperties(this.store.page());
        },
        error: (error) => {
          console.error('Toggle active failed:', error);
          this.notificationService.error('Failed to toggle property status');
        }
      });
  }

  openEditModal(property: Property) {
    this.loadingPropertyDetails.set(true);
    this.editModal.open();
    
    // Fetch full property details from API
    this.propertyService.getPropertyById(property.id)
      .pipe(
        take(1),
        finalize(() => this.loadingPropertyDetails.set(false))
      )
      .subscribe({
        next: (fullProperty) => {
          this.selectedProperty.set(fullProperty);
        },
        error: (error) => {
          console.error('Failed to load property details:', error);
          this.notificationService.error('Failed to load property details');
          this.closeEditModal();
        }
      });
  }

  closeEditModal() {
    this.editModal.close();
    this.selectedProperty.set(null);
  }

  openDeleteModal(property: Property) {
    this.propertyToDelete.set(property);
    this.deleteModal.open();
  }

  closeDeleteModal() {
    this.deleteModal.close();
    this.propertyToDelete.set(null);
  }

  confirmDelete() {
    const property = this.propertyToDelete();
    if (property) {
      this.propertyService.deleteProperty(property.id)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.notificationService.success(`Property "${property.title}" deleted successfully`);
            this.closeDeleteModal();
            // Reload properties to sync with backend
            this.loadProperties(this.store.page());
          },
          error: (error) => {
            console.error('Delete failed:', error);
            this.notificationService.error(error?.error?.message || 'Failed to delete property');
            this.closeDeleteModal();
          }
        });
    }
  }

  exportCSV() {
    // In real app: call API endpoint /api/admin/properties/export
    alert('CSV export triggered (backend integration needed)');
  }

  onStartDateChange(value: string) {
    this.updateFilter('startDate', value ? new Date(value) : null);
  }

  onEndDateChange(value: string) {
    this.updateFilter('endDate', value ? new Date(value) : null);
  }

  openAddModal() {
    this.addModal.open();
  }

  closeAddModal() {
    this.addModal.close();
  }

  onPropertySubmit(request: PropertyRequest) {
    console.log('onPropertySubmit called, already submitting?', this.submitting());
    
    // Prevent concurrent submissions
    if (this.submitting()) {
      console.log('Already submitting, ignoring duplicate call');
      return;
    }
    
    this.submitting.set(true);
    console.log('Starting property creation with request:', request);
    
    this.store.createProperty(request)
      .pipe(
        take(1),
        finalize(() => {
          console.log('Observable finalized, resetting states');
          this.submitting.set(false);
          // Always reset form submitting state when observable completes (success or error)
          if (this.addForm) {
            this.addForm.resetSubmitting();
          }
        })
      )
      .subscribe({
        next: (property) => {
          console.log('Property created successfully:', property);
          this.notificationService.success('Property created successfully!');
          this.closeAddModal();
          this.loadProperties(1);
        },
        error: (error) => {
          console.error('Property creation failed:', error);
          this.notificationService.error(error?.error?.message || 'Failed to create property');
          // Keep modal open for user to retry
        }
      });
  }

  onPropertyUpdate(request: PropertyRequest) {
    const property = this.selectedProperty();
    if (!property || this.editSubmitting()) {
      return;
    }
    
    this.editSubmitting.set(true);
    console.log('Starting property update with request:', request);
    
    // Call the property service directly to get Observable
    this.propertyService.updateProperty(property.id, request)
      .pipe(
        take(1),
        finalize(() => {
          this.editSubmitting.set(false);
          if (this.editForm) {
            this.editForm.resetSubmitting();
          }
        })
      )
      .subscribe({
        next: (updated) => {
          console.log('Property updated successfully:', updated);
          this.notificationService.success('Property updated successfully!');
          this.closeEditModal();
          // Reload properties to sync with backend
          this.loadProperties(this.store.page());
        },
        error: (error) => {
          console.error('Property update failed:', error);
          this.notificationService.error(error?.error?.message || 'Failed to update property');
          // Keep modal open for user to retry
        }
      });
  }
}
