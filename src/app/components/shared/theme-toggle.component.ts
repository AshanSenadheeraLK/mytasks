import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inline-flex items-center">
      <span class="mr-2 text-sm font-medium text-gray-700 dark:text-gray-200">Light</span>
      <button 
        [attr.aria-label]="'Switch to ' + (currentTheme === 'light' ? 'dark' : 'light') + ' mode'" 
        (click)="toggleTheme()"
        class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        [class.bg-gray-200]="currentTheme === 'light'"
        [class.bg-accent-dark]="currentTheme === 'dark'">
        <span 
          class="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-in-out"
          [class.translate-x-5]="currentTheme === 'dark'"
          [class.translate-x-0]="currentTheme === 'light'">
          <span 
            class="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-300"
            [class.opacity-0]="currentTheme === 'dark'"
            [class.opacity-100]="currentTheme === 'light'">
            <!-- Sun icon -->
            <svg class="h-3.5 w-3.5 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </span>
          <span 
            class="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-300"
            [class.opacity-100]="currentTheme === 'dark'"
            [class.opacity-0]="currentTheme === 'light'">
            <!-- Moon icon -->
            <svg class="h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </span>
        </span>
      </button>
      <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200">Dark</span>
    </div>
  `,
  styles: []
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
  currentTheme: Theme = 'light';
  private subscription: Subscription | null = null;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.subscription = this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
} 