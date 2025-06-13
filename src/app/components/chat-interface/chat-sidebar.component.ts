import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="w-72 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 hidden lg:flex">
      <!-- Sidebar Header/Brand -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
            <i class="bi bi-chat-dots text-white text-lg"></i>
          </div>
          <span class="font-display text-lg font-medium">AI Assistant</span>
        </div>
        <button class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <i class="bi bi-plus-lg"></i>
        </button>
      </div>
      
      <!-- Search Bar -->
      <div class="p-4">
        <div class="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            class="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-accent text-sm"
          />
          <i class="bi bi-search absolute left-3 top-2.5 text-gray-400"></i>
        </div>
      </div>
      
      <!-- Navigation Menu -->
      <nav class="mb-4">
        <div class="px-3 mb-2 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Main</div>
        <a class="flex items-center px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mx-2 mb-1 active-state">
          <i class="bi bi-chat-text mr-3 text-accent"></i>
          <span>My Chats</span>
        </a>
        <a class="flex items-center px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mx-2 mb-1">
          <i class="bi bi-star mr-3 text-gray-400"></i>
          <span>Favorites</span>
        </a>
        <a class="flex items-center px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mx-2 mb-1">
          <i class="bi bi-folder mr-3 text-gray-400"></i>
          <span>Folders</span>
        </a>
      </nav>
      
      <!-- Conversation List -->
      <div class="flex-1 overflow-y-auto px-2 custom-scrollbar">
        <div class="px-3 mb-2 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Recent Conversations</div>
        
        <!-- Recent chat items -->
        <div class="space-y-1">
          <!-- Active chat -->
          <div class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-pointer">
            <div class="flex justify-between items-start mb-1">
              <h4 class="font-medium text-sm text-gray-800 dark:text-gray-100">Task Planning</h4>
              <span class="text-xs text-gray-500 dark:text-gray-400">2h ago</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">How can I organize my weekly tasks more efficiently?</p>
          </div>
          
          <!-- Other chats -->
          <div *ngFor="let i of [1,2,3,4,5]" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            <div class="flex justify-between items-start mb-1">
              <h4 class="font-medium text-sm">Project Discussion {{i}}</h4>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{i}}d ago</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">This is a preview of conversation {{i}}...</p>
          </div>
        </div>
      </div>
      
      <!-- User Profile Section -->
      <div class="p-3 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white">
              <i class="bi bi-person"></i>
            </div>
            <div>
              <p class="text-sm font-medium">User</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Free Plan</p>
            </div>
          </div>
          <button class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <i class="bi bi-gear"></i>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ChatSidebarComponent {} 