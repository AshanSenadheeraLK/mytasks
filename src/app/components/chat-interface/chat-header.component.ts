import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../shared/theme-toggle.component';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent],
  template: `
    <header class="h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between px-4 lg:px-6 shadow-sm">
      <!-- Left side: Mobile menu and title -->
      <div class="flex items-center space-x-4">
        <button class="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <i class="bi bi-list text-xl"></i>
        </button>
        <div>
          <h1 class="text-lg font-medium">Current Conversation</h1>
          <p class="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Started 2 hours ago</p>
        </div>
      </div>
      
      <!-- Right side: Actions -->
      <div class="flex items-center space-x-2">
        <button class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
          <i class="bi bi-search"></i>
        </button>
        <button class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
          <i class="bi bi-three-dots-vertical"></i>
        </button>
        <div class="hidden md:block">
          <app-theme-toggle></app-theme-toggle>
        </div>
      </div>
    </header>
  `
})
export class ChatHeaderComponent {} 