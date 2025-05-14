import { Component, EventEmitter, Input, OnInit, Output, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../services/todo.service';

@Component({
  selector: 'app-todo-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="onClose()"></div>
    <div class="modal-dialog">
      <div class="modal-content neo-card">
        <div class="modal-header border-0">
          <h5 class="modal-title">{{ isNewTodo ? 'Add New Task' : 'Edit Task' }}</h5>
          <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="onClose()" title="Close this modal"></button>
        </div>
        <div class="modal-body">
          <form #todoForm="ngForm" (ngSubmit)="onSave()">
            <div class="mb-3">
              <label for="title" class="form-label">Task Title</label>
              <input 
                type="text" 
                class="neo-input form-control" 
                id="title"
                name="title"
                [(ngModel)]="editedTodo.title"
                required
                #titleInput="ngModel">
              <div *ngIf="titleInput.invalid && (titleInput.dirty || titleInput.touched)" class="text-danger">
                Title is required
              </div>
            </div>

            <div class="mb-3">
              <label for="description" class="form-label">Description</label>
              <textarea 
                class="neo-input form-control" 
                id="description"
                name="description"
                [(ngModel)]="editedTodo.description"
                rows="3"></textarea>
            </div>

            <div class="mb-3">
              <label for="dueDate" class="form-label">Due Date</label>
              <input 
                type="date" 
                class="neo-input form-control" 
                id="dueDate"
                name="dueDate"
                [ngModel]="getDueDate() | date:'yyyy-MM-dd'"
                (ngModelChange)="onDateChange($event)">
            </div>

            <div class="mb-3">
              <label for="dueTime" class="form-label">Due Time</label>
              <input 
                type="time" 
                class="neo-input form-control" 
                id="dueTime"
                name="dueTime"
                [ngModel]="getDueDate() | date:'HH:mm'"
                (ngModelChange)="onTimeChange($event)">
            </div>

            <div class="modal-footer border-0 px-0 pb-0">
              <button 
                type="button" 
                class="neo-btn-secondary" 
                (click)="onClose()"
                title="Cancel and close the form">
                Cancel
              </button>
              <button 
                type="submit" 
                class="neo-btn-primary" 
                [disabled]="!todoForm.form.valid"
                title="{{ isNewTodo ? 'Add this new task' : 'Save changes to this task' }}">
                {{ isNewTodo ? 'Add Task' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      z-index: 1040;
    }

    .modal-dialog {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1045;
      width: 100%;
      max-width: 625px;
    }

    .modal-content {
      background: var(--card-bg);
      border: 1px solid var(--neon-blue);
      box-shadow: 0 0 20px rgba(0, 242, 254, 0.1);
    }

    .modal-header {
      background: transparent;
    }

    .modal-title {
      color: var(--text-primary);
    }

    .form-label {
      color: var(--text-primary);
    }

    .neo-input {
      background: white;
      border: 1px solid var(--border-color);
      color: black;
    }

    .neo-input:focus {
      border-color: var(--neon-blue);
      box-shadow: 0 0 0 0.2rem rgba(0, 242, 254, 0.25);
    }

    .neo-btn-primary {
      background: var(--neon-blue);
      border: none;
      color: var(--text-dark);
      padding: 0.5rem 1.5rem;
      border-radius: 0.25rem;
      transition: all 0.3s ease;
    }

    .neo-btn-primary:hover:not(:disabled) {
      box-shadow: 0 0 15px var(--neon-blue);
    }

    .neo-btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .neo-btn-secondary {
      background: transparent;
      border: 1px solid var(--neon-blue);
      color: var(--neon-blue);
      padding: 0.5rem 1.5rem;
      border-radius: 0.25rem;
      transition: all 0.3s ease;
    }

    .neo-btn-secondary:hover {
      background: rgba(0, 242, 254, 0.1);
    }
  `]
})
export class TodoEditModalComponent implements OnInit {
  @Input() todo: Todo | null = null;
  @Input() isNewTodo = false;
  @Output() save = new EventEmitter<Partial<Todo>>();
  @Output() close = new EventEmitter<void>();

  editedTodo: Partial<Todo> = {};
  private tempDate: string = '';
  private tempTime: string = '';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) {
      // Skip date processing on server
      return;
    }

    if (this.todo) {
      this.editedTodo = { ...this.todo };
    } else {
      this.editedTodo = {
        title: '',
        description: '',
        completed: false,
        dueDate: new Date()
      };
    }
    
    // Initialize tempDate and tempTime if dueDate exists
    if (this.editedTodo.dueDate) {
      // Use the getDueDate helper to safely convert to Date
      const date = this.getDueDate();
      if (date) {
        this.tempDate = date.toISOString().split('T')[0];
        this.tempTime = date.toTimeString().slice(0, 5);
      }
    }
  }

  onDateChange(date: string) {
    if (!this.isBrowser) return;
    this.tempDate = date;
    this.updateDueDate();
  }

  onTimeChange(time: string) {
    if (!this.isBrowser) return;
    this.tempTime = time;
    this.updateDueDate();
  }

  private updateDueDate() {
    if (!this.isBrowser) return;
    
    if (this.tempDate) {
      try {
        const [year, month, day] = this.tempDate.split('-').map(Number);
        const [hours, minutes] = (this.tempTime || '00:00').split(':').map(Number);
        const dueDate = new Date(year, month - 1, day, hours, minutes);
        this.editedTodo.dueDate = dueDate;
      } catch (error) {
        console.error('Error updating due date:', error);
      }
    }
  }

  onSave() {
    if (this.editedTodo.title?.trim()) {
      this.save.emit(this.editedTodo);
    }
  }

  onClose() {
    this.close.emit();
  }

  getDueDate(): Date | null {
    if (!this.isBrowser) return null;
    if (!this.editedTodo.dueDate) return null;
    
    try {
      if (this.editedTodo.dueDate instanceof Date) return this.editedTodo.dueDate;
      // Handle Firestore Timestamp
      if (this.editedTodo.dueDate?.toDate && typeof this.editedTodo.dueDate.toDate === 'function') {
        return this.editedTodo.dueDate.toDate();
      }
    } catch (error) {
      console.error('Error getting due date:', error);
    }
    
    return null;
  }
} 