import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

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
    ]),
    trigger('staggeredItems', [
      transition(':enter', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          stagger('100ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ],
  template: `
    <div class="mobile-container animate-fade-in">
      <!-- Enhanced Mobile Header -->
      <div class="mobile-header sticky top-0 z-10">
        <h1 class="text-lg font-semibold flex items-center">
          <i class="bi bi-check2-circle text-accent dark:text-accent-light mr-2"></i>
          My Tasks
        </h1>
        <div class="flex space-x-2">
          <button class="p-2 rounded-full bg-gray-100 dark:bg-gray-700 active-state" 
                  aria-label="Filter tasks">
            <i class="bi bi-funnel text-gray-600 dark:text-gray-300"></i>
          </button>
          <button class="p-2 rounded-full bg-gray-100 dark:bg-gray-700 active-state"
                  aria-label="Sort tasks">
            <i class="bi bi-sort-down text-gray-600 dark:text-gray-300"></i>
          </button>
        </div>
      </div>

      <!-- Enhanced Search -->
      <div class="px-4 mb-4">
        <div class="relative">
          <input type="text" 
                 placeholder="Search tasks..." 
                 class="search-input pl-10 rounded-full shadow-sm focus:shadow-md transition-shadow"
                 aria-label="Search tasks">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <i class="bi bi-search text-gray-400"></i>
          </div>
        </div>
      </div>

      <!-- Enhanced Filters - Horizontal scroll -->
      <div class="filter-tabs px-4">
        <div class="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
          <button class="nav-pill nav-pill-active whitespace-nowrap shadow-sm" 
                  aria-pressed="true">
            <i class="bi bi-collection mr-1.5"></i> All Tasks
          </button>
          <button class="nav-pill nav-pill-inactive whitespace-nowrap shadow-sm" 
                  aria-pressed="false">
            <i class="bi bi-hourglass-split mr-1.5"></i> Active
          </button>
          <button class="nav-pill nav-pill-inactive whitespace-nowrap shadow-sm" 
                  aria-pressed="false">
            <i class="bi bi-check-circle mr-1.5"></i> Completed
          </button>
          <button class="nav-pill nav-pill-inactive whitespace-nowrap shadow-sm" 
                  aria-pressed="false">
            <i class="bi bi-flag-fill mr-1.5"></i> Important
          </button>
        </div>
      </div>
      
      <!-- Tasks List with Animation -->
      <div class="task-list px-4" [@staggeredItems]>
        <!-- No tasks state - Enhanced -->
        <div *ngIf="false" class="empty-state">
          <div class="flex flex-col items-center justify-center py-10 px-4 text-center">
            <div class="bg-accent/10 dark:bg-accent-dark/20 p-5 rounded-full mb-4">
              <i class="bi bi-clipboard text-3xl text-accent dark:text-accent-light"></i>
            </div>
            <h3 class="text-lg font-medium mb-2">No tasks yet</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-5 max-w-xs">
              Your task list is empty. Add your first task to get organized!
            </p>
            <button class="btn btn-primary flex items-center shadow-md">
              <i class="bi bi-plus-circle mr-2"></i> Create Task
            </button>
          </div>
        </div>

        <!-- Enhanced Task Items -->
        <div *ngFor="let i of [1, 2, 3, 4, 5]" class="task-item relative mb-4 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow" [@itemAnimation]>
          <div class="flex items-start gap-3">
            <button class="task-checkbox flex-shrink-0 h-5 w-5 rounded-full border-2 border-accent dark:border-accent-light mt-1 flex items-center justify-center"
                    [class.bg-accent]="i === 2" 
                    [class.dark:bg-accent-light]="i === 2"
                    aria-label="Mark task as complete">
              <i *ngIf="i === 2" class="bi bi-check text-white text-xs"></i>
            </button>
            
            <div class="flex-grow">
              <div class="flex justify-between items-start mb-1.5">
                <h3 class="font-medium" [class.line-through]="i === 2" 
                    [class.text-gray-500]="i === 2">Task {{i}}: Mobile UI Improvements</h3>
                <span class="task-badge bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-2.5 py-0.5 rounded-full">
                  {{i === 1 ? 'Today' : i === 3 ? 'Tomorrow' : 'Next Week'}}
                </span>
              </div>
              
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2"
                 [class.text-gray-400]="i === 2">
                Enhance the mobile experience with better interactions and accessibility improvements.
              </p>
              
              <div class="flex justify-between items-center">
                <div class="priority-indicator flex items-center">
                  <i class="bi bi-flag-fill priority-high mr-1.5" 
                     *ngIf="i === 1 || i === 4"></i>
                  <i class="bi bi-flag-fill priority-medium mr-1.5" 
                     *ngIf="i === 3"></i>
                  <i class="bi bi-flag-fill priority-low mr-1.5" 
                     *ngIf="i === 5"></i>
                  <span class="text-xs text-gray-600 dark:text-gray-300">
                    {{i === 1 || i === 4 ? 'High' : i === 3 ? 'Medium' : i === 5 ? 'Low' : ''}}
                  </span>
                </div>
                
                <div class="task-actions flex gap-1.5">
                  <button class="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 active-state"
                          aria-label="Edit task">
                    <i class="bi bi-pencil text-xs text-gray-500 dark:text-gray-400"></i>
                  </button>
                  <button class="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 active-state"
                          aria-label="Delete task">
                    <i class="bi bi-trash text-xs text-gray-500 dark:text-gray-400"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Floating Action Button -->
      <button class="fab bg-gradient-to-br from-accent to-blue-500 dark:from-accent-light dark:to-blue-400 shadow-lg" 
              aria-label="Add new task">
        <i class="bi bi-plus text-xl"></i>
      </button>

      <!-- Bottom padding for space -->
      <div class="h-20"></div>
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
      padding: 1.25rem 1rem;
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
      transition: all 0.2s ease;
    }

    :host-context(.dark) .task-item {
      background-color: rgb(31, 41, 55);
      border: 1px solid rgba(55, 65, 81, 0.5);
    }
    
    .task-item:active {
      transform: scale(0.98);
    }
    
    .task-checkbox {
      transition: all 0.2s ease;
    }
    
    .fab {
      position: fixed;
      bottom: 80px;
      right: 20px;
      height: 56px;
      width: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      z-index: 40;
    }
    
    .fab:active {
      transform: scale(0.92);
    }
    
    .nav-pill {
      @apply px-4 py-2 rounded-full text-sm font-medium transition-all 
             flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 
             focus:ring-accent dark:focus:ring-accent-light;
    }
    
    .nav-pill-active {
      @apply bg-accent/15 text-accent dark:bg-accent-dark/25 dark:text-accent-light;
    }
    
    .nav-pill-inactive {
      @apply text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800;
    }
    
    .task-badge {
      @apply inline-flex items-center;
    }
    
    .no-scrollbar {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }
    
    .no-scrollbar::-webkit-scrollbar {
      display: none; /* Chrome, Safari and Opera */
    }
    
    .empty-state {
      @apply flex items-center justify-center min-h-[60vh];
    }
    
    .active-state:active {
      transform: scale(0.95);
    }
  `]
})
export class MobileTodoListComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
} 