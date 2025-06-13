import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../theme-toggle.component';

@Component({
  selector: 'app-mobile-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeToggleComponent],
  template: `
    <div class="flex flex-col h-screen bg-background dark:bg-background-dark transition-colors duration-300">
      <!-- Mobile Header -->
      <header class="mobile-header sticky top-0 z-30 glass-effect">
        <div class="flex items-center">
          <h1 class="text-xl font-bold text-gray-800 dark:text-white">My Tasks</h1>
          <span class="ml-2 px-2 py-0.5 text-xs bg-accent/10 dark:bg-accent-dark/20 text-accent dark:text-accent-light rounded-full">v1.3.0</span>
        </div>
        <div class="flex items-center space-x-3">
          <app-theme-toggle></app-theme-toggle>
          <button routerLink="/profile" class="btn-ghost p-2 text-lg rounded-full a11y-focus active-state">
            <i class="bi bi-person"></i>
          </button>
        </div>
      </header>
      
      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-4 pb-20 animate-fade-in">
        <ng-content></ng-content>
      </main>
      
      <!-- Bottom Navigation -->
      <nav class="mobile-bottom-nav fixed bottom-0 left-0 right-0 glass-effect py-1 z-40">
        <a routerLink="/app" 
           [routerLinkActiveOptions]="{exact: true}"
           routerLinkActive="active-nav-item" 
           class="mobile-nav-item text-gray-600 dark:text-gray-300">
          <i class="bi bi-list-check mobile-nav-icon"></i>
          <span class="mobile-nav-text">Tasks</span>
        </a>
        <a routerLink="/app/new" class="mobile-nav-item add-button">
          <div class="bg-accent dark:bg-accent-light text-white dark:text-gray-900 rounded-full p-3 shadow-md transform transition-transform hover:scale-110 active:scale-95">
            <i class="bi bi-plus-lg mobile-nav-icon mb-0"></i>
          </div>
        </a>
        <a routerLink="/app/chat" routerLinkActive="active-nav-item" class="mobile-nav-item text-gray-600 dark:text-gray-300">
          <i class="bi bi-chat-dots mobile-nav-icon"></i>
          <span class="mobile-nav-text">AI</span>
        </a>
        <a routerLink="/profile"
           routerLinkActive="active-nav-item"
           class="mobile-nav-item text-gray-600 dark:text-gray-300">
          <i class="bi bi-person mobile-nav-icon"></i>
          <span class="mobile-nav-text">Profile</span>
        </a>
      </nav>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    
    .mobile-header {
      @apply bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex justify-between items-center px-4 py-3 
             border-b border-gray-200 dark:border-gray-700 shadow-sm;
    }
    
    .mobile-bottom-nav {
      @apply bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex justify-around items-center py-1 px-2
             border-t border-gray-200 dark:border-gray-700 shadow-lg;
    }
    
    .mobile-nav-item {
      @apply flex flex-col items-center justify-center p-2 transition-colors duration-300;
    }
    
    .mobile-nav-icon {
      @apply text-xl mb-1 transition-transform duration-300;
    }
    
    .mobile-nav-text {
      @apply text-xs font-medium transition-colors duration-300;
    }
    
    .active-nav-item {
      @apply text-accent dark:text-accent-light font-medium;
    }
    
    .active-nav-item .mobile-nav-icon {
      @apply transform scale-110;
    }
    
    .add-button {
      @apply mt-[-20px];
    }
  `]
})
export class MobileLayoutComponent {} 