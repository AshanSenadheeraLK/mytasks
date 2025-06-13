import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../theme-toggle.component';

@Component({
  selector: 'app-mobile-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeToggleComponent],
  template: `
    <div class="flex flex-col h-screen bg-background dark:bg-background-dark">
      <!-- Mobile Header -->
      <header class="mobile-header border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">My Tasks</h1>
          <span class="ml-2 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-primary dark:text-blue-200 rounded-full">v1.3.0</span>
        </div>
        <div class="flex items-center space-x-3">
          <app-theme-toggle></app-theme-toggle>
          <button routerLink="/profile" class="btn btn-secondary p-2 text-lg">
            <i class="bi bi-person"></i>
          </button>
        </div>
      </header>
      
      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-3 pb-20">
        <ng-content></ng-content>
      </main>
      
      <!-- Bottom Navigation -->
      <nav class="mobile-bottom-nav border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <a routerLink="/app" 
           [routerLinkActiveOptions]="{exact: true}"
           routerLinkActive="active-nav-item" 
           class="mobile-nav-item text-gray-600 dark:text-gray-300">
          <i class="bi bi-list-check mobile-nav-icon"></i>
          <span class="mobile-nav-text">Tasks</span>
        </a>
        <a routerLink="/app/new" class="mobile-nav-item add-button">
          <div class="bg-accent text-white rounded-full p-2.5 shadow-md">
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
      @apply bg-white dark:bg-gray-800 flex justify-between items-center px-4 py-3 sticky top-0 z-10;
    }
    
    .mobile-bottom-nav {
      @apply fixed bottom-0 left-0 right-0 flex justify-around items-center py-1 px-2 z-10;
    }
    
    .mobile-nav-item {
      @apply flex flex-col items-center justify-center p-2;
    }
    
    .mobile-nav-icon {
      @apply text-xl mb-1 transition-transform;
    }
    
    .mobile-nav-text {
      @apply text-xs font-medium;
    }
    
    .active-nav-item {
      @apply text-accent dark:text-accent-light font-medium;
    }
    
    .active-nav-item .mobile-nav-icon {
      transform: scale(1.1);
    }
    
    .add-button {
      margin-top: -20px;
    }
  `]
})
export class MobileLayoutComponent {} 