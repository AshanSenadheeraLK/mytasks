import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../theme-toggle.component';

@Component({
  selector: 'app-mobile-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeToggleComponent],
  template: `
    <div class="flex flex-col h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200 overscroll-none">
      <!-- Modern mobile header with glass morphism -->
      <header [class.shadow-sm]="isScrolled" [class.z-20]="isScrolled" [class.z-30]="!isScrolled" class="sticky top-0 transition-all duration-200">
        <div class="py-3 px-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80">
          <div class="flex items-center justify-between">
            <!-- Logo with color gradient -->
            <div class="flex items-center gap-2">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark">
                <i class="bi bi-check2-all text-white text-lg"></i>
              </div>
              <span class="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">MY TASKS</span>
            </div>
            
            <!-- Action buttons -->
            <div class="flex items-center gap-2">
              <app-theme-toggle></app-theme-toggle>
              <button routerLink="/profile" class="w-9 h-9 flex items-center justify-center rounded-full text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary/30">
                <i class="bi bi-person text-xl"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Mobile search bar with animation -->
        <div *ngIf="!isScrolled" class="p-3 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md animate-fade-in border-b border-neutral-200/80 dark:border-neutral-800/80">
          <div class="relative">
            <i class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"></i>
            <input 
              type="search" 
              placeholder="Search tasks..." 
              class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800
                    text-neutral-700 dark:text-neutral-300
                    border border-transparent focus:border-primary dark:focus:border-primary-light 
                    focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary-light/20
                    focus:outline-none transition-all"
            />
          </div>
        </div>
      </header>
      
      <!-- Main content area with proper padding for bottom navigation -->
      <main class="flex-1 p-4 pb-28 overflow-y-auto custom-scrollbar">
        <ng-content></ng-content>
      </main>
      
      <!-- Modernized bottom navigation with floating action button -->
      <nav class="fixed bottom-0 left-0 right-0 z-40">
        <!-- Floating action button with enhanced animation -->
        <button routerLink="/app/new" 
                class="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full 
                      shadow-lg flex items-center justify-center
                      bg-gradient-to-r from-primary to-primary-dark text-white
                      transform hover:scale-105 active:scale-95 transition-all duration-200" 
                aria-label="Add new task">
          <i class="bi bi-plus-lg text-2xl"></i>
        </button>
        
        <!-- Bottom navigation bar with glass morphism -->
        <div class="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md 
                  border-t border-neutral-200/80 dark:border-neutral-800/80
                  shadow-[0_-1px_3px_rgba(0,0,0,0.05)]
                  dark:shadow-[0_-1px_3px_rgba(0,0,0,0.2)]">
          <div class="flex items-center justify-around py-1">
            <!-- Tasks button -->
            <a routerLink="/app" 
              [routerLinkActiveOptions]="{exact: true}"
              routerLinkActive="active-nav-item" 
              class="mobile-nav-item">
              <i class="bi bi-kanban mobile-nav-icon"></i>
              <span class="mobile-nav-text">Tasks</span>
            </a>
            
            <!-- Empty space for FAB button -->
            <div class="w-16"></div>
            
            <!-- Assistant button -->
            <a routerLink="/app/chat"
              routerLinkActive="active-nav-item"
              class="mobile-nav-item">
              <i class="bi bi-chat-text mobile-nav-icon"></i>
              <span class="mobile-nav-text">Chat</span>
            </a>
          </div>
        </div>
      </nav>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    
    .mobile-nav-item {
      @apply flex flex-col items-center justify-center py-2 px-6 
             text-neutral-500 dark:text-neutral-500 transition-all duration-200
             rounded-xl;
    }
    
    .mobile-nav-icon {
      @apply text-lg mb-1 transition-all duration-200;
    }
    
    .mobile-nav-text {
      @apply text-xs font-medium;
    }
    
    .active-nav-item {
      @apply text-primary dark:text-primary-light;
    }
    
    .active-nav-item .mobile-nav-icon {
      @apply scale-110 mb-0.5;
      text-shadow: 0 0 10px rgba(67, 97, 238, 0.3);
    }
    
    .custom-scrollbar {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    
    .custom-scrollbar::-webkit-scrollbar {
      display: none;
    }
    
    .overscroll-none {
      overscroll-behavior: none;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fade-in {
      animation: fadeIn 0.2s ease-out forwards;
    }
  `]
})
export class MobileLayoutComponent {
  isScrolled = false;
  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Update header style based on scroll position
    this.isScrolled = window.scrollY > 10;
  }
} 