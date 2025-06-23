import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DeviceService } from '../../services/device.service';
import { Subscription } from 'rxjs';
import { MobileTodoListComponent } from './mobile-todo-list.component';
import { TabletTodoListComponent } from './tablet-todo-list.component';
import { RouterModule, Router } from '@angular/router';
import { TodoService, Todo } from '../../services/todo.service';
import { AlertService } from '../../services/alert.service';
import { SearchBarComponent, SearchFilter } from '../shared/search-bar.component';

@Component({
  selector: 'app-responsive-todo-list',
  standalone: true,
  imports: [CommonModule, MobileTodoListComponent, TabletTodoListComponent, RouterModule, SearchBarComponent],
  template: `
    <ng-container [ngSwitch]="currentDevice">
      <app-mobile-todo-list 
        *ngSwitchCase="'mobile'"
        [todos]="todos"
        [filteredTodos]="filteredTodos"
        (toggleComplete)="toggleTodo($event)"
        (edit)="onEdit($event)"
        (delete)="deleteTodo($event)"
        (add)="onAdd($event)"
        (search)="onSearch($event)">
      </app-mobile-todo-list>
      
      <app-tablet-todo-list 
        *ngSwitchCase="'tablet'"
        [todos]="todos"
        [filteredTodos]="filteredTodos"
        (toggleComplete)="toggleTodo($event)"
        (edit)="onEdit($event)"
        (delete)="deleteTodo($event)"
        (add)="onAdd($event)"
        (search)="onSearch($event)"
        (filter)="onSearch($event)">
      </app-tablet-todo-list>
      
      <!-- Default to original desktop component when device is desktop -->
      <router-outlet *ngSwitchCase="'desktop'"></router-outlet>
      <router-outlet *ngSwitchDefault></router-outlet>
    </ng-container>
  `
})
export class ResponsiveTodoListComponent implements OnInit, OnDestroy {
  currentDevice: string = 'desktop';
  private deviceSubscription: Subscription | null = null;
  private todosSubscription: Subscription | null = null;
  private isBrowser: boolean;
  
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  searchFilter: SearchFilter = { term: '', filterType: 'all', taskStatus: 'all' };

  constructor(
    private deviceService: DeviceService,
    private todoService: TodoService,
    private alertService: AlertService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      return; // No need to subscribe on server
    }
    
    this.deviceSubscription = this.deviceService.deviceType$.subscribe(deviceType => {
      this.currentDevice = deviceType;
    });
    
    // Subscribe to todos from the service
    this.todosSubscription = this.todoService.todos$.subscribe(todos => {
      this.todos = todos;
      this.applyFilters();
    });
  }
  
  applyFilters(): void {
    this.filteredTodos = this.getFilteredTodos(this.todos);
  }
  
  getFilteredTodos(sourceTodos: Todo[]): Todo[] {
    let filtered = [...sourceTodos];

    // Apply task status filter
    if (this.searchFilter.taskStatus !== 'all') {
      filtered = filtered.filter(todo => 
        this.searchFilter.taskStatus === 'completed' ? todo.completed : !todo.completed
      );
    }

    // Apply search term and filter type
    if (this.searchFilter.term) {
      const searchTerm = this.searchFilter.term.toLowerCase();
      filtered = filtered.filter(todo => {
        switch (this.searchFilter.filterType) {
          case 'title':
            return todo.title.toLowerCase().includes(searchTerm);
          case 'description':
            return todo.description?.toLowerCase().includes(searchTerm) ?? false;
          case 'priority':
            return todo.priority === this.searchFilter.priorityValue;
          default: // 'all'
            return todo.title.toLowerCase().includes(searchTerm) ||
                   (todo.description?.toLowerCase().includes(searchTerm) ?? false);
        }
      });
    }
    
    // Apply priority filter if available
    if (this.searchFilter.filterType === 'priority' && this.searchFilter.priorityValue) {
      filtered = filtered.filter(todo => todo.priority === this.searchFilter.priorityValue);
    }
    


    return filtered;
  }
  
  onSearch(searchFilterFromBar: SearchFilter): void {
    this.searchFilter = searchFilterFromBar;
    this.applyFilters();
  }
  
  toggleTodo(id: string): void {
    if (!this.isBrowser) return;
    
    this.todoService.toggleTodoComplete(id)
      .then(() => {
        const todo = this.todos.find(t => t.id === id);
        const status = todo?.completed ? 'completed' : 'pending';
        this.alertService.addAlert(`Task marked as ${status}!`, 'info', true, true);
      })
      .catch(error => {
        console.error('Error toggling todo:', error);
        this.alertService.addAlert('Could not update task status. Please try again.', 'error', true, true);
      });
  }
  
  deleteTodo(id: string): void {
    if (!this.isBrowser) return;
    
    this.todoService.deleteTodo(id)
      .then(() => {
        this.alertService.addAlert('Task deleted successfully!', 'warning', true, true);
      })
      .catch(error => {
        console.error('Error deleting todo:', error);
        this.alertService.addAlert('Could not delete task. Please try again.', 'error', true, true);
      });
  }
  
  onEdit(todo: Todo): void {
    if (!todo || !todo.id || !this.isBrowser) return;
    
    this.todoService.updateTodo(todo.id, {
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate,
      priority: todo.priority,
      completed: todo.completed
    })
    .then(() => {
      this.alertService.addAlert('Task updated successfully!', 'success', true, true);
    })
    .catch(error => {
      console.error('Error updating todo:', error);
      this.alertService.addAlert('Could not update task. Please try again.', 'error', true, true);
    });
  }
  
  onAdd(todoData: Partial<Todo>): void {
    if (!this.isBrowser) return;
    
    this.todoService.addTodo(
      todoData.title || 'New Task',
      todoData.description,
      todoData.dueDate as Date,
      todoData.priority as 'low' | 'medium' | 'high'
    )
    .then(() => {
      this.alertService.addAlert('Task created successfully!', 'success', true, true);
    })
    .catch(error => {
      console.error('Error creating todo:', error);
      this.alertService.addAlert('Could not create task. Please try again.', 'error', true, true);
    });
  }

  ngOnDestroy(): void {
    if (this.deviceSubscription) {
      this.deviceSubscription.unsubscribe();
    }
    
    if (this.todosSubscription) {
      this.todosSubscription.unsubscribe();
    }
  }
} 