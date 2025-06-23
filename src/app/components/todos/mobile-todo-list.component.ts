import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { Todo } from '../../services/todo.service';
import { TodoEditModalComponent } from './todo-edit-modal.component';
import { SearchBarComponent } from '../shared/search-bar.component';
import { ThemeToggleComponent } from '../shared/theme-toggle.component';
import { ToastNotificationsComponent } from '../shared/toast-notifications.component';

@Component({
  selector: 'app-mobile-todo-list',
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
    trigger('itemAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ]),
    trigger('listAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ],
  template: `
    <div class="mobile-container">
      <!-- Mobile Header with subtle shadow and blur effect -->
      <div class="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="flex items-center justify-between px-4 py-3">
          <button 
            (click)="toggleSidebar()" 
            class="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Menu">
            <i class="bi bi-list text-gray-700 dark:text-gray-300"></i>
          </button>
          <h1 class="text-xl font-display font-bold text-gray-800 dark:text-white">My Tasks</h1>
          <app-theme-toggle></app-theme-toggle>
        </div>

        <!-- Search Bar with improved styling -->
        <div class="px-4 pb-3">
          <app-search-bar (search)="onSearch($event)" placeholder="Search tasks..." class="w-full"></app-search-bar>
        </div>

        <!-- Filters - Horizontal scroll with improved pill styling -->
        <div class="px-4 pb-3 overflow-x-auto no-scrollbar">
          <div class="flex gap-2 pb-0.5">
            <button class="nav-pill" 
                    [class.nav-pill-active]="activeFilter === 'all'"
                    [class.nav-pill-inactive]="activeFilter !== 'all'"
                    (click)="setFilter('all')" 
                    [attr.aria-pressed]="activeFilter === 'all'">
              All Tasks
            </button>
            <button class="nav-pill" 
                    [class.nav-pill-active]="activeFilter === 'active'"
                    [class.nav-pill-inactive]="activeFilter !== 'active'"
                    (click)="setFilter('active')" 
                    [attr.aria-pressed]="activeFilter === 'active'">
              Active
            </button>
            <button class="nav-pill" 
                    [class.nav-pill-active]="activeFilter === 'completed'"
                    [class.nav-pill-inactive]="activeFilter !== 'completed'"
                    (click)="setFilter('completed')" 
                    [attr.aria-pressed]="activeFilter === 'completed'">
              Completed
            </button>
            <button class="nav-pill" 
                    [class.nav-pill-active]="activeFilter === 'important'"
                    [class.nav-pill-inactive]="activeFilter !== 'important'"
                    (click)="setFilter('important')" 
                    [attr.aria-pressed]="activeFilter === 'important'">
              Important
            </button>
          </div>
        </div>
      </div>
      
      <!-- Sidebar Overlay -->
      <div *ngIf="sidebarOpen" 
           class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
           (click)="toggleSidebar()"
           [@fadeInOut]></div>

      <!-- Sidebar Navigation -->
      <div class="fixed top-0 left-0 bottom-0 w-4/5 max-w-xs bg-primary-700 text-white z-50 transform transition-transform duration-300 ease-in-out"
           [class.translate-x-0]="sidebarOpen"
           [class.translate-x-[-100%]]="!sidebarOpen">
        <div class="p-5 border-b border-primary-600">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold">My Tasks</h2>
            <button (click)="toggleSidebar()" class="p-2 rounded-full hover:bg-primary-600 transition-colors" aria-label="Close menu">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
        
        <nav class="p-3">
          <ul class="space-y-1">
            <li>
              <a routerLink="/" 
                 class="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-600 transition-colors">
                <i class="bi bi-house-door"></i>
                <span>Home</span>
              </a>
            </li>
            <li>
              <a routerLink="/todos" 
                 class="flex items-center gap-3 p-3 rounded-lg bg-primary-600 transition-colors">
                <i class="bi bi-list-check"></i>
                <span>Tasks</span>
              </a>
            </li>
            <li>
              <a routerLink="/profile" 
                 class="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-600 transition-colors">
                <i class="bi bi-person"></i>
                <span>Profile</span>
              </a>
            </li>
            <li>
              <a routerLink="/settings" 
                 class="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-600 transition-colors">
                <i class="bi bi-gear"></i>
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </nav>
        
        <div class="absolute bottom-0 left-0 right-0 p-5 border-t border-primary-600">
          <a routerLink="/logout" class="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-600 transition-colors">
            <i class="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </a>
        </div>
      </div>
      
      <!-- Tasks List with improved card design -->
      <div class="task-list px-4 pt-4 pb-20" [@listAnimation]>
        <!-- Empty state with improved styling -->
        <div *ngIf="filteredTodos.length === 0" class="empty-state py-10 flex flex-col items-center justify-center">
          <div class="empty-state-icon bg-gray-100 dark:bg-gray-800 h-20 w-20 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4">
            <i class="bi bi-clipboard text-3xl"></i>
          </div>
          <h3 class="empty-state-title text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">No tasks yet</h3>
          <p class="empty-state-description text-sm text-gray-500 dark:text-gray-400 mb-6">Tap the + button to create your first task</p>
          <button (click)="openAddModal()" class="btn btn-primary">
            <i class="bi bi-plus-circle mr-2"></i>
            Add Your First Task
          </button>
        </div>

        <!-- Task Items with improved design and micro-interactions -->
        <div *ngFor="let todo of filteredTodos" 
             class="task-item relative mb-4 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md" 
             [class.task-item-completed]="todo.completed"
             [@itemAnimation]>
          <div class="p-4">
            <div class="flex items-start gap-3">
              <!-- Improved checkbox with ripple effect -->
              <button (click)="toggleTodo(todo.id!)"
                      class="flex-shrink-0 h-5 w-5 rounded-full border-2 border-primary dark:border-primary-hover
                           flex items-center justify-center mt-1 transition-all duration-200
                           hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      [class.bg-primary]="todo.completed" 
                      [class.border-opacity-50]="todo.completed"
                      aria-label="Mark task as complete">
                <i *ngIf="todo.completed" class="bi bi-check text-white text-xs"></i>
              </button>
              
              <div class="flex-grow">
                <!-- Improved typography and spacing -->
                <div class="flex justify-between items-start mb-1.5">
                  <h3 class="font-medium text-gray-800 dark:text-white" 
                      [class.line-through]="todo.completed" 
                      [class.text-gray-500]="todo.completed"
                      [class.dark:text-gray-400]="todo.completed">
                    {{ todo.title }}
                  </h3>
                  <!-- Due date badge with improved styling -->
                  <span *ngIf="todo.dueDate" class="ml-2 flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [ngClass]="{
                          'bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-hover': !isOverdue(todo) && !todo.completed,
                          'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400': isOverdue(todo) && !todo.completed,
                          'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400': todo.completed
                        }">
                    {{ formatDate(todo.dueDate) }}
                  </span>
                </div>
                
                <!-- Description with improved readability -->
                <p *ngIf="todo.description" class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2"
                   [class.text-gray-400]="todo.completed"
                   [class.dark:text-gray-500]="todo.completed"
                   [class.line-through]="todo.completed">
                  {{ todo.description }}
                </p>
                
                <!-- Bottom row with improved layout -->
                <div class="flex justify-between items-center">
                  <!-- Priority indicator with more intuitive colors -->
                  <div *ngIf="todo.priority" class="priority-indicator flex items-center">
                    <i class="bi bi-flag-fill mr-1.5" 
                       [class.text-danger]="todo.priority === 'high' && !todo.completed"
                       [class.dark:text-red-400]="todo.priority === 'high' && !todo.completed"
                       [class.text-warning]="todo.priority === 'medium' && !todo.completed"
                       [class.dark:text-yellow-400]="todo.priority === 'medium' && !todo.completed"
                       [class.text-success]="todo.priority === 'low' && !todo.completed"
                       [class.dark:text-green-400]="todo.priority === 'low' && !todo.completed"
                       [class.text-gray-400]="todo.completed"
                       [class.dark:text-gray-500]="todo.completed"></i>
                    <span class="text-xs text-gray-500 dark:text-gray-400"
                          [class.text-gray-400]="todo.completed"
                          [class.dark:text-gray-500]="todo.completed">
                      {{ todo.priority | titlecase }}
                    </span>
                  </div>
                  
                  <!-- Action buttons with improved touch targets and feedback -->
                  <div class="flex gap-2">
                    <button (click)="openEditModal(todo)"
                            class="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                                  text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-hover
                                  transition-colors active:scale-95"
                            aria-label="Edit task">
                      <i class="bi bi-pencil text-sm"></i>
                    </button>
                    <button (click)="deleteTodo(todo.id!)"
                            class="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                                  text-gray-500 dark:text-gray-400 hover:text-danger dark:hover:text-danger
                                  transition-colors active:scale-95"
                            aria-label="Delete task">
                      <i class="bi bi-trash text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Action Button with improved animation -->
      <button (click)="openAddModal()"
              class="fab shadow-xl active:scale-95 transition-transform"
              aria-label="Add new task">
        <i class="bi bi-plus text-xl"></i>
      </button>

      <!-- Bottom Navigation with improved visual feedback -->
      <div class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800
                  h-16 flex items-center justify-around z-40 shadow-lg">
        <a routerLink="/" class="flex flex-col items-center justify-center h-full py-1 w-full
                          text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-hover
                          transition-colors">
          <i class="bi bi-house-door text-xl mb-0.5"></i>
          <span class="text-xs">Home</span>
        </a>
        <a routerLink="/todos" class="flex flex-col items-center justify-center h-full py-1 w-full
                          text-primary dark:text-primary-hover"
                   aria-current="page">
          <i class="bi bi-list-check text-xl mb-0.5"></i>
          <span class="text-xs font-medium">Tasks</span>
        </a>
        <div class="flex flex-col items-center justify-center h-full py-1 w-full">
          <button (click)="openAddModal()" 
                  class="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg transform -translate-y-5 hover:bg-primary-hover active:scale-95 transition-all">
            <i class="bi bi-plus text-xl"></i>
          </button>
          <span class="text-xs mt-1.5 text-primary dark:text-primary-hover font-medium">Add</span>
        </div>
        <a routerLink="/profile" class="flex flex-col items-center justify-center h-full py-1 w-full
                          text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-hover
                          transition-colors">
          <i class="bi bi-person text-xl mb-0.5"></i>
          <span class="text-xs">Profile</span>
        </a>
        <a routerLink="/settings" class="flex flex-col items-center justify-center h-full py-1 w-full
                          text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-hover
                          transition-colors">
          <i class="bi bi-gear text-xl mb-0.5"></i>
          <span class="text-xs">Settings</span>
        </a>
      </div>

      <!-- Modal -->
      <app-todo-edit-modal *ngIf="showModal" [todo]="selectedTodo" (save)="onModalSave($event)" (close)="closeModal()"></app-todo-edit-modal>
      
      <!-- Toast Notifications -->
      <app-toast-notifications></app-toast-notifications>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    
    .mobile-container {
      min-height: 100vh;
      padding-bottom: 5rem; /* Space for bottom nav */
      overflow-y: auto;
      overflow-x: hidden;
    }
    
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    
    .nav-pill {
      @apply px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap;
    }
    
    .nav-pill-active {
      @apply bg-primary text-white;
    }
    
    .nav-pill-inactive {
      @apply bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300;
    }
    
    .fab {
      @apply fixed right-6 bottom-24 bg-primary hover:bg-primary-hover text-white h-14 w-14 rounded-full flex items-center justify-center shadow-lg z-50;
    }
    
    .btn {
      @apply px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center;
    }
    
    .btn-primary {
      @apply bg-primary hover:bg-primary-hover text-white;
    }
  `]
})
export class MobileTodoListComponent implements OnInit {
  @Input() todos: Todo[] = [];
  @Input() filteredTodos: Todo[] = [];
  @Output() toggleComplete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<string>();
  @Output() add = new EventEmitter<Partial<Todo>>();
  @Output() search = new EventEmitter<any>();
  
  sidebarOpen = false;
  activeFilter = 'all';
  selectedTodo: Todo | null = null;
  showModal = false;
  
  constructor() {}
  
  ngOnInit(): void {}
  
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
  
  setFilter(filter: string): void {
    this.activeFilter = filter;
    // Emit search/filter event
    this.search.emit({
      term: '',
      filterType: 'all',
      taskStatus: filter === 'all' ? 'all' : filter === 'active' ? 'active' : filter === 'completed' ? 'completed' : 'all'
    });
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