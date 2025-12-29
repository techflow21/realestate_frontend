import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUpload, faTrash, faImage } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <div class="space-y-4">
      <!-- Preview -->
      @if (previewUrls().length > 0) {
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          @for (url of previewUrls(); track url) {
            <div class="relative group">
              <img [src]="getImageUrl(url)" class="w-full h-24 object-cover rounded" />
              <button
                type="button"
                (click)="removePreview(url)"
                class="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <fa-icon [icon]="['fas', 'trash']" />
              </button>
            </div>
          }
        </div>
      }

      <!-- Upload Area -->
      <label
        class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
      >
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <fa-icon [icon]="['fas', 'upload']" class="text-gray-400 text-2xl mb-2" />
          <p class="mb-2 text-sm text-gray-500">
            <span class="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p class="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          class="hidden"
          (change)="onFilesSelected($event)"
        />
      </label>

      <!-- Info -->
      @if (files().length > 0) {
        <div class="text-sm text-gray-600">
          {{ files().length }} file(s) selected
        </div>
      }
    </div>
  `,
  styles: ``
})
export class ImageUploadComponent {
  @Input() existingImages: string[] = [];
  @Output() filesChange = new EventEmitter<File[]>();
  @Output() removeExisting = new EventEmitter<string>();

  files = signal<File[]>([]);
  previewUrls = signal<string[]>([...this.existingImages]);

  constructor(library: FaIconLibrary) {
    library.addIcons(faUpload, faTrash, faImage);
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    
    const newFiles = Array.from(input.files);
    this.files.update(f => [...f, ...newFiles]);
    
    // Generate previews
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrls.update(urls => [...urls, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    
    this.filesChange.emit(this.files());
    input.value = ''; // Reset
  }

  removePreview(url: string) {
    if (this.existingImages.includes(url)) {
      this.removeExisting.emit(url);
      this.previewUrls.update(urls => urls.filter(u => u !== url));
    } else {
      const index = this.previewUrls().indexOf(url);
      if (index >= 0) {
        this.files.update(files => files.filter((_, i) => i !== index));
        this.previewUrls.update(urls => urls.filter(u => u !== url));
        this.filesChange.emit(this.files());
      }
    }
  }
  
  getImageUrl(imagePath: string): string {
    // If it's a data URL or already starts with http, return as is
    if (imagePath?.startsWith('data:') || imagePath?.startsWith('http')) {
      return imagePath;
    }
    // Otherwise, prepend the backend URL
    return `${environment.apiUrl}${imagePath?.startsWith('/') ? '' : '/'}${imagePath}`;
  }
}
