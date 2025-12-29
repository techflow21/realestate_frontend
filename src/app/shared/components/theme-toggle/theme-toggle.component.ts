import { Component, inject, computed } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <button
      (click)="toggle()"
      class="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      [title]="'Toggle theme: ' + currentIconTitle()"
    >
      <fa-icon [icon]="currentIcon()" [class]="currentIconClass()" />
    </button>
  `,
  styles: ``
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);
  private library = inject(FaIconLibrary);

  constructor() {
    this.library.addIcons(faSun, faMoon);
  }

  protected readonly currentIcon = computed(() => {
    const theme = this.themeService.currentTheme();
    return theme === 'dark' ? faMoon : faSun;
  });

  protected readonly currentIconClass = computed(() => {
    const theme = this.themeService.currentTheme();
    return theme === 'dark' ? 'text-yellow-400' : 'text-gray-700';
  });

  protected readonly currentIconTitle = computed(() => {
    const theme = this.themeService.currentTheme();
    return theme === 'dark' ? 'Dark mode' : 'Light mode';
  });

  toggle() {
    this.themeService.toggleTheme();
  }
}
