import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../theme-toggle.component';

@Component({
  selector: 'app-tablet-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeToggleComponent],
  template: `
    <div class="flex h-screen bg-background dark:bg-background-dark transition-colors duration-200">
      <!-- Side navigation -->
      <aside class="w-16 h-screen flex flex-col items-center py-6 border-r border-border dark:border-border-dark
                    bg-white dark:bg-gray-900 sticky top-0 z-20 transition-all duration-300">
        <!-- Logo -->
        <div class="w-10 h-10 bg-primary dark:bg-primary-light rounded-lg flex items-center justify-center mb-8">
          <i class="bi bi-check2-all text-white dark:text-gray-900 text-xl"></i>
        </div>
        
        <!-- Navigation items -->
        <nav class="flex-1 w-full">
          <ul class="space-y-6 flex flex-col items-center">
            <li class="w-full flex justify-center">
              <a routerLink="/app" 
                 [routerLinkActiveOptions]="{exact: true}"
                 routerLinkActive="nav-active" 
                 class="nav-icon-link">
                <i class="bi bi-list-task"></i>
              </a>
            </li>
            <li class="w-full flex justify-center">
              <a routerLink="/app/new"
                 routerLinkActive="nav-active" 
                 class="nav-icon-link">
                <i class="bi bi-plus-circle"></i>
              </a>
            </li>
            <li class="w-full flex justify-center">
              <a routerLink="/app/chat"
                 routerLinkActive="nav-active" 
                 class="nav-icon-link">
                <i class="bi bi-chat-dots"></i>
              </a>
            </li>
          </ul>
        </nav>
        
        <!-- Profile & theme -->
        <div class="flex flex-col items-center space-y-4">
          <app-theme-toggle></app-theme-toggle>
          <a routerLink="/profile" routerLinkActive="nav-active" class="nav-icon-link">
            <i class="bi bi-person"></i>
          </a>
        </div>
      </aside>
      
      <!-- Main content area -->
      <div class="flex-1 flex flex-col">
        <!-- Header -->
        <header class="sticky top-0 z-10 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-border dark:border-border-dark shadow-sm">
          <div class="flex items-center justify-between px-6 h-14">
            <div class="flex items-center space-x-3">
              <h1 class="text-lg font-display font-bold text-gray-800 dark:text-gray-100">MYTASKS</h1>
              <span class="px-2 py-1 text-xs bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light rounded-full">v2.0.0</span>
            </div>
            
            <div class="relative w-96">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <i class="bi bi-search text-gray-400 dark:text-gray-500"></i>
              </div>
              <input type="search" class="search-input" placeholder="Search tasks...">
            </div>
            
            <div>
              <button class="btn btn-primary">
                <i class="bi bi-plus mr-1.5"></i>
                New Task
              </button>
            </div>
          </div>
        </header>
        
        <!-- Main content with improved scrolling -->
        <main class="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <ng-content></ng-content>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    
    .nav-icon-link {
      @apply w-10 h-10 flex items-center justify-center rounded-lg 
             text-gray-600 dark:text-gray-400 text-xl
             hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200;
    }
    
    .nav-active {
      @apply bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light;
    }
    
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
    }
    
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      @apply bg-gray-300 dark:bg-gray-700 rounded-full;
    }
  `]
})
export class TabletLayoutComponent {
  constructor() {}
} 