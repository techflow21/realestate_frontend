import { Component, Input, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Property } from '../../../core/models/property.model';
import { FavoriteStore } from '../../../store/favorites/favorite.store';
import { AuthStore } from '../../../store/auth/auth.store';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <!-- Image Gallery -->
      <div class="relative h-64 bg-gray-200 dark:bg-gray-700 overflow-hidden group">
        @if (showGallery && property.images && property.images.length > 0) {
          <!-- Main Image -->
          <img
            [src]="property.images[currentImageIndex()]"
            [alt]="property.title"
            class="w-full h-full object-cover"
          />
          
          <!-- Gallery Controls -->
          @if (property.images.length > 1) {
            <div class="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                (click)="previousImage($event)"
                class="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
              >
                &lsaquo;
              </button>
              <button
                (click)="nextImage($event)"
                class="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
              >
                &rsaquo;
              </button>
            </div>
            
            <!-- Image Indicators -->
            <div class="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
              @for (img of property.images; track $index; let idx = $index) {
                <button
                  (click)="setImage($event, idx)"
                  [class]="idx === currentImageIndex() ? 'bg-white' : 'bg-white bg-opacity-50'"
                  class="w-2 h-2 rounded-full transition"
                ></button>
              }
            </div>
          }
        } @else if (property.coverImageUrl || (property.images && property.images.length > 0)) {
          <img
            [src]="property.coverImageUrl || property.images![0]"
            [alt]="property.title"
            class="w-full h-full object-cover"
          />
        } @else {
          <div class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        }
        
        <!-- Price Badge -->
        <div class="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
          ₦{{ property.price | number }}
        </div>

        <!-- Favorite Button -->
        @if (showFavorite && authStore.isAuthenticated()) {
          <button
            (click)="toggleFavorite($event)"
            class="absolute top-3 left-3 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
            [title]="isFavorite() ? 'Remove from favorites' : 'Add to favorites'"
          >
            <fa-icon 
              [icon]="['fas', 'heart']"
              [class]="isFavorite() ? 'text-red-500' : 'text-gray-400'"
              class="text-xl"
            />
          </button>
        }
        
        <!-- Gallery Badge -->
        @if (showGallery && property.images && property.images.length > 1) {
          <div class="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            &#128247; {{ property.images.length }}
          </div>
        }
      </div>

      <!-- Content -->
      <a [routerLink]="['/property', property.id]" class="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {{ property.title }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          &#128205; {{ property.address }}
        </p>
        <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          @if (property.bedrooms) {
            <span class="flex items-center">
              &#128719; {{ property.bedrooms }} beds
            </span>
          }
          @if (property.bathrooms) {
            <span class="flex items-center">
              &#128703; {{ property.bathrooms }} baths
            </span>
          }
          @if (property.areaSqft) {
            <span class="flex items-center">
              &#128207; {{ property.areaSqft }} sqft
            </span>
          }
        </div>
        
        <!-- View Details Button -->
        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span class="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
            View Details &rarr;
          </span>
        </div>
      </a>
    </div>
  `,
  styles: [`
    .line-clamp-1 {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class PropertyCardComponent {
  @Input({ required: true }) property!: Property;
  @Input() showGallery = false;
  @Input() showFavorite = false;
  
  private favoriteStore = inject(FavoriteStore);
  protected authStore = inject(AuthStore);
  private library = inject(FaIconLibrary);
  
  currentImageIndex = signal(0);
  
  constructor() {
    this.library.addIcons(faHeart);
  }
  
  ngOnInit() {
    if (this.showFavorite && this.authStore.isAuthenticated()) {
      this.favoriteStore.checkFavorite(this.property.id);
    }
  }
  
  isFavorite(): boolean {
    return this.favoriteStore.isFavorite(this.property.id);
  }
  
  toggleFavorite(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (!this.authStore.isAuthenticated()) {
      return;
    }
    
    if (this.isFavorite()) {
      this.favoriteStore.removeFromFavorites(this.property.id);
    } else {
      this.favoriteStore.addToFavorites(this.property.id);
    }
  }
  
  previousImage(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.property.images && this.property.images.length > 0) {
      this.currentImageIndex.update(idx => 
        idx === 0 ? this.property.images!.length - 1 : idx - 1
      );
    }
  }
  
  nextImage(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.property.images && this.property.images.length > 0) {
      this.currentImageIndex.update(idx => 
        idx === this.property.images!.length - 1 ? 0 : idx + 1
      );
    }
  }
  
  setImage(event: Event, index: number) {
    event.preventDefault();
    event.stopPropagation();
    this.currentImageIndex.set(index);
  }
}
