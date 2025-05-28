import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-mobile-todo-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  animations: [
    trigger('itemAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('listAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ],
  template: `
    <div class="mobile-container">
      <!-- Mobile Header -->
      <div class="mobile-header sticky top-0 z-10">
        <h1 class="text-lg font-semibold">My Tasks</h1>
        <div class="flex space-x-2">
          <button class="p-2 rounded-full bg-gray-100 dark:bg-gray-700" aria-label="Filter tasks">
            <i class="bi bi-funnel text-gray-600 dark:text-gray-300"></i>
          </button>
        </div>
      </div>

      <!-- Search -->
      <div class="px-4 mb-4">
        <div class="relative">
          <input type="text" 
                 placeholder="Search tasks..." 
                 class="search-input pl-10 rounded-full"
                 aria-label="Search tasks">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="bi bi-search text-gray-400"></i>
          </div>
        </div>
      </div>

      <!-- Filters - Horizontal scroll without scrollbar appearance -->
      <div class="filter-tabs px-4">
        <div class="flex gap-2 overflow-x-auto pb-2 mb-3 no-scrollbar">
          <button class="nav-pill nav-pill-active whitespace-nowrap" 
                  aria-pressed="true">
            All Tasks
          </button>
          <button class="nav-pill nav-pill-inactive whitespace-nowrap" 
                  aria-pressed="false">
            Active
          </button>
          <button class="nav-pill nav-pill-inactive whitespace-nowrap" 
                  aria-pressed="false">
            Completed
          </button>
          <button class="nav-pill nav-pill-inactive whitespace-nowrap" 
                  aria-pressed="false">
            Important
          </button>
        </div>
      </div>
      
      <!-- Tasks List - Card View optimized for Mobile -->
      <div class="task-list px-4" [@listAnimation]>
        <!-- No tasks state -->
        <div *ngIf="false" class="empty-state text-center py-10">
          <div class="icon-empty mb-4">
            <i class="bi bi-clipboard text-4xl text-gray-300 dark:text-gray-600"></i>
          </div>
          <h3 class="text-lg font-medium mb-1">No tasks yet</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Tap the + button to create your first task</p>
        </div>

        <!-- Task Items -->
        <div *ngFor="let i of [1, 2, 3, 4, 5]" class="task-item relative mb-3 p-4 rounded-xl" [@itemAnimation]>
          <div class="flex items-start gap-3">
            <button class="task-checkbox flex-shrink-0 h-5 w-5 rounded-full border-2 border-blue-400 dark:border-blue-500 mt-1"
                    [class.bg-blue-500]="i === 2" 
                    aria-label="Mark task as complete">
              <i *ngIf="i === 2" class="bi bi-check text-white text-xs flex items-center justify-center h-full"></i>
            </button>
            
            <div class="flex-grow">
              <div class="flex justify-between items-start mb-1">
                <h3 class="font-medium" [class.line-through]="i === 2" 
                    [class.text-gray-500]="i === 2">Task {{i}}: Mobile UI Improvements</h3>
                <span class="task-badge bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full">
                  {{i === 1 ? 'Today' : i === 3 ? 'Tomorrow' : 'Next Week'}}
                </span>
              </div>
              
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2"
                 [class.text-gray-400]="i === 2">
                Enhance the mobile experience with better interactions and accessibility improvements.
              </p>
              
              <div class="flex justify-between items-center">
                <div class="priority-indicator flex items-center">
                  <i class="bi bi-flag-fill text-red-500 dark:text-red-400 mr-1" 
                     *ngIf="i === 1 || i === 4"></i>
                  <i class="bi bi-flag-fill text-yellow-500 dark:text-yellow-400 mr-1" 
                     *ngIf="i === 3"></i>
                  <span class="text-xs text-gray-500">
                    {{i === 1 || i === 4 ? 'High' : i === 3 ? 'Medium' : ''}}
                  </span>
                </div>
                
                <div class="task-actions flex gap-1">
                  <button class="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700"
                          aria-label="Edit task">
                    <i class="bi bi-pencil text-xs text-gray-500 dark:text-gray-400"></i>
                  </button>
                  <button class="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700"
                          aria-label="Delete task">
                    <i class="bi bi-trash text-xs text-gray-500 dark:text-gray-400"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Action Button -->
      <button class="fab" aria-label="Add new task">
        <i class="bi bi-plus text-xl"></i>
      </button>

      <!-- Bottom Navigation -->
      <div class="mobile-bottom-nav">
        <a href="#" class="mobile-nav-item active">
          <i class="bi bi-list-check mobile-nav-icon"></i>
          <span class="mobile-nav-text">Tasks</span>
        </a>
        <a href="#" class="mobile-nav-item">
          <i class="bi bi-calendar-event mobile-nav-icon"></i>
          <span class="mobile-nav-text">Calendar</span>
        </a>
        <a href="#" class="mobile-nav-item">
          <i class="bi bi-bar-chart mobile-nav-icon"></i>
          <span class="mobile-nav-text">Progress</span>
        </a>
        <a href="#" class="mobile-nav-item">
          <i class="bi bi-gear mobile-nav-icon"></i>
          <span class="mobile-nav-text">Settings</span>
        </a>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    
    .mobile-container {
      padding-bottom: 70px; /* Space for bottom nav */
      height: 100vh;
      overflow-y: auto;
      overflow-x: hidden;
    }
    
    .mobile-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(229, 231, 235, 0.5);
    }

    :host-context(.dark) .mobile-header {
      background: rgba(31, 41, 55, 0.95);
      border-bottom: 1px solid rgba(55, 65, 81, 0.5);
    }
    
    .task-item {
      background-color: white;
      border: 1px solid rgba(229, 231, 235, 0.5);
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    :host-context(.dark) .task-item {
      background-color: rgb(31, 41, 55);
      border: 1px solid rgba(55, 65, 81, 0.5);
    }
    
    .task-item:active {
      transform: scale(0.98);
    }
    
    .task-checkbox {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }

    .mobile-bottom-nav a.active {
      color: #3b82f6;
    }

    :host-context(.dark) .mobile-bottom-nav a.active {
      color: #60a5fa;
    }
  `]
})
export class MobileTodoListComponent implements OnInit {
  constructor() {}
  
  ngOnInit(): void {}
} 