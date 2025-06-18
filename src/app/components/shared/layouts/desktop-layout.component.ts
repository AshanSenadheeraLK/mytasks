import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-desktop-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeToggleComponent],
  template: `
    <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex transition-colors duration-300">
      <!-- Sidebar navigation with modern design -->
      <aside class="w-72 h-screen sticky top-0 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 z-20 transition-all duration-300 flex flex-col">
        <!-- Logo section -->
        <div class="px-6 pt-6 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark">
              <i class="bi bi-check2-all text-white text-xl"></i>
            </div>
            <div class="font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">MY TASKS</div>
          </div>
        </div>
        
        <!-- Search box -->
        <div class="px-4 mt-1 mb-6">
          <div class="relative">
            <i class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"></i>
            <input 
              type="search" 
              placeholder="Search tasks..." 
              class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 
                    text-neutral-700 dark:text-neutral-300
                    border border-transparent focus:border-primary dark:focus:border-primary-light 
                    focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary-light/20
                    focus:outline-none transition-all"
            />
          </div>
        </div>
          
        <!-- Navigation links with improved hover and active states -->
        <nav class="flex-1 px-3 py-4 overflow-y-auto custom-scrollbar">
          <div class="space-y-1">
            <a routerLink="/app" routerLinkActive="bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light font-medium" 
              [routerLinkActiveOptions]="{exact: true}"
              class="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group">
              <i class="bi bi-kanban text-lg group-hover:text-primary dark:group-hover:text-primary-light"></i>
              <span>Dashboard</span>
            </a>
            
            <a routerLink="/app/new" routerLinkActive="bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light font-medium"
              class="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group">
              <i class="bi bi-plus-circle text-lg group-hover:text-primary dark:group-hover:text-primary-light"></i>
              <span>New Task</span>
            </a>
            
            <a routerLink="/app/chat" routerLinkActive="bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light font-medium"
              class="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group">
              <i class="bi bi-chat-text text-lg group-hover:text-primary dark:group-hover:text-primary-light"></i>
              <span>Assistant</span>
            </a>
          </div>

          <div class="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <h3 class="px-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-500 mb-3">Workspaces</h3>
            <div class="space-y-1">
              <a routerLink="/app/work" routerLinkActive="bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light font-medium"
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group">
                <i class="bi bi-briefcase text-lg group-hover:text-primary dark:group-hover:text-primary-light"></i>
                <span>Work</span>
              </a>
              
              <a routerLink="/app/personal" routerLinkActive="bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light font-medium"
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group">
                <i class="bi bi-house text-lg group-hover:text-primary dark:group-hover:text-primary-light"></i>
                <span>Personal</span>
              </a>
            </div>
          </div>
        </nav>
        
        <!-- User profile and theme toggle -->
        <div class="p-4 border-t border-neutral-200 dark:border-neutral-800">
          <div class="flex items-center justify-between">
            <a routerLink="/profile" class="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <div class="w-8 h-8 rounded-full bg-primary/20 dark:bg-primary-light/20 flex items-center justify-center text-primary dark:text-primary-light">
                <i class="bi bi-person"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">User Profile</div>
                <div class="text-xs text-neutral-500 dark:text-neutral-500">View settings</div>
              </div>
            </a>
            <app-theme-toggle></app-theme-toggle>
          </div>
        </div>
      </aside>
      
      <!-- Main content area with modern header -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Header with subtle shadow and frosted glass effect -->
        <header class="sticky top-0 z-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
          <div class="flex items-center justify-between h-16 px-6">
            <!-- Page title with breadcrumb -->
            <div>
              <h1 class="text-xl font-bold text-neutral-800 dark:text-neutral-100">My Tasks</h1>
              <div class="text-sm text-neutral-500 dark:text-neutral-500 flex items-center gap-1">
                <span>Dashboard</span>
                <i class="bi bi-chevron-right text-xs"></i>
                <span>All Tasks</span>
              </div>
            </div>
            
            <!-- Action buttons -->
            <div class="flex items-center gap-3">
              <button class="btn-outline flex items-center gap-2 py-2 px-4 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900 transition-colors">
                <i class="bi bi-filter"></i>
                <span>Filter</span>
              </button>
              <button class="btn-primary flex items-center gap-2 py-2 px-4 text-sm rounded-lg">
                <i class="bi bi-plus"></i>
                <span>New Task</span>
              </button>
            </div>
          </div>
        </header>
        
        <!-- Main content area with padding and smooth animation -->
        <main class="flex-1 p-6 animate-fade-in overflow-auto custom-scrollbar">
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
    
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
    }
    
    .custom-scrollbar::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: var(--neutral-300);
      border-radius: 9999px;
    }
    
    .dark .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: var(--neutral-700);
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: var(--neutral-400);
    }
    
    .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: var(--neutral-600);
    }
    
    /* Define variables for scrollbar colors */
    :host {
      --scrollbar-track: transparent;
      --scrollbar-thumb: var(--neutral-300);
    }
    
    :host-context(.dark) {
      --scrollbar-thumb: var(--neutral-700);
    }
    
    .btn-outline {
      border: 1px solid var(--neutral-300);
      color: var(--neutral-700);
      background-color: white;
      transition: all 0.2s;
    }
    
    .btn-outline:hover {
      border-color: var(--neutral-400);
      color: var(--neutral-900);
    }
    
    .dark .btn-outline {
      border-color: var(--neutral-700);
      color: var(--neutral-300);
      background-color: var(--neutral-900);
    }
    
    .dark .btn-outline:hover {
      border-color: var(--neutral-600);
      color: var(--neutral-100);
    }
  `]
})
export class DesktopLayoutComponent {
  constructor(private authService: AuthService) {}
}