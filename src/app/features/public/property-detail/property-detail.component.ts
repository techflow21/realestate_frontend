import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { InquiryService } from '../../../core/services/inquiry.service';
import { Property } from '../../../core/models/property.model';
import { ImageGalleryComponent } from '../../../shared/components/image-gallery/image-gallery.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { FavoriteStore } from '../../../store/favorites/favorite.store';
import { AuthStore } from '../../../store/auth/auth.store';
import { NotificationService } from '../../../shared/components/notification/notification.service';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { take, finalize } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  faBed, 
  faBath, 
  faRulerCombined,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faUser,
  faHeart
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ImageGalleryComponent, ButtonComponent, CardComponent, FontAwesomeModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      } @else if (property()) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Gallery -->
          <app-image-gallery [images]="getImageUrls()" class="lg:col-span-2" />

          <!-- Info -->
          <div class="space-y-6">
            <div>
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ property()!.title }}</h1>
                  <p class="mt-2 text-xl text-blue-600 dark:text-blue-400 font-semibold">
                    ₦{{ property()!.price | number }}
                  </p>
                  <div class="mt-2 flex items-center text-gray-600 dark:text-gray-400">
                    <fa-icon [icon]="['fas', 'map-marker-alt']" class="mr-1" />
                    <span>{{ property()!.address }}</span>
                  </div>
                </div>
                @if (authStore.isAuthenticated()) {
                  <button
                    (click)="toggleFavorite()"
                    class="ml-4 p-3 rounded-full bg-gray-100 dark:bg-gray-700 hover:scale-110 transition-transform"
                    [title]="isFavorite() ? 'Remove from favorites' : 'Add to favorites'"
                  >
                    <fa-icon 
                      [icon]="['fas', 'heart']"
                      [class]="isFavorite() ? 'text-red-500' : 'text-gray-400'"
                      class="text-2xl"
                    />
                  </button>
                }
              </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-4">
              @if (property()!.bedrooms) {
                <div class="text-center">
                  <div class="text-blue-600 dark:text-blue-400">
                    <fa-icon [icon]="['fas', 'bed']" class="text-xl" />
                  </div>
                  <div class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {{ property()!.bedrooms }} Beds
                  </div>
                </div>
              }
              @if (property()!.bathrooms) {
                <div class="text-center">
                  <div class="text-blue-600 dark:text-blue-400">
                    <fa-icon [icon]="['fas', 'bath']" class="text-xl" />
                  </div>
                  <div class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {{ property()!.bathrooms }} Baths
                  </div>
                </div>
              }
              @if (property()!.areaSqft) {
                <div class="text-center">
                  <div class="text-blue-600 dark:text-blue-400">
                    <fa-icon [icon]="['fas', 'ruler-combined']" class="text-xl" />
                  </div>
                  <div class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {{ property()!.areaSqft | number }} sqft
                  </div>
                </div>
              }
            </div>

            <!-- Description -->
            <app-card>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Description</h3>
              <p class="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {{ property()!.description }}
              </p>
            </app-card>

            <!-- Contact -->
            <app-card>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Contact Agent</h3>
              <div class="space-y-3">
                <div class="flex items-center">
                  <fa-icon [icon]="['fas', 'user']" class="text-gray-400 mr-3" />
                  <span class="text-gray-700 dark:text-gray-300">
                    {{ property()!.ownerName }}
                  </span>
                </div>
              </div>
            </app-card>

            <!-- Inquiry Form -->
            <app-card>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Send Inquiry</h3>
              <form [formGroup]="inquiryForm" (ngSubmit)="submitInquiry()">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                    <input
                      formControlName="name"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                    <input
                      formControlName="email"
                      type="email"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone *</label>
                    <input
                      formControlName="phone"
                      type="tel"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      placeholder="+234 123 456 7890"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message *</label>
                    <textarea
                      formControlName="message"
                      rows="4"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      placeholder="I'm interested in this property..."
                    ></textarea>
                  </div>
                  <app-button 
                    type="submit" 
                    [disabled]="inquiryForm.invalid || submitting()"
                    class="w-full"
                  >
                    @if (submitting()) {
                      <span>Sending...</span>
                    } @else {
                      <span>Send Inquiry</span>
                    }
                  </app-button>
                </div>
              </form>
            </app-card>
          </div>
        </div>
      }
    </div>
  `,
  styles: ``
})
export class PropertyDetailComponent {
  private route = inject(ActivatedRoute);
  private propertyService = inject(PropertyService);
  private inquiryService = inject(InquiryService);
  private library = inject(FaIconLibrary);
  private favoriteStore = inject(FavoriteStore);
  private notificationService = inject(NotificationService);
  protected authStore = inject(AuthStore);

  property = signal<Property | null>(null);
  loading = signal(true);
  submitting = signal(false);
  
  inquiryForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required])
  });
  
  getImageUrls(): string[] {
    // Backend already returns full URLs
    return this.property()?.images || [];
  }

  constructor() {
    this.library.addIcons(faBed, faBath, faRulerCombined, faMapMarkerAlt, faPhone, faEnvelope, faUser, faHeart);
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.propertyService.getPropertyById(+id).subscribe({
        next: (prop) => {
          this.property.set(prop);
          this.loading.set(false);
          // Check if property is in favorites
          if (this.authStore.isAuthenticated()) {
            this.favoriteStore.checkFavorite(prop.id);
          }
        },
        error: () => {
          this.loading.set(false);
          // Handle error
        }
      });
    }
  }
  
  isFavorite(): boolean {
    const prop = this.property();
    return prop ? this.favoriteStore.isFavorite(prop.id) : false;
  }
  
  toggleFavorite() {
    const prop = this.property();
    if (!prop || !this.authStore.isAuthenticated()) {
      return;
    }
    
    if (this.isFavorite()) {
      this.favoriteStore.removeFromFavorites(prop.id);
    } else {
      this.favoriteStore.addToFavorites(prop.id);
    }
  }
  
  submitInquiry() {
    if (this.inquiryForm.invalid || this.submitting()) {
      return;
    }
    
    const prop = this.property();
    if (!prop) {
      return;
    }
    
    this.submitting.set(true);
    
    const formValue = this.inquiryForm.value;
    const request = {
      name: formValue.name!,
      email: formValue.email!,
      phone: formValue.phone!,
      message: formValue.message!
    };
    
    this.inquiryService.createInquiry(prop.id, request)
      .pipe(
        take(1),
        finalize(() => this.submitting.set(false))
      )
      .subscribe({
        next: () => {
          this.notificationService.success('Inquiry sent successfully!');
          this.inquiryForm.reset();
        },
        error: (error) => {
          this.notificationService.error(error?.error?.message || 'Failed to send inquiry');
        }
      });
  }
}
