import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="space-y-4">
      <!-- Main Image -->
      <div class="relative rounded-lg overflow-hidden shadow-lg bg-gray-100">
        @if (images.length > 0) {
          <img 
            [src]="images[currentIndex]" 
            alt="Property image {{ currentIndex + 1 }}"
            class="w-full h-96 object-cover"
          />
          
          <!-- Navigation Buttons -->
          @if (images.length > 1) {
            <button
              (click)="previous()"
              class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <fa-icon [icon]="['fas', 'arrow-left']" />
            </button>
            <button
              (click)="next()"
              class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <fa-icon [icon]="['fas', 'arrow-right']" />
            </button>
            
            <!-- Indicator -->
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
              {{ currentIndex + 1 }} / {{ images.length }}
            </div>
          }
        } @else {
          <div class="w-full h-96 flex items-center justify-center text-gray-400">
            No images available
          </div>
        }
      </div>

      <!-- Thumbnails -->
      @if (images.length > 1) {
        <div class="grid grid-cols-4 gap-2">
          @for (image of images; track image; let i = $index) {
            <button
              (click)="currentIndex = i"
              [class.ring-2]="i === currentIndex"
              [class.ring-blue-500]="i === currentIndex"
              class="relative rounded overflow-hidden hover:opacity-80 transition-opacity"
            >
              <img 
                [src]="image" 
                alt="Thumbnail {{ i + 1 }}"
                class="w-full h-16 object-cover"
              />
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: ``
})
export class ImageGalleryComponent {
  @Input() images: string[] = [];
  currentIndex = 0;
  
  constructor(library: FaIconLibrary) {
    library.addIcons(faArrowLeft, faArrowRight);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  previous() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
}
