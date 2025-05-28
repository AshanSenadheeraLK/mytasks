import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tablet-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen">
      <!-- Sidebar -->
      <aside class="tablet-sidebar">
        <div class="flex items-center justify-center mb-8">
          <h1 class="text-2xl font-bold">Todo App</h1>
        </div>
        
        <nav class="flex-1">
          <ul class="space-y-2">
            <li>
              <a routerLink="/app" routerLinkActive="bg-accent/20 text-accent" 
                 class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors">
                <i class="bi bi-list-check text-xl"></i>
                <span>Tasks</span>
              </a>
            </li>
            <li>
              <a routerLink="/app" routerLinkActive="bg-accent/20 text-accent"
                 class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors">
                <i class="bi bi-plus-circle text-xl"></i>
                <span>New Task</span>
              </a>
            </li>
            <li>
              <a routerLink="/profile" routerLinkActive="bg-accent/20 text-accent"
                 class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors">
                <i class="bi bi-person text-xl"></i>
                <span>Profile</span>
              </a>
            </li>
          </ul>
        </nav>
        
        <div class="border-t border-gray-300 dark:border-gray-700 pt-4 mt-4">
          <a routerLink="/profile" routerLinkActive="bg-accent/20 text-accent"
             class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors">
            <i class="bi bi-gear text-xl"></i>
            <span>Settings</span>
          </a>
        </div>
      </aside>
      
      <!-- Main Content Area -->
      <div class="tablet-main-content">
        <!-- Header -->
        <header class="tablet-header mb-4">
          <h1 class="text-xl font-bold">Dashboard</h1>
          <div class="flex items-center space-x-4">
            <button class="btn btn-secondary">
              <i class="bi bi-bell mr-2"></i>
              <span>Notifications</span>
            </button>
            <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <i class="bi bi-person-fill"></i>
            </div>
          </div>
        </header>
        
        <!-- Main Content -->
        <main class="p-3">
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
  `]
})
export class TabletLayoutComponent {} 