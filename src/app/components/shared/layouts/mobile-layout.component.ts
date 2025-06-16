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
      <!-- Enhanced Mobile Header with frosted glass effect -->
      <header class="mobile-header sticky top-0 z-30">
        <div class="flex items-center">
          <div class="flex items-center">
            <i class="bi bi-check2-circle text-accent dark:text-accent-light text-xl mr-2"></i>
            <h1 class="text-xl font-bold text-gray-800 dark:text-white">My Tasks</h1>
            <span class="ml-2 px-2 py-0.5 text-xs bg-accent/10 dark:bg-accent-dark/20 text-accent dark:text-accent-light rounded-full">v2.0.0</span>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <app-theme-toggle></app-theme-toggle>
          <button routerLink="/profile" class="btn-ghost p-2 text-lg rounded-full a11y-focus active-state">
            <i class="bi bi-person"></i>
          </button>
          <a routerLink="/versions" class="btn-ghost p-2 text-lg rounded-full a11y-focus active-state">
            <i class="bi bi-box-arrow-up-right"></i>
          </a>
        </div>
      </header>
      
      <!-- Main Content with smooth animation -->
      <main class="flex-1 overflow-y-auto p-5 pb-24 animate-fade-in">
        <ng-content></ng-content>
      </main>
      
      <!-- Enhanced Bottom Navigation -->
      <nav class="mobile-bottom-nav">
        <a routerLink="/app" 
           [routerLinkActiveOptions]="{exact: true}"
           routerLinkActive="active-nav-item" 
           class="mobile-nav-item">
          <i class="bi bi-list-check mobile-nav-icon"></i>
          <span class="mobile-nav-text">Tasks</span>
        </a>
        <a routerLink="/app/new" class="mobile-nav-item add-button">
          <div class="bg-gradient-to-r from-accent to-blue-500 dark:from-accent-light dark:to-blue-400 text-white dark:text-gray-900 rounded-full p-3 shadow-lg transform transition-all duration-300 hover:scale-110 active:scale-95 pulse-subtle">
            <i class="bi bi-plus-lg mobile-nav-icon mb-0"></i>
          </div>
        </a>
        <a routerLink="/app/chat" routerLinkActive="active-nav-item" class="mobile-nav-item">
          <i class="bi bi-chat-dots mobile-nav-icon"></i>
          <span class="mobile-nav-text">AI</span>
        </a>
        <a routerLink="/profile"
           routerLinkActive="active-nav-item"
           class="mobile-nav-item">
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
      @apply bg-white/90 dark:bg-gray-900/90 backdrop-blur-md flex justify-between items-center px-5 py-4
             border-b border-gray-100 dark:border-gray-800 shadow-sm;
      animation: slideDown 0.5s ease-out;
    }
    
    .mobile-bottom-nav {
      @apply fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg 
             flex justify-around items-center py-2 px-3 border-t border-gray-100 dark:border-gray-800 
             shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.2)];
      animation: slideUp 0.5s ease-out;
      z-index: 40;
    }
    
    .mobile-nav-item {
      @apply flex flex-col items-center justify-center p-2 transition-colors duration-300
             text-gray-500 dark:text-gray-400 rounded-xl;
    }
    
    .mobile-nav-icon {
      @apply text-xl mb-1 transition-transform duration-300;
    }
    
    .mobile-nav-text {
      @apply text-xs font-medium transition-colors duration-300;
    }
    
    .active-nav-item {
      @apply text-accent dark:text-accent-light font-medium 
             bg-accent/10 dark:bg-accent-light/10 rounded-xl;
    }
    
    .active-nav-item .mobile-nav-icon {
      @apply transform scale-110;
    }
    
    .add-button {
      @apply mt-[-28px] focus:outline-none;
    }
    
    .pulse-subtle {
      animation: subtle-pulse 2s infinite;
    }
    
    @keyframes subtle-pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
      }
    }
    
    @keyframes slideDown {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes slideUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `]
})
export class MobileLayoutComponent {} 