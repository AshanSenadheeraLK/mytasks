import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService, Todo } from '../../services/todo.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TodoEditModalComponent } from './todo-edit-modal.component';
import { AlertService } from '../../services/alert.service';

const version = '1.0.0.0';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoEditModalComponent],
  template: `
    <div class="neo-navbar fixed-top bg-black">
      <div class="container-fluid py-3">
        <!-- Header -->
        <div class="row align-items-center">
          <div class="col-lg-6">
            <div class="d-flex align-items-center">
              <h1 class="me-3 neon-text mb-0">MY TASKS</h1>
              <span class="badge rounded-pill neo-card px-3 py-2 hologram-effect" [innerHTML]="getVersion()"></span>
            </div>
            <p class="text-primary mb-0">Keep track of your tasks</p>
          </div>
          <div class="col-lg-6">
            <div class="d-flex justify-content-lg-end align-items-center mt-3 mt-lg-0">
              <div class="user-badge neo-card me-3 p-2 px-3 d-flex align-items-center">
                <i class="bi bi-person-circle me-2" aria-hidden="true"></i>
                <span>{{ (userEmail$ | async) || 'User' }}</span>
              </div>
              <button 
                class="neo-btn" 
                (click)="logout()"
                aria-label="Sign out"
                title="Sign out from your account">
                <i class="bi bi-box-arrow-right me-2" aria-hidden="true"></i>Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid main-content">
      <div class="row">
        <!-- Stats Sidebar -->
        <div class="col-lg-3 mb-4">
          <div class="neo-card p-4 mb-4">
            <h2 class="h5 mb-3 text-center"><i class="bi bi-bar-chart-line me-2" aria-hidden="true"></i>Task Summary</h2>
            <div class="stats-container">
              <div class="stat-item text-center mb-3 glass-card">
                <div class="stat-value">{{ getCompletedCount(todos) }}</div>
                <div class="stat-label">DONE</div>
                <div class="progress mt-2" style="height: 4px;" aria-hidden="true">
                  <div class="progress-bar" 
                       role="progressbar" 
                       [style.width.%]="getCompletionRate(todos)" 
                       [style.background-image]="'var(--future-gradient)'"
                       [attr.aria-valuenow]="getCompletionRate(todos)"
                       aria-valuemin="0"
                       aria-valuemax="100">
                  </div>
                </div>
              </div>
              <div class="stat-item text-center mb-3 glass-card">
                <div class="stat-value">{{ getActiveCount(todos) }}</div>
                <div class="stat-label">TO DO</div>
              </div>
              <div class="stat-item text-center glass-card">
                <div class="stat-value">{{ todos.length || 0 }}</div>
                <div class="stat-label">TOTAL</div>
              </div>
            </div>
          </div>
          
          <div class="neo-card p-4">
            <h2 class="h5 mb-3 text-center"><i class="bi bi-filter-circle me-2" aria-hidden="true"></i>View Options</h2>
            <div class="d-flex flex-column">
              <button class="neo-btn mb-2" 
                      [class.active]="filter === 'all'"
                      (click)="filter = 'all'"
                      [attr.aria-pressed]="filter === 'all'"
                      title="Show all tasks">
                <i class="bi bi-infinity me-2" aria-hidden="true"></i>All Tasks
              </button>
              <button class="neo-btn mb-2" 
                      [class.active]="filter === 'active'"
                      (click)="filter = 'active'"
                      [attr.aria-pressed]="filter === 'active'"
                      title="Show only pending tasks">
                <i class="bi bi-circle me-2" aria-hidden="true"></i>Pending Tasks
              </button>
              <button class="neo-btn" 
                      [class.active]="filter === 'completed'"
                      (click)="filter = 'completed'"
                      [attr.aria-pressed]="filter === 'completed'"
                      title="Show only completed tasks">
                <i class="bi bi-check-circle me-2" aria-hidden="true"></i>Completed Tasks
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="col-lg-9">
          <!-- Add Task Button -->
          <div class="neo-card p-4 mb-4">
            <div class="d-flex justify-content-between align-items-center">
              <h2 class="h5 mb-0"><i class="bi bi-plus-circle me-2 text-primary" aria-hidden="true"></i>Tasks</h2>
              <button 
                class="neo-btn" 
                (click)="openAddModal()"
                aria-label="Add new task"
                title="Create a new task">
                <i class="bi bi-plus-lg me-2" aria-hidden="true"></i>Add Task
              </button>
            </div>
          </div>

          <!-- Task List -->
          <div class="neo-card p-4">
            <h2 class="h5 mb-3"><i class="bi bi-list-check me-2" aria-hidden="true"></i>My Tasks</h2>
            <div *ngIf="(todos$ | async) as todos">
              <div *ngIf="todos.length > 0; else emptyState">
                <div *ngFor="let todo of getFilteredTodos(todos)" class="glass-card mb-3 p-3 hover-glow task-item">
                  <div class="d-flex justify-content-between align-items-start">
                    <div class="d-flex align-items-start flex-grow-1">
                      <div>
                        <input 
                          class="neo-check me-3 mt-1" 
                          type="checkbox" 
                          [checked]="todo.completed"
                          (change)="toggleTodo(todo.id!)"
                          [id]="'check-' + todo.id" 
                          [attr.aria-label]="'Mark ' + (todo.title || '') + ' as ' + (todo.completed ? 'incomplete' : 'complete')"
                          [title]="'Mark ' + (todo.title || '') + ' as ' + (todo.completed ? 'incomplete' : 'complete')">
                      </div>
                      <div class="flex-grow-1">
                        <label 
                          class="task-title text-white" 
                          [for]="'check-' + todo.id"
                          [class.text-decoration-line-through]="todo.completed">
                          {{ todo.title }}
                        </label>
                        <p class="text-white small mb-1" *ngIf="todo.description">
                          {{ todo.description }}
                        </p>
                        <div class="d-flex align-items-center flex-wrap gap-2">
                          <small class="text-primary me-2">
                            <i class="bi bi-clock-history me-1" aria-hidden="true"></i>Created: {{ formatDate(todo.createdAt) }}
                          </small>
                          <small class="text-primary me-2" *ngIf="todo.dueDate">
                            <i class="bi bi-calendar-event me-1" aria-hidden="true"></i>Due: {{ formatDate(todo.dueDate) }}
                          </small>
                          <span class="badge rounded-pill neo-card px-2 py-1">
                            {{ todo.completed ? 'DONE' : 'PENDING' }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <button 
                        class="btn btn-sm neo-btn-secondary me-2"
                        (click)="openEditModal(todo)"
                        aria-label="Edit task"
                        title="Edit this task">
                        <i class="bi bi-pencil-square" aria-hidden="true"></i>
                      </button>
                      <button 
                        class="btn btn-sm neo-btn-delete"
                        (click)="deleteTodo(todo.id!)"
                        aria-label="Delete task"
                        title="Delete this task">
                        <i class="bi bi-trash3" aria-hidden="true"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <ng-template #emptyState>
                <div class="text-center py-5 glass-card hologram-effect">
                  <i class="bi bi-clipboard-check display-1 text-primary" aria-hidden="true"></i>
                  <h3 class="mt-3">No Tasks Yet</h3>
                  <p class="text-primary">Click the Add Task button to get started.</p>
                </div>
              </ng-template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit/Add Modal -->
    <app-todo-edit-modal
      *ngIf="showModal"
      [todo]="selectedTodo"
      [isNewTodo]="!selectedTodo"
      (save)="onModalSave($event)"
      (close)="closeModal()">
    </app-todo-edit-modal>
  `,
  styles: [`
    h1, h2, h3, h4, h5, h6 {
      color: white;
    }
    .user-badge {
      color: var(--neon-blue);
    }
    
    .form-label {
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    .text-primary {
      color: var(--text-primary) !important;
    }

    .neo-btn-secondary {
      background: transparent;
      border: 1px solid var(--neon-blue);
      color: var(--neon-blue);
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .neo-btn-secondary:hover {
      background: rgba(0, 242, 254, 0.2); /* neon-blue with alpha */
      color: var(--neon-blue);
      box-shadow: 0 0 10px rgba(0, 242, 254, 0.4); /* neon-blue shadow */
    }
    
    .neo-btn-delete {
      background: transparent;
      border: 1px solid var(--text-danger);
      color: var(--text-danger);
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }
    
    .neo-btn-delete:hover {
      background: rgba(255, 64, 64, 0.2);
      color: var(--text-danger);
      box-shadow: 0 0 10px rgba(255, 64, 64, 0.4);
    }

    .neo-btn-success {
      background: transparent;
      border: 1px solid var(--text-success);
      color: var(--text-success);
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .neo-btn-success:hover {
      background: rgba(0, 255, 128, 0.2); /* Assuming text-success is a green */
      color: var(--text-success);
      box-shadow: 0 0 10px rgba(0, 255, 128, 0.4);
    }
    
    .neo-btn-warning {
      background: transparent;
      border: 1px solid var(--text-warning);
      color: var(--text-warning);
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .neo-btn-warning:hover {
      background: rgba(255, 193, 7, 0.2); /* Assuming text-warning is a yellow/orange */
      color: var(--text-warning);
      box-shadow: 0 0 10px rgba(255, 193, 7, 0.4);
    }
    
    .task-title {
      font-weight: 500;
      font-size: 1.1rem;
      margin-bottom: 0.2rem;
      transition: all 0.3s ease;
    }
    
    .task-item {
      transition: all 0.3s ease;
    }
    
    .neo-btn.active {
      background: var(--neon-blue);
      box-shadow: 0 0 20px rgba(0, 242, 254, 0.5);
    }
    
    .neo-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      font-family: 'Orbitron', sans-serif;
      color: var(--neon-blue);
    }
    
    .stat-label {
      font-size: 0.8rem;
      letter-spacing: 1px;
      color: var(--text-primary);
    }
  `]
})
export class TodoListComponent implements OnInit {
  todos$!: Observable<Todo[]>;
  userEmail$!: Observable<string | null>;
  todos: Todo[] = [];
  filter: 'all' | 'active' | 'completed' = 'all';
  
