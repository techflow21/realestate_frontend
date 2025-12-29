import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'theme-preference';
  
  // Only 'light' | 'dark'
  currentTheme = signal<'light' | 'dark'>('light');
  
  constructor() {
    this.loadTheme();
    this.applyTheme();
  }

  private loadTheme() {
    const saved = localStorage.getItem(this.STORAGE_KEY) as 'light' | 'dark' | null;
    this.currentTheme.set(saved || 'light');
  }

  toggleTheme() {
    const current = this.currentTheme();
    const next = current === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  setTheme(theme: 'light' | 'dark') {
    this.currentTheme.set(theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.applyTheme();
  }

  private applyTheme() {
    if (this.currentTheme() === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  getEffectiveTheme(): 'light' | 'dark' {
    return this.currentTheme();
  }
}
