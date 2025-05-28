import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>(this.getInitialTheme());
  theme$: Observable<Theme> = this.themeSubject.asObservable();
  private readonly THEME_KEY = 'app-theme';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.applyTheme(this.themeSubject.value);
    }
  }

  private getInitialTheme(): Theme {
    if (!this.isBrowser) return 'light';
    
    // Check for stored preference first
    const storedTheme = localStorage.getItem(this.THEME_KEY) as Theme | null;
    if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
      return storedTheme;
    }
    
    // Check for system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  }

  getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  toggleTheme(): void {
    const newTheme = this.themeSubject.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    if (this.themeSubject.value !== theme) {
      this.themeSubject.next(theme);
      
      if (this.isBrowser) {
        localStorage.setItem(this.THEME_KEY, theme);
        this.applyTheme(theme);
      }
    }
  }

  private applyTheme(theme: Theme): void {
    if (!this.isBrowser) return;
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
} 