  // Modal state
  showModal = false;
  selectedTodo: Todo | null = null;
  private isBrowser: boolean;

  constructor(
    private todoService: TodoService,
    private authService: AuthService,
    private alertService: AlertService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.todos$ = this.todoService.todos$.pipe(
        map(todos => {
          this.todos = todos;
          return todos;
        })
      );
      
      this.userEmail$ = this.authService.user$.pipe(
        map(user => user?.email || null)
      );
    }
  }

  getFilteredTodos(todos: Todo[]): Todo[] {
    if (!todos) return [];
    switch (this.filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }

  openAddModal() {
    if (!this.isBrowser) return;
    this.selectedTodo = null;
    this.showModal = true;
  }

  openEditModal(todo: Todo) {
    if (!this.isBrowser) return;
    this.selectedTodo = { ...todo };
    this.showModal = true;
  }

  closeModal() {
    if (!this.isBrowser) return;
    this.showModal = false;
    this.selectedTodo = null;
  }

  async onModalSave(todoData: Partial<Todo>) {
    if (!this.isBrowser) return;
    
    try {
      if (this.selectedTodo?.id) {
        // Editing existing todo
        await this.todoService.updateTodo(this.selectedTodo.id, todoData);
        this.alertService.addAlert('Task updated successfully', 'success');
      } else {
        // Adding new todo
        await this.todoService.addTodo(
          todoData.title!,
          todoData.description,
          todoData.dueDate as Date
        );
        this.alertService.addAlert('New task added successfully', 'success');
      }
      this.closeModal();
    } catch (error) {
      console.error('Error saving todo:', error);
      this.alertService.addAlert('Could not save task. Please try again.', 'error');
    }
  }

  async toggleTodo(id: string) {
    if (!this.isBrowser) return;
    
    try {
      await this.todoService.toggleTodoComplete(id);
      const todo = this.todos.find(t => t.id === id);
      const status = todo?.completed ? 'completed' : 'pending';
      this.alertService.addAlert(`Task marked as ${status}`, 'info');
    } catch (error) {
      console.error('Error toggling todo:', error);
      this.alertService.addAlert('Could not update task. Please try again.', 'error');
    }
  }

  async deleteTodo(id: string) {
    if (!this.isBrowser) return;
    
    try {
      await this.todoService.deleteTodo(id);
      this.alertService.addAlert('Task deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting todo:', error);
      this.alertService.addAlert('Could not delete task. Please try again.', 'error');
    }
  }

  formatDate(date: Date | any): string {
    if (!this.isBrowser) return '';
    
    try {
      if (date?.toDate && typeof date.toDate === 'function') {
        // Handle Firestore Timestamp
        return new Date(date.toDate()).toLocaleString();
      } else if (date instanceof Date) {
        return date.toLocaleString();
      }
    } catch (error) {
      console.error('Error formatting date:', error);
    }
    
    return '';
  }

  getVersion(): string {
    return version;
  }

  getActiveCount(todos: Todo[]): number {
    return todos?.filter(todo => !todo.completed).length || 0;
  }

  getCompletedCount(todos: Todo[]): number {
    return todos?.filter(todo => todo.completed).length || 0;
  }

  getCompletionRate(todos: Todo[]): number {
    if (!todos || todos.length === 0) return 0;
    return (this.getCompletedCount(todos) / todos.length) * 100;
  }

  async logout() {
    try {
      await this.authService.logout();
      this.alertService.addAlert('You have been signed out successfully', 'info');
    } catch (error) {
      console.error('Error logging out:', error);
      this.alertService.addAlert('Could not sign out. Please try again.', 'error');
    }
  }
} 