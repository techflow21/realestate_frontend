import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { InquiryStore } from '../../../store/inquiries/inquiry.store';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { NotificationService } from '../../../shared/components/notification/notification.service';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faPhone, faHome, faCalendar, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-received-inquiries',
  standalone: true,
  imports: [CommonModule, CardComponent, PaginationComponent, ButtonComponent, FontAwesomeModule, DatePipe],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Received Inquiries
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          {{ store.receivedTotal() }} {{ store.receivedTotal() === 1 ? 'inquiry' : 'inquiries' }} received
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

      <!-- Inquiries List -->
      @else if (store.receivedInquiries().length > 0) {
        <div class="space-y-4">
          @for (inquiry of store.receivedInquiries(); track inquiry.id) {
            <app-card>
              <div class="space-y-4">
                <!-- Header -->
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <fa-icon [icon]="['fas', 'home']" class="mr-2 text-blue-600" />
                      {{ inquiry.propertyTitle }}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                      <fa-icon [icon]="['fas', 'calendar']" class="mr-2" />
                      {{ inquiry.createdAt | date: 'medium' }}
                    </p>
                  </div>
                  <span 
                    [class]="getStatusClass(inquiry.status)"
                    class="px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {{ inquiry.status }}
                  </span>
                </div>

                <!-- Sender Info -->
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div class="flex items-center mb-3">
                    <fa-icon [icon]="['fas', 'user']" class="mr-2 text-gray-600 dark:text-gray-400" />
                    <span class="font-medium text-gray-900 dark:text-white">{{ inquiry.name }}</span>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                      <fa-icon [icon]="['fas', 'envelope']" class="mr-2" />
                      <a [href]="'mailto:' + inquiry.email" class="text-blue-600 hover:underline dark:text-blue-400">
                        {{ inquiry.email }}
                      </a>
                    </div>
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                      <fa-icon [icon]="['fas', 'phone']" class="mr-2" />
                      <a [href]="'tel:' + inquiry.phone" class="text-blue-600 hover:underline dark:text-blue-400">
                        {{ inquiry.phone }}
                      </a>
                    </div>
                  </div>
                </div>

                <!-- Message -->
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message:</p>
                  <p class="text-gray-700 dark:text-gray-300">{{ inquiry.message }}</p>
                </div>

                <!-- Actions -->
                <div class="flex space-x-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  @if (inquiry.status === 'PENDING') {
                    <app-button size="sm" (click)="updateStatus(inquiry.id, 'CONTACTED')">
                      Mark as Contacted
                    </app-button>
                  }
                  @if (inquiry.status === 'CONTACTED') {
                    <app-button size="sm" (click)="updateStatus(inquiry.id, 'CLOSED')">
                      Mark as Closed
                    </app-button>
                  }
                  @if (inquiry.status === 'CLOSED') {
                    <app-button size="sm" variant="outline" (click)="updateStatus(inquiry.id, 'PENDING')">
                      Reopen
                    </app-button>
                  }
                </div>
              </div>
            </app-card>
          }
        </div>

        <!-- Pagination -->
        @if (store.receivedTotal() > store.pageSize()) {
          <app-pagination
            [currentPage]="store.page()"
            [totalItems]="store.receivedTotal()"
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No inquiries yet</h3>
          <p class="mt-2 text-gray-500 dark:text-gray-400">You haven't received any inquiries about your properties yet.</p>
        </div>
      }
    </div>
  `,
  styles: ``
})
export class ReceivedInquiriesComponent {
  store = inject(InquiryStore);
  private library = inject(FaIconLibrary);
  private notificationService = inject(NotificationService);

  constructor() {
    this.library.addIcons(faEnvelope, faPhone, faHome, faCalendar, faUser);
  }

  ngOnInit() {
    this.store.loadReceivedInquiries({ page: 0, pageSize: 10 });
  }

  onPageChange(page: number) {
    this.store.loadReceivedInquiries({ page, pageSize: 10 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateStatus(inquiryId: number, status: string) {
    this.store.updateStatus({ inquiryId, status });
    this.notificationService.success(`Inquiry status updated to ${status}`);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'CONTACTED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  }
}
