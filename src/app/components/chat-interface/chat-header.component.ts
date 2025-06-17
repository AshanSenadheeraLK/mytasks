import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../shared/theme-toggle.component';
import { Conversation } from '../../services/chat-firestore.service';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent],
  template: `
    <header class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-card dark:bg-card-dark shadow-sm">
      <div class="flex items-center gap-2">
        <!-- Sidebar toggle button -->
        <button 
          (click)="toggleSidebar.emit()" 
          class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Toggle sidebar"
        >
          <i class="bi" [ngClass]="isSidebarOpen ? 'bi-layout-sidebar-inset' : 'bi-layout-sidebar'"></i>
        </button>
        
        <!-- Back button (mobile only) -->
        <button 
          (click)="navigateBack.emit()" 
          class="md:hidden flex items-center text-sm gap-1.5 p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <i class="bi bi-arrow-left"></i>
          <span class="sr-only md:not-sr-only">Back</span>
        </button>
        
        <!-- Conversation info -->
        <div>
          <h1 class="font-semibold text-gray-800 dark:text-gray-100">
            {{ conversation?.title || 'Chat Assistant' }}
          </h1>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <!-- Theme toggle -->
        <app-theme-toggle></app-theme-toggle>
        
        <!-- User menu button -->
        <button 
          class="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
          aria-label="User menu"
        >
          <i class="bi bi-person"></i>
        </button>
      </div>
    </header>
  `,
  styles: []
})
export class ChatHeaderComponent {
  @Input() conversation: Conversation | null = null;
  @Input() isSidebarOpen = false;
  
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() navigateBack = new EventEmitter<void>();
}
