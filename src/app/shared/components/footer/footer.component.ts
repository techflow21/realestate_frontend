import { Component, inject, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-gray-800 dark:bg-gray-900 text-white mt-auto transition-colors duration-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- About -->
          <div>
            <h3 class="text-lg font-bold mb-4">RealEstate</h3>
            <p class="text-gray-400 dark:text-gray-300 text-sm">
              Your trusted partner in finding the perfect property. 
              Browse thousands of listings and find your dream home today.
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-bold mb-4">Quick Links</h3>
            <ul class="space-y-2 text-sm">
              <li><a routerLink="/" class="text-gray-400 dark:text-gray-300 hover:text-white">Home</a></li>
              <li><a routerLink="/properties" class="text-gray-400 dark:text-gray-300 hover:text-white">Properties</a></li>
              <li><a routerLink="/about" class="text-gray-400 dark:text-gray-300 hover:text-white">About Us</a></li>
              <li><a routerLink="/contact" class="text-gray-400 dark:text-gray-300 hover:text-white">Contact</a></li>
            </ul>
          </div>

          <!-- Categories -->
          <div>
            <h3 class="text-lg font-bold mb-4">Categories</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="text-gray-400 dark:text-gray-300 hover:text-white">Apartments</a></li>
              <li><a href="#" class="text-gray-400 dark:text-gray-300 hover:text-white">Houses</a></li>
              <li><a href="#" class="text-gray-400 dark:text-gray-300 hover:text-white">Villas</a></li>
              <li><a href="#" class="text-gray-400 dark:text-gray-300 hover:text-white">Commercial</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h3 class="text-lg font-bold mb-4">Contact Us</h3>
            <ul class="space-y-2 text-sm text-gray-400 dark:text-gray-300">
              <li>123 Real Estate St.</li>
              <li>City, State 12345</li>
              <li>Phone: (555) 123-4567</li>
              <li>Email: info&#64;realestate.com</li>
            </ul>
          </div>
        </div>

        <!-- Copyright -->
        <div class="border-t border-gray-700 dark:border-gray-600 mt-8 pt-8 text-center text-sm text-gray-400 dark:text-gray-300">
          <p>&copy; {{ currentYear }} RealEstate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: ``
})
export class FooterComponent {
  private themeService = inject(ThemeService);
  currentYear = new Date().getFullYear();
  
  constructor() {
    // Ensure footer responds to theme changes
    effect(() => {
      this.themeService.currentTheme();
      // This effect will re-run when theme changes
    });
  }
}
