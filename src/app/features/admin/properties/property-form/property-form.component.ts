import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { PropertyRequest } from '../../../../core/models/property.model';
import { ImageUploadComponent } from '../../../../shared/components/image-upload/image-upload.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ImageUploadComponent,
    ButtonComponent
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
          <input
            formControlName="title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            placeholder="Luxury Villa"
          />
        </div>

        <!-- Price -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price *</label>
          <input
            formControlName="price"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            placeholder="500000"
          />
        </div>

        <!-- Address -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address *</label>
          <input
            formControlName="address"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            placeholder="123 Main St"
          />
        </div>

        <!-- City -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City *</label>
          <input
            formControlName="city"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            placeholder="Lagos"
          />
        </div>

        <!-- State -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State *</label>
          <input
            formControlName="state"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            placeholder="Lagos"
          />
        </div>

        <!-- Zip Code -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Zip Code *</label>
          <input
            formControlName="zipCode"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            placeholder="100001"
          />
        </div>

        <!-- Property Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Property Type *</label>
          <select
            formControlName="propertyType"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="">Select Type</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Land">Land</option>
            <option value="Industrial">Industrial</option>
          </select>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status *</label>
          <select
            formControlName="status"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Sold">Sold</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <!-- Bedrooms -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bedrooms</label>
          <input
            formControlName="bedrooms"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>

        <!-- Bathrooms -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bathrooms</label>
          <input
            formControlName="bathrooms"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>

        <!-- Area -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Area (sqft)</label>
          <input
            formControlName="areaSqft"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>

        <!-- Description -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
          <textarea
            formControlName="description"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            placeholder="Describe the property..."
          ></textarea>
        </div>
      </div>

      <!-- Images -->
      <div class="mt-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Property Images</label>
        <app-image-upload
          [existingImages]="existingImageUrls()"
          (filesChange)="onFilesChange($event)"
          (removeExisting)="onRemoveExisting($event)"
        />
      </div>

      <!-- Actions -->
      <div class="mt-6 flex justify-end space-x-3">
        <app-button type="button" variant="outline" (click)="onCancel.emit()">
          Cancel
        </app-button>
        <app-button
          type="submit"
          [disabled]="form.invalid || isSubmitting()"
        >
          {{ property ? 'Update' : 'Save' }}
        </app-button>
      </div>
    </form>
  `,
  styles: ``
})
export class PropertyFormComponent {
  @Input() property: any;
  @Output() submit = new EventEmitter<PropertyRequest>();
  @Output() onCancel = new EventEmitter<void>();
  
  protected isSubmitting = signal(false);

  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required, Validators.min(1)]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    zipCode: new FormControl('', [Validators.required]),
    propertyType: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    bedrooms: new FormControl<number | null>(null),
    bathrooms: new FormControl<number | null>(null),
    areaSqft: new FormControl<number | null>(null),
  });

  files = signal<File[]>([]);
  existingImageUrls = signal<string[]>([]);

  ngOnInit() {
    if (this.property) {
      // Safely patch form values, handling missing fields
      this.form.patchValue({
        title: this.property.title || '',
        description: this.property.description || '',
        price: this.property.price || 0,
        address: this.property.address || '',
        city: this.property.city || '',
        state: this.property.state || '',
        zipCode: this.property.zipCode || '',
        propertyType: this.property.propertyType || '',
        status: this.property.status || '',
        bedrooms: this.property.bedrooms ?? null,
        bathrooms: this.property.bathrooms ?? null,
        areaSqft: this.property.areaSqft ?? null
      });
      // Safely handle images - could be null, undefined, or empty array
      const images = this.property.images || [];
      this.existingImageUrls.set(Array.isArray(images) ? images : []);
    }
  }

  onFilesChange(files: File[]) {
    this.files.set(files);
  }

  onRemoveExisting(url: string) {
    this.existingImageUrls.update(urls => urls.filter(u => u !== url));
  }

  onSubmit() {
    if (this.form.invalid || this.isSubmitting()) {
      return;
    }
    
    this.isSubmitting.set(true);
    
    const formValue = this.form.value;
    const request: PropertyRequest = {
      title: formValue.title!,
      description: formValue.description!,
      price: formValue.price!,
      address: formValue.address!,
      city: formValue.city!,
      state: formValue.state!,
      zipCode: formValue.zipCode!,
      propertyType: formValue.propertyType!,
      status: formValue.status!,
      bedrooms: formValue.bedrooms ?? undefined,
      bathrooms: formValue.bathrooms ?? undefined,
      areaSqft: formValue.areaSqft ?? undefined,
      images: this.files().length > 0 ? this.files() : undefined,
      existingImageUrls: this.existingImageUrls().length > 0 ? this.existingImageUrls() : undefined
    };

    this.submit.emit(request);
  }
  
  resetSubmitting() {
    this.isSubmitting.set(false);
  }
}
