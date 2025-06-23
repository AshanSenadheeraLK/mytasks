import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { Todo } from '../../services/todo.service';
import { TodoEditModalComponent } from './todo-edit-modal.component';
import { SearchBarComponent } from '../shared/search-bar.component';
import { ThemeToggleComponent } from '../shared/theme-toggle.component';
import { ToastNotificationsComponent } from '../shared/toast-notifications.component';

@Component({
  selector: 'app-tablet-todo-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    TodoEditModalComponent, 
    SearchBarComponent,
    ThemeToggleComponent,
    ToastNotificationsComponent
  ],
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
    <div class="tablet-container" [@fadeAnimation]>
      <!-- Header with Navigation and Actions -->
      <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-30">
        <div class="flex justify-between items-center p-4">
          <div class="flex items-center space-x-4">
            <button (click)="toggleSidebar()" 
                    class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Toggle sidebar">
              <i class="bi bi-layout-sidebar"></i>
            </button>
            <h1 class="text-xl font-semibold text-gray-800 dark:text-white">Tasks Dashboard</h1>
          </div>
          
          <div class="flex items-center gap-3">
            <app-theme-toggle></app-theme-toggle>
            <a routerLink="/profile" class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <i class="bi bi-person"></i>
            </a>
          </div>
        </div>
        
        <!-- Searchbar and Actions Row -->
        <div class="px-4 pb-4 flex gap-3 items-center">
          <div class="flex-grow">
            <app-search-bar 
              (search)="onSearch($event)" 
              placeholder="Search tasks..." 
              class="w-full">
            </app-search-bar>
          </div>
          
          <button (click)="openAddModal()" class="btn btn-primary whitespace-nowrap">
            <i class="bi bi-plus-circle mr-2"></i>
            New Task
          </button>
        </div>
        
        <!-- Filters Tabs -->
        <div class="px-4 pb-1">
          <div class="flex border-b border-gray-200 dark:border-gray-700">
            <button *ngFor="let filter of filters" 
                    (click)="setFilter(filter.value)"
                    class="tab-button"
                    [class.tab-active]="activeFilter === filter.value"
                    [attr.aria-pressed]="activeFilter === filter.value">
              {{ filter.label }}
              <span class="ml-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-1.5 py-0.5 rounded-full">
                {{ getFilterCount(filter.value) }}
              </span>
            </button>
          </div>
        </div>
      </header>
      
      <!-- Main Content Area -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <!-- Stats Section (Left Column) -->
        <div class="space-y-6">
          <!-- Summary Card -->
          <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <i class="bi bi-graph-up mr-2 text-primary"></i>
              Task Summary
            </h2>
            
            <div class="grid grid-cols-1 gap-4">
              <!-- Progress Bar -->
              <div class="bg-gradient-to-r from-blue-600 to-primary rounded-lg p-4 text-white">
                <div class="flex justify-between items-center mb-2">
                  <div class="text-sm font-medium">Completion Rate</div>
                  <div class="text-lg font-bold">{{ getCompletionRate() }}%</div>
                </div>
                <div class="h-2 bg-blue-300/50 rounded-full overflow-hidden">
                  <div class="h-2 bg-white rounded-full transition-all duration-700 ease-out" 
                       [style.width.%]="getCompletionRate()"></div>
                </div>
              </div>
              
              <!-- Stats Grid -->
              <div class="grid grid-cols-3 gap-3">
                <div class="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-3 border border-gray-100 dark:border-gray-700">
                  <div class="text-xl font-bold text-primary dark:text-blue-400">{{ todos.length }}</div>
                  <div class="text-xs text-gray-600 dark:text-gray-400">Total</div>
                </div>
                <div class="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-3 border border-gray-100 dark:border-gray-700">
                  <div class="text-xl font-bold text-success dark:text-green-400">{{ getCompletedCount() }}</div>
                  <div class="text-xs text-gray-600 dark:text-gray-400">Completed</div>
                </div>
                <div class="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-3 border border-gray-100 dark:border-gray-700">
                  <div class="text-xl font-bold text-warning dark:text-yellow-400">{{ getPendingCount() }}</div>
                  <div class="text-xs text-gray-600 dark:text-gray-400">Pending</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Quick Filters Section -->
          <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <i class="bi bi-funnel mr-2 text-primary"></i>
              Quick Filters
            </h2>
            
            <div class="space-y-3">
              <button (click)="showTodaysTasks()" class="quick-filter-btn">
                <i class="bi bi-calendar-day mr-2 text-success"></i>
                <span>Today's Tasks</span>
              </button>
              <button (click)="showHighPriorityTasks()" class="quick-filter-btn">
                <i class="bi bi-flag-fill mr-2 text-danger"></i>
                <span>High Priority</span>
              </button>
              <button (click)="showRecentlyCompleted()" class="quick-filter-btn">
                <i class="bi bi-check-circle mr-2 text-primary"></i>
                <span>Recently Completed</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Tasks List (Right Column) -->
        <div class="space-y-4">
          <!-- Empty State -->
          <div *ngIf="filteredTodos.length === 0" class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <i class="bi bi-check2-all text-2xl text-gray-400 dark:text-gray-500"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-2">No tasks found</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs mb-6">
              {{activeFilter === 'all' ? 'You have no tasks yet. Create your first task to get started.' : 'No tasks match the current filter. Try changing your filter criteria.'}}
            </p>
            <button (click)="openAddModal()" class="btn btn-primary">
              <i class="bi bi-plus-circle mr-2"></i>
              Create New Task
            </button>
          </div>
          
          <!-- Task Cards -->
          <div class="task-cards" [@taskListAnimation]="filteredTodos.length">
            <div *ngFor="let todo of filteredTodos" class="task-card" [class.task-card-completed]="todo.completed">
              <div class="p-4">
                <div class="flex items-start gap-4">
                  <!-- Checkbox -->
                  <button (click)="toggleTodo(todo.id!)" 
                          class="mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 border-primary dark:border-primary-hover transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                          [class.bg-primary]="todo.completed"
                          [class.flex]="todo.completed"
                          [class.items-center]="todo.completed"
                          [class.justify-center]="todo.completed"
                          aria-label="Toggle task completion">
                    <i *ngIf="todo.completed" class="bi bi-check text-white text-xs"></i>
                  </button>
                  
                  <!-- Task Content -->
                  <div class="flex-grow">
                    <div class="flex justify-between mb-2">
                      <h3 class="font-medium text-gray-800 dark:text-white"
                          [class.line-through]="todo.completed"
                          [class.text-gray-500]="todo.completed"
                          [class.dark:text-gray-400]="todo.completed">
                        {{ todo.title }}
                      </h3>
                      
                      <!-- Due Date Badge -->
                      <span *ngIf="todo.dueDate" 
                            class="ml-2 flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            [ngClass]="{
                              'bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-hover': !isOverdue(todo) && !todo.completed,
                              'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400': isOverdue(todo) && !todo.completed,
                              'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400': todo.completed
                            }">
                        {{ formatDate(todo.dueDate) }}
                      </span>
                    </div>
                    
                    <!-- Description -->
                    <p *ngIf="todo.description" 
                       class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2"
                       [class.text-gray-400]="todo.completed"
                       [class.dark:text-gray-500]="todo.completed"
                       [class.line-through]="todo.completed">
                      {{ todo.description }}
                    </p>
                    
                    <!-- Tags Row -->
                    <div class="flex flex-wrap gap-2 mb-4">
                      <!-- Priority Tag -->
                      <span *ngIf="todo.priority" 
                            class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
                            [ngClass]="{
                              'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400': todo.priority === 'high' && !todo.completed,
                              'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400': todo.priority === 'medium' && !todo.completed,
                              'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400': todo.priority === 'low' && !todo.completed,
                              'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400': todo.completed
                            }">
                        <i class="bi bi-flag-fill mr-1"></i>
                        {{ todo.priority | titlecase }}
                      </span>
                    </div>
                    
                    <!-- Actions Row -->
                    <div class="flex justify-end space-x-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                      <button (click)="openEditModal(todo)" 
                              class="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                              aria-label="Edit task">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button (click)="deleteTodo(todo.id!)" 
                              class="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                              aria-label="Delete task">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Floating Action Button (only visible at smaller tablet sizes) -->
      <button (click)="openAddModal()" 
              class="md:hidden fab shadow-xl active:scale-95 transition-transform"
              aria-label="Add new task">
        <i class="bi bi-plus text-xl"></i>
      </button>
      
      <!-- Modal for Task Editing -->
      <app-todo-edit-modal *ngIf="showModal" [todo]="selectedTodo" (save)="onModalSave($event)" (close)="closeModal()"></app-todo-edit-modal>
      
      <!-- Toast Notifications -->
      <app-toast-notifications></app-toast-notifications>
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
    
    .tab-button {
      @apply px-4 py-3 text-sm font-medium border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-colors;
      @apply text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300;
    }
    
    .tab-active {
      @apply border-primary text-primary dark:text-primary-hover dark:border-primary-hover;
    }
    
    .quick-filter-btn {
      @apply w-full flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors;
    }
    
    .task-card {
      @apply bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-4;
      @apply border border-gray-100 dark:border-gray-700;
      @apply transition-all duration-300 hover:shadow-md;
    }
    
    .task-card-completed {
      @apply bg-gray-50 dark:bg-gray-800/80;
    }
    
    .fab {
      @apply fixed right-6 bottom-6 bg-primary hover:bg-primary-hover text-white h-14 w-14 rounded-full flex items-center justify-center shadow-lg z-50;
    }
    
    .btn {
      @apply px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center;
    }
    
    .btn-primary {
      @apply bg-primary hover:bg-primary-hover text-white;
    }
  `]
})
export class TabletTodoListComponent implements OnInit {
  @Input() todos: Todo[] = [];
  @Input() filteredTodos: Todo[] = [];
  @Output() toggleComplete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<string>();
  @Output() add = new EventEmitter<Partial<Todo>>();
  @Output() search = new EventEmitter<any>();
  @Output() filter = new EventEmitter<any>();
  
  filters = [
    { label: 'All Tasks', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
    { label: 'Important', value: 'important' }
  ];
  
  activeFilter = 'all';
  sidebarOpen = true;
  selectedTodo: Todo | null = null;
  showModal = false;
  
  constructor() {}
  
  ngOnInit(): void {}
  
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
  
  openAddModal(): void {
    this.selectedTodo = null;
    this.showModal = true;
  }
  
  openEditModal(todo: Todo): void {
    this.selectedTodo = todo;
    this.showModal = true;
  }
  
  closeModal(): void {
    this.showModal = false;
    this.selectedTodo = null;
  }
  
  onModalSave(todoData: Partial<Todo>): void {
    if (this.selectedTodo) {
      // Edit existing todo
      this.edit.emit({...this.selectedTodo, ...todoData});
    } else {
      // Add new todo
      this.add.emit(todoData);
    }
    this.closeModal();
  }
  
  toggleTodo(id: string): void {
    this.toggleComplete.emit(id);
  }
  
  deleteTodo(id: string): void {
    this.delete.emit(id);
  }
  
  onSearch(searchData: any): void {
    this.search.emit(searchData);
  }
  
  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.filter.emit({
      term: '',
      filterType: 'all',
      taskStatus: filter === 'all' ? 'all' : filter === 'active' ? 'active' : filter === 'completed' ? 'completed' : 'all'
    });
  }
  
  getFilterCount(filter: string): number {
    switch (filter) {
      case 'all':
        return this.todos.length;
      case 'active':
        return this.todos.filter(todo => !todo.completed).length;
      case 'completed':
        return this.todos.filter(todo => todo.completed).length;
      case 'important':
        return this.todos.filter(todo => todo.priority === 'high').length;
      default:
        return 0;
    }
  }
  
  getCompletedCount(): number {
    return this.todos.filter(todo => todo.completed).length;
  }
  
  getPendingCount(): number {
    return this.todos.filter(todo => !todo.completed).length;
  }
  
  getCompletionRate(): number {
    if (this.todos.length === 0) return 0;
    return Math.round((this.getCompletedCount() / this.todos.length) * 100);
  }
  
  showTodaysTasks(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    this.filter.emit({
      term: '',
      filterType: 'today',
      taskStatus: 'all'
    });
  }
  
  showHighPriorityTasks(): void {
    this.filter.emit({
      term: '',
      filterType: 'priority',
      taskStatus: 'all',
      priority: 'high'
    });
  }
  
  showRecentlyCompleted(): void {
    this.filter.emit({
      term: '',
      filterType: 'completed',
      taskStatus: 'completed'
    });
  }
  
  isOverdue(todo: Todo): boolean {
    if (!todo.dueDate || todo.completed) return false;
    
    const dueDate = todo.dueDate instanceof Date 
      ? todo.dueDate 
      : new Date(todo.dueDate);
    
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate < now;
  }
  
  formatDate(date: Date | any): string {
    if (!date) return '';
    
    const dueDate = date instanceof Date 
      ? date 
      : new Date(date);
    
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Reset time part for comparison
    const dueDay = new Date(dueDate);
    dueDay.setHours(0, 0, 0, 0);
    
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    const tomorrowDay = new Date(tomorrow);
    tomorrowDay.setHours(0, 0, 0, 0);
    
    if (dueDay.getTime() === today.getTime()) {
      return 'Today';
    } else if (dueDay.getTime() === tomorrowDay.getTime()) {
      return 'Tomorrow';
    } else {
      return dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }
} 