import { Component, EventEmitter, Input, OnInit, Output, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../services/todo.service';

@Component({
  selector: 'app-todo-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div 
      class="fixed inset-0 bg-black/70 backdrop-blur-md z-50 transition-opacity duration-300 flex items-center justify-center overflow-auto px-4 py-8"
      [class.animate-fade-in]="true"
      (click)="onClose()"
      role="dialog"
      aria-labelledby="modalTitle"
      aria-modal="true">
      <div 
        class="bg-white dark:bg-gray-800 max-w-md w-full mx-auto transform transition-all duration-300 animate-slide-up shadow-2xl rounded-3xl overflow-hidden mobile-device:max-h-[95vh] mobile-device:overflow-y-auto"
        [class.scale-100]="true" 
        [class.opacity-100]="true"
        (click)="$event.stopPropagation()">
        
        <!-- Decorative top bar with accent color -->
        <div class="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        
        <!-- Header with clean design -->
        <div class="px-8 pt-7 pb-4">
          <h3 id="modalTitle" class="text-2xl font-display font-bold text-gray-800 dark:text-white flex items-center">
            {{ isNewTodo ? 'Add New Task' : 'Edit Task' }}
          </h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">{{ isNewTodo ? 'Create a new task with all the details you need' : 'Update your task information' }}</p>
        </div>
        
        <!-- Form body with soft background -->
        <div class="px-8 py-6 bg-gray-50 dark:bg-gray-700 rounded-t-3xl mobile-device:pb-16">
          <form #todoForm="ngForm" (ngSubmit)="onSave()" class="space-y-5">
            <!-- Title Field -->
            <div class="space-y-2">
              <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Task Title <span class="text-red-500">*</span>
              </label>
              <div class="relative rounded-xl shadow-sm">
                <input 
                  type="text" 
                  class="block w-full pl-4 pr-10 py-3 border-0 ring-1 ring-gray-300 dark:ring-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  id="title"
                  name="title"
                  [(ngModel)]="editedTodo.title"
                  placeholder="What needs to be done?"
                  required
                  autocomplete="off"
                  #titleInput="ngModel">
                <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>
              </div>
              <div 
                *ngIf="titleInput.invalid && (titleInput.dirty || titleInput.touched)" 
                class="text-red-500 text-sm animate-fade-in flex items-center mt-1">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span *ngIf="titleInput.errors?.['required']">Title is required</span>
              </div>
            </div>

            <!-- Description Field -->
            <div class="space-y-2">
              <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <div class="relative rounded-xl shadow-sm">
                <textarea 
                  class="block w-full pl-4 pr-10 py-3 border-0 ring-1 ring-gray-300 dark:ring-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  id="description"
                  name="description"
                  [(ngModel)]="editedTodo.description"
                  placeholder="Add more details about this task..."
                  rows="3"></textarea>
                <div class="absolute top-3 right-0 flex items-center pr-3">
                  <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Priority Section -->
            <div class="space-y-3">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Priority
              </label>
              <div class="grid grid-cols-3 gap-2">
                <!-- Low Priority Button -->
                <button 
                  type="button"
                  [ngClass]="{
                    'relative flex flex-col items-center justify-center px-4 py-3 border rounded-xl cursor-pointer focus:outline-none transition-all duration-200': true,
                    'border-green-200 bg-green-50 dark:bg-green-900/20 shadow-md': editedTodo.priority === 'low',
                    'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800': !editedTodo.priority || editedTodo.priority !== 'low'
                  }"
                  (click)="setPriority('low')">
                  <div class="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 mb-1">
                    <svg class="w-5 h-5 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div class="text-sm font-medium" 
                    [ngClass]="{
                      'text-green-700 dark:text-green-400': editedTodo.priority === 'low',
                      'text-gray-700 dark:text-gray-300': !editedTodo.priority || editedTodo.priority !== 'low'
                    }">Low</div>
                </button>
                
                <!-- Medium Priority Button -->
                <button 
                  type="button"
                  [ngClass]="{
                    'relative flex flex-col items-center justify-center px-4 py-3 border rounded-xl cursor-pointer focus:outline-none transition-all duration-200': true,
                    'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 shadow-md': editedTodo.priority === 'medium',
                    'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800': !editedTodo.priority || editedTodo.priority !== 'medium'
                  }"
                  (click)="setPriority('medium')">
                  <div class="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-1">
                    <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01" />
                    </svg>
                  </div>
                  <div class="text-sm font-medium"
                    [ngClass]="{
                      'text-yellow-700 dark:text-yellow-400': editedTodo.priority === 'medium',
                      'text-gray-700 dark:text-gray-300': !editedTodo.priority || editedTodo.priority !== 'medium'
                    }">Medium</div>
                </button>
                
                <!-- High Priority Button -->
                <button 
                  type="button"
                  [ngClass]="{
                    'relative flex flex-col items-center justify-center px-4 py-3 border rounded-xl cursor-pointer focus:outline-none transition-all duration-200': true,
                    'border-red-200 bg-red-50 dark:bg-red-900/20 shadow-md': editedTodo.priority === 'high',
                    'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800': !editedTodo.priority || editedTodo.priority !== 'high'
                  }"
                  (click)="setPriority('high')">
                  <div class="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 mb-1">
                    <svg class="w-5 h-5 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                  <div class="text-sm font-medium"
                    [ngClass]="{
                      'text-red-700 dark:text-red-400': editedTodo.priority === 'high',
                      'text-gray-700 dark:text-gray-300': !editedTodo.priority || editedTodo.priority !== 'high'
                    }">High</div>
                </button>
              </div>
            </div>

            <!-- Due Date and Time -->
            <div class="space-y-3">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Due Date & Time
              </label>
              <div class="grid grid-cols-2 gap-3">
                <!-- Date -->
                <div class="relative rounded-xl shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input 
                    type="date" 
                    class="block w-full pl-10 pr-3 py-3 border-0 ring-1 ring-gray-300 dark:ring-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    id="dueDate"
                    name="dueDate"
                    [ngModel]="getDueDate() | date:'yyyy-MM-dd'"
                    (ngModelChange)="onDateChange($event)">
                </div>
                
                <!-- Time -->
                <div class="relative rounded-xl shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input 
                    type="time" 
                    class="block w-full pl-10 pr-3 py-3 border-0 ring-1 ring-gray-300 dark:ring-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    id="dueTime"
                    name="dueTime"
                    [ngModel]="getDueTime()"
                    (ngModelChange)="onTimeChange($event)">
                </div>
              </div>
            </div>

            <!-- Completed Checkbox (for edit mode) -->
            <div *ngIf="!isNewTodo" class="flex items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <input 
                type="checkbox" 
                id="completed" 
                name="completed"
                [(ngModel)]="editedTodo.completed"
                class="h-5 w-5 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500">
              <label for="completed" class="ml-3 block text-gray-700 dark:text-gray-300">
                Mark as completed
              </label>
            </div>

            <!-- Action Buttons -->
            <div class="pt-5 flex gap-3 mobile-device:fixed mobile-device:bottom-0 mobile-device:left-0 mobile-device:right-0 mobile-device:bg-gray-50 mobile-device:dark:bg-gray-700 mobile-device:p-4 mobile-device:shadow-lg mobile-device:border-t mobile-device:border-gray-200 mobile-device:dark:border-gray-600 mobile-device:z-10">
              <button 
                type="button" 
                class="flex-1 flex justify-center items-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                (click)="onClose()">
                Cancel
              </button>
              <button 
                type="submit" 
                class="flex-1 flex justify-center items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                [disabled]="!todoForm.form.valid"
                [class.opacity-50]="!todoForm.form.valid"
                [class.cursor-not-allowed]="!todoForm.form.valid">
                {{ isNewTodo ? 'Add Task' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
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
        priority: 'medium',
        completed: false
      };
    }
  }

  onDateChange(date: string) {
    this.tempDate = date;
    this.updateDueDate();
  }

  onTimeChange(time: string) {
    this.tempTime = time;
    this.updateDueDate();
  }

  private updateDueDate() {
    // Only update if we have both date and time components
    if (!this.tempDate) return;
    
    try {
      // Parse the date string
      const dateParts = this.tempDate.split('-').map(part => parseInt(part, 10));
      
      // Create a new Date object
      let date: Date;
      
      if (this.tempTime) {
        // If we have time, parse and include it
        const timeParts = this.tempTime.split(':').map(part => parseInt(part, 10));
        date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1]);
      } else {
        // If no time specified, set to noon (12pm) to avoid timezone issues
        date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], 12, 0, 0);
      }
      
      // Make sure the date is valid before assigning
      if (!isNaN(date.getTime())) {
        this.editedTodo.dueDate = date;
      } else {
        console.error('Invalid date created from inputs:', this.tempDate, this.tempTime);
      }
    } catch (error) {
      console.error('Error updating due date:', error);
    }
  }

  setPriority(priority: 'low' | 'medium' | 'high') {
    this.editedTodo.priority = priority;
  }

  onSave() {
    this.save.emit(this.editedTodo);
  }

  onClose() {
    this.close.emit();
  }

  getDueDate(): Date | null {
    if (!this.editedTodo.dueDate) return null;
    
    // Handle both Date objects and Firestore Timestamps
    if (typeof this.editedTodo.dueDate === 'object' && this.editedTodo.dueDate !== null) {
      if (this.editedTodo.dueDate instanceof Date) {
        return this.editedTodo.dueDate;
      } else if ('toDate' in this.editedTodo.dueDate && typeof this.editedTodo.dueDate.toDate === 'function') {
        // This is a Firestore Timestamp
        return this.editedTodo.dueDate.toDate();
      }
    }
    
    // Fallback, try to convert from string or number
    try {
      return new Date(this.editedTodo.dueDate as any);
    } catch (e) {
      console.error('Error parsing date:', e);
      return null;
    }
  }
  
  getDueTime(): string {
    if (!this.editedTodo.dueDate) return '';
    
    try {
      let date: Date;
      
      // Handle Firestore Timestamp
      if (typeof this.editedTodo.dueDate === 'object' && this.editedTodo.dueDate !== null) {
        if (this.editedTodo.dueDate instanceof Date) {
          date = this.editedTodo.dueDate;
        } else if ('toDate' in this.editedTodo.dueDate && typeof this.editedTodo.dueDate.toDate === 'function') {
          date = this.editedTodo.dueDate.toDate();
        } else {
          date = new Date();
        }
      } else {
        date = new Date(this.editedTodo.dueDate as any);
      }
      
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (e) {
      console.error('Error getting time:', e);
      return '';
    }
  }
}