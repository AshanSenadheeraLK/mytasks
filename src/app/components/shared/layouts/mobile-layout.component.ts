import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../theme-toggle.component';

@Component({
  selector: 'app-mobile-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeToggleComponent],
  template: `
    <div class="flex flex-col h-screen">
      <!-- Mobile Header -->
      <header class="mobile-header">
        <div class="flex items-center">
          <h1 class="text-xl font-bold">My Tasks</h1>
          <span class="ml-2 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-blue-300 rounded-full">v1.3.</span>
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
      <nav class="mobile-bottom-nav">
        <a routerLink="/app" 
           [routerLinkActiveOptions]="{exact: true}"
           routerLinkActive="active-nav-item" 
           class="mobile-nav-item">
          <i class="bi bi-list-check mobile-nav-icon"></i>
          <span class="mobile-nav-text">Tasks</span>
        </a>
        <a routerLink="/app/new" class="mobile-nav-item add-button">
          <div class="bg-accent text-white rounded-full p-2.5 shadow-md">
            <i class="bi bi-plus-lg mobile-nav-icon mb-0"></i>
          </div>
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
    
    .active-nav-item {
      color: var(--accent-color, #3b82f6);
      font-weight: 500;
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