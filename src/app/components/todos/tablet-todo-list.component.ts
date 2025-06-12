import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-tablet-todo-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  animations: [
    trigger('taskListAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(80, [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ],
  template: `
    <div class="tablet-container p-5" [@fadeAnimation]>
      <!-- Header with Title and Actions -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-800 dark:text-white">Task Dashboard</h1>
        
        <div class="flex gap-2">
          <button class="btn btn-primary flex items-center" aria-label="Create new task">
            <i class="bi bi-plus-circle mr-2"></i>
            <span>New Task</span>
          </button>
        </div>
      </div>

      <!-- Search and Filters Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 items-center">
        <!-- Search -->
        <div class="relative">
          <input type="text" 
                placeholder="Search tasks..." 
                class="search-input pl-10 rounded-lg"
                aria-label="Search tasks">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="bi bi-search text-gray-400"></i>
          </div>
        </div>
        
        <!-- Tags/Categories Filter -->
        <div class="flex overflow-x-auto pb-1 no-scrollbar">
          <div class="flex gap-2">
            <button class="tag-filter-active" aria-pressed="true">
              <i class="bi bi-tag-fill mr-1"></i>Work
            </button>
            <button class="tag-filter" aria-pressed="false">
              <i class="bi bi-tag mr-1"></i>Personal
            </button>
            <button class="tag-filter" aria-pressed="false">
              <i class="bi bi-tag mr-1"></i>Shopping
            </button>
            <button class="tag-filter" aria-pressed="false">
              <i class="bi bi-tag mr-1"></i>Health
            </button>
          </div>
        </div>
        
        <!-- Filter/Sort Controls -->
        <div class="flex gap-3 ml-auto">
          <div class="relative">
            <button class="btn btn-secondary flex items-center" id="filterBtn" aria-expanded="false" aria-haspopup="true">
              <i class="bi bi-funnel mr-2"></i>
              <span>Filter</span>
              <i class="bi bi-chevron-down ml-2 text-xs"></i>
            </button>
            
            <!-- Filter dropdown (hidden by default) -->
            <div class="filter-dropdown hidden" role="menu" aria-labelledby="filterBtn">
              <!-- Filter content here -->
            </div>
          </div>
          
          <div class="relative">
            <button class="btn btn-secondary flex items-center" id="sortBtn" aria-expanded="false" aria-haspopup="true">
              <i class="bi bi-sort-down mr-2"></i>
              <span>Sort</span>
              <i class="bi bi-chevron-down ml-2 text-xs"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Status Tabs -->
      <div class="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button class="status-tab status-tab-active" role="tab" aria-selected="true">
          All Tasks
          <span class="ml-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-1.5 py-0.5 rounded-full">12</span>
        </button>
        <button class="status-tab" role="tab" aria-selected="false">
          Active
          <span class="ml-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-1.5 py-0.5 rounded-full">8</span>
        </button>
        <button class="status-tab" role="tab" aria-selected="false">
          Completed
          <span class="ml-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-1.5 py-0.5 rounded-full">4</span>
        </button>
        <button class="status-tab" role="tab" aria-selected="false">
          Important
          <span class="ml-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-1.5 py-0.5 rounded-full">2</span>
        </button>
      </div>
      
      <!-- Tasks Grid - For Tablet -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4" [@taskListAnimation]="taskItems.length">
        <!-- Task Items -->
        <div *ngFor="let task of taskItems; let i = index" class="task-card">
          <div class="flex justify-between mb-3">
            <div class="flex items-start gap-3">
              <div class="task-checkbox-container mt-1">
                <input type="checkbox" [id]="'task-' + i" class="sr-only" 
                       [checked]="i === 1" aria-label="Mark task as complete">
                <label [for]="'task-' + i" class="task-checkbox" [class.task-checkbox-checked]="i === 1">
                  <i class="bi bi-check text-white"></i>
                </label>
              </div>
              
              <div>
                <h3 class="font-medium text-lg" [class.line-through]="i === 1" 
                    [class.text-gray-500]="i === 1">
                  {{task.title}}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2" 
                   [class.text-gray-400]="i === 1">
                  {{task.description}}
                </p>
                
                <div class="flex flex-wrap gap-2 mb-3">
                  <span class="task-tag">
                    <i class="bi bi-tag-fill mr-1 text-accent"></i>
                    {{task.tag}}
                  </span>
                  <span class="task-due-date" [class.text-red-500]="task.isUrgent">
                    <i class="bi bi-calendar3 mr-1"></i>
                    {{task.dueDate}}
                  </span>
                  <span class="task-priority" *ngIf="task.priority">
                    <i [class]="'bi bi-flag-fill mr-1 ' + task.priorityColor"></i>
                    {{task.priority}}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Task Actions -->
          <div class="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-2">
              <button class="task-action-btn" aria-label="Add attachment">
                <i class="bi bi-paperclip"></i>
              </button>
              <button class="task-action-btn" aria-label="Add comment">
                <i class="bi bi-chat-left-text"></i>
              </button>
            </div>
            
            <div class="flex gap-2">
              <button class="task-action-btn-secondary" aria-label="Edit task">
                <i class="bi bi-pencil mr-1"></i>
                Edit
              </button>
              <button class="task-action-btn-danger" aria-label="Delete task">
                <i class="bi bi-trash mr-1"></i>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-between items-center mt-8">
        <span class="text-sm text-gray-600 dark:text-gray-400">Showing 1-6 of 12 tasks</span>
        
        <div class="flex gap-1">
          <button class="pagination-btn" disabled aria-label="Previous page">
            <i class="bi bi-chevron-left"></i>
          </button>
          <button class="pagination-btn pagination-btn-active" aria-current="page">1</button>
          <button class="pagination-btn">2</button>
          <button class="pagination-btn" aria-label="Next page">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    
    .tablet-container {
      min-height: 100vh;
      background-color: #f9fafb;
    }

    :host-context(.dark) .tablet-container {
      background-color: #111827;
    }
    
    .task-card {
      @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4;
      @apply border border-gray-100 dark:border-gray-700;
      @apply transition-all duration-300 hover:shadow-md;
    }
    
    .task-checkbox-container {
      position: relative;
      height: 20px;
      width: 20px;
      flex-shrink: 0;
    }
    
    .task-checkbox {
      @apply flex items-center justify-center;
      @apply h-5 w-5 rounded-full border-2 border-gray-300 dark:border-gray-600;
      @apply hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer;
      @apply transition-all duration-200;
    }
    
    .task-checkbox-checked {
      @apply bg-blue-500 border-blue-500 dark:bg-blue-600 dark:border-blue-600;
    }
    
    .task-checkbox-checked i {
      @apply text-xs;
    }
    
    .task-tag {
      @apply inline-flex items-center px-2 py-0.5 rounded-md text-xs;
      @apply bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300;
    }
    
    .task-due-date {
      @apply inline-flex items-center px-2 py-0.5 rounded-md text-xs;
      @apply bg-gray-50 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300;
    }
    
    .task-priority {
      @apply inline-flex items-center px-2 py-0.5 rounded-md text-xs;
      @apply bg-gray-50 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300;
    }
    
    .task-action-btn {
      @apply p-2 rounded-full text-gray-500 dark:text-gray-400;
      @apply hover:bg-gray-100 dark:hover:bg-gray-700;
      @apply transition-colors duration-200;
    }
    
    .task-action-btn-secondary {
      @apply inline-flex items-center px-2.5 py-1.5 text-sm rounded-md;
      @apply text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700;
      @apply hover:bg-gray-200 dark:hover:bg-gray-600;
      @apply transition-colors duration-200;
    }
    
    .task-action-btn-danger {
      @apply inline-flex items-center px-2.5 py-1.5 text-sm rounded-md;
      @apply text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20;
      @apply hover:bg-red-100 dark:hover:bg-red-900/30;
      @apply transition-colors duration-200;
    }
    
    .status-tab {
      @apply px-4 py-3 text-gray-500 dark:text-gray-400;
      @apply hover:text-gray-700 dark:hover:text-gray-300;
      @apply transition-colors duration-200 font-medium;
    }
    
    .status-tab-active {
      @apply text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400;
    }
    
    .tag-filter {
      @apply inline-flex items-center px-3 py-1.5 rounded-full text-sm;
      @apply bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300;
      @apply hover:bg-gray-200 dark:hover:bg-gray-600;
      @apply transition-all duration-200 whitespace-nowrap;
    }
    
    .tag-filter-active {
      @apply inline-flex items-center px-3 py-1.5 rounded-full text-sm;
      @apply bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300;
      @apply transition-all duration-200 whitespace-nowrap;
    }
    
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    
    .pagination-btn {
      @apply w-8 h-8 flex items-center justify-center rounded-md;
      @apply text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800;
      @apply hover:bg-gray-100 dark:hover:bg-gray-700;
      @apply border border-gray-200 dark:border-gray-700;
      @apply transition-colors duration-200;
    }
    
    .pagination-btn-active {
      @apply bg-blue-600 dark:bg-blue-700 text-white border-blue-600 dark:border-blue-700;
      @apply hover:bg-blue-700 dark:hover:bg-blue-800;
    }
    
    .pagination-btn[disabled] {
      @apply opacity-50 cursor-not-allowed hover:bg-white dark:hover:bg-gray-800;
    }
  `]
})
export class TabletTodoListComponent implements OnInit {
  // Sample task data
  taskItems = [
    {
      title: 'Complete UI/UX improvements',
      description: 'Enhance user interface components with better designs and optimize for tablet view.',
      tag: 'Work',
      dueDate: 'Today',
      priority: 'High',
      isUrgent: true,
      priorityColor: 'priority-high'
    },
    {
      title: 'Review analytics dashboard',
      description: 'Check latest user statistics and engagement metrics for the application.',
      tag: 'Work',
      dueDate: 'Completed',
      priority: '',
      isUrgent: false,
      priorityColor: ''
    },
    {
      title: 'Update product documentation',
      description: 'Write comprehensive guides for new features implemented in the latest sprint.',
      tag: 'Work',
      dueDate: 'Tomorrow',
      priority: 'Medium',
      isUrgent: false,
      priorityColor: 'priority-medium'
    },
    {
      title: 'Prepare meeting agenda',
      description: 'Create a structured plan for the weekly team sync-up meeting with stakeholders.',
      tag: 'Work',
      dueDate: 'Wednesday',
      priority: 'Low',
      isUrgent: false,
      priorityColor: 'priority-low'
    },
    {
      title: 'Schedule doctor appointment',
      description: 'Book annual check-up with healthcare provider.',
      tag: 'Personal',
      dueDate: 'Next week',
      priority: 'Medium',
      isUrgent: false,
      priorityColor: 'priority-medium'
    },
    {
      title: 'Grocery shopping',
      description: 'Buy vegetables, fruits, milk, and other household essentials.',
      tag: 'Shopping',
      dueDate: 'Weekend',
      priority: 'Low',
      isUrgent: false,
      priorityColor: 'priority-low'
    }
  ];
  
  constructor() {}
  
  ngOnInit(): void {}
} 