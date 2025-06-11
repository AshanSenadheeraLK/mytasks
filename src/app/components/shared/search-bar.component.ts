import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

export interface SearchFilter {
  term: string;
  filterType: 'all' | 'title' | 'description' | 'priority' | 'overdue';
  priorityValue?: 'low' | 'medium' | 'high';
  taskStatus: 'all' | 'pending' | 'completed';
  tag?: string;
}

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, ClickOutsideDirective],
  template: `
    <div class="relative w-full" (clickOutside)="closeFilters()">
      <!-- Search Input -->
      <div class="relative w-full">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
          <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          type="search"
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearchChange()"
          [placeholder]="placeholder"
          class="w-full ps-10 pe-20 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:ring-accent focus:border-accent"
        />
        
        <!-- Right side buttons -->
        <div class="absolute inset-y-0 end-0 flex items-center space-x-1 pe-3">
          <!-- Clear button -->
          <button 
            *ngIf="searchTerm && searchTerm.length > 0"
            (click)="clearSearch()"
            class="p-1.5 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-1 focus:ring-accent"
            aria-label="Clear search"
          >
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <!-- Filter button -->
          <button 
            (click)="toggleFilters()"
            class="relative p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-accent transition-colors duration-200"
            [class.text-accent]="showFilters || getActiveFiltersCount() > 0"
            [class.text-gray-400]="!showFilters && getActiveFiltersCount() === 0"
            aria-label="Toggle filters"
          >
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <!-- Active filters count badge -->
            <div *ngIf="getActiveFiltersCount() > 0" 
                 class="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
              {{ getActiveFiltersCount() }}
            </div>
          </button>
        </div>
      </div>
      
      <!-- Filter Options -->
      <div *ngIf="showFilters" 
           class="animate-fade-in bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-lg p-4 space-y-4" style="margin-top: 200px;">
        <!-- Close Filters Header -->
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</h3>
          <button 
            (click)="closeFilters()" 
            class="inline-flex items-center px-2 py-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Close filters"
          >
            <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Close
          </button>
        </div>

        <!-- Task Status Filters -->
        <div class="space-y-2">
          <h3 class="text-xs font-medium text-gray-500 dark:text-gray-400">Task Status</h3>
          <div class="flex flex-wrap gap-1">
            <button
              (click)="setTaskStatusFilter('all')"
              [class]="taskStatus === 'all' ? 'px-2 py-1 text-xs font-medium rounded-md bg-accent text-white' : 'px-2 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
            >
              All Tasks
            </button>
            <button
              (click)="setTaskStatusFilter('pending')"
              [class]="taskStatus === 'pending' ? 'px-2 py-1 text-xs font-medium rounded-md bg-accent text-white' : 'px-2 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
            >
              Pending
            </button>
            <button
              (click)="setTaskStatusFilter('completed')"
              [class]="taskStatus === 'completed' ? 'px-2 py-1 text-xs font-medium rounded-md bg-accent text-white' : 'px-2 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
            >
              Completed
            </button>
          </div>
        </div>

        <!-- Search In Filters -->
        <div class="space-y-2">
          <h3 class="text-xs font-medium text-gray-500 dark:text-gray-400">Search In</h3>
          <div class="flex flex-wrap gap-1">
            <button 
              (click)="setFilterType('all')" 
              [class]="filterType === 'all' ? 'px-2 py-1 text-xs font-medium rounded-md bg-accent text-white' : 'px-2 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
            >
              All
            </button>
            <button 
              (click)="setFilterType('title')" 
              [class]="filterType === 'title' ? 'px-2 py-1 text-xs font-medium rounded-md bg-accent text-white' : 'px-2 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
            >
              Title
            </button>
            <button 
              (click)="setFilterType('description')" 
              [class]="filterType === 'description' ? 'px-2 py-1 text-xs font-medium rounded-md bg-accent text-white' : 'px-2 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
            >
              Description
            </button>
          </div>
        </div>
        
        <!-- Priority Filters -->
        <div class="space-y-2">
          <h3 class="text-xs font-medium text-gray-500 dark:text-gray-400">Priority</h3>
          <div class="flex flex-wrap gap-1">
            <button 
              (click)="setPriorityFilter('low')" 
              [class]="filterType === 'priority' && priorityValue === 'low' ? 'px-2 py-1 text-xs font-medium rounded-md bg-green-500 text-white' : 'px-2 py-1 text-xs font-medium rounded-md bg-green-100 text-green-800 hover:bg-green-200'"
            >
              Low
            </button>
            <button 
              (click)="setPriorityFilter('medium')" 
              [class]="filterType === 'priority' && priorityValue === 'medium' ? 'px-2 py-1 text-xs font-medium rounded-md bg-yellow-500 text-white' : 'px-2 py-1 text-xs font-medium rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200'"
            >
              Medium
            </button>
            <button 
              (click)="setPriorityFilter('high')" 
              [class]="filterType === 'priority' && priorityValue === 'high' ? 'px-2 py-1 text-xs font-medium rounded-md bg-red-500 text-white' : 'px-2 py-1 text-xs font-medium rounded-md bg-red-100 text-red-800 hover:bg-red-200'"
            >
              High
            </button>
          </div>
        </div>
        
        <!-- Overdue Filter -->
        <div class="space-y-2">
          <h3 class="text-xs font-medium text-gray-500 dark:text-gray-400">Due Date</h3>
          <button
            (click)="setFilterType('overdue')"
            [class]="filterType === 'overdue' ? 'px-2 py-1 text-xs font-medium rounded-md bg-purple-500 text-white' : 'px-2 py-1 text-xs font-medium rounded-md bg-purple-100 text-purple-800 hover:bg-purple-200'"
          >
            Overdue
          </button>
        </div>

        <!-- Tag Filter -->
        <div class="space-y-2">
          <h3 class="text-xs font-medium text-gray-500 dark:text-gray-400">Tag</h3>
          <input type="text" [(ngModel)]="tag" (ngModelChange)="emitCurrentFilter()" class="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300" placeholder="work" />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.2s ease-in-out;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Input() placeholder: string = 'Search...';
  @Input() debounceTime: number = 300;
  @Output() search = new EventEmitter<SearchFilter>();
  
  searchTerm: string = '';
  filterType: 'all' | 'title' | 'description' | 'priority' | 'overdue' = 'all';
  priorityValue?: 'low' | 'medium' | 'high';
  taskStatus: 'all' | 'pending' | 'completed' = 'all';
  tag: string = '';
  showFilters: boolean = false;
  
  private searchSubject = new Subject<SearchFilter>();
  private subscription: Subscription | null = null;

  ngOnInit(): void {
    this.subscription = this.searchSubject.pipe(
      debounceTime(this.debounceTime),
      distinctUntilChanged((prev, curr) => 
        prev.term === curr.term && 
        prev.filterType === curr.filterType &&
        prev.priorityValue === curr.priorityValue &&
        prev.taskStatus === curr.taskStatus &&
        prev.tag === curr.tag
      )
    ).subscribe(filter => {
      this.search.emit(filter);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  onSearchChange(): void {
    this.emitCurrentFilter();
  }

  setFilterType(type: 'all' | 'title' | 'description' | 'overdue'): void {
    if (this.filterType === type) {
      // Reset to 'all' if clicking the same filter
      this.filterType = 'all';
    } else {
      this.filterType = type;
    }
    
    // Reset priority value when changing to a non-priority filter type.
    // Since 'priority' is handled by setPriorityFilter, and this function
    // sets other filter types, it's always correct to clear priorityValue here.
    this.priorityValue = undefined;
    
    this.emitCurrentFilter();
  }

  setPriorityFilter(priority: 'low' | 'medium' | 'high'): void {
    if (this.filterType === 'priority' && this.priorityValue === priority) {
      // Reset if clicking the same priority
      this.filterType = 'all';
      this.priorityValue = undefined;
    } else {
      this.filterType = 'priority';
      this.priorityValue = priority;
    }
    
    this.emitCurrentFilter();
  }

  setTaskStatusFilter(statusToSet: 'all' | 'pending' | 'completed'): void {
    if (this.taskStatus === statusToSet && statusToSet !== 'all') {
      // If clicking an active non-'all' status filter, reset to 'all'
      this.taskStatus = 'all';
    } else {
      this.taskStatus = statusToSet;
    }
    this.emitCurrentFilter();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterType = 'all';
    this.priorityValue = undefined;
    this.taskStatus = 'all';
    this.tag = '';
    this.emitCurrentFilter();
  }
  
  private emitCurrentFilter(): void {
    this.searchSubject.next({
      term: this.searchTerm,
      filterType: this.filterType,
      priorityValue: this.priorityValue,
      taskStatus: this.taskStatus,
      tag: this.tag
    });
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.taskStatus !== 'all') count++;
    if (this.filterType !== 'all') count++;
    if (this.priorityValue) count++;
    if (this.tag) count++;
    return count;
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    if (this.showFilters) {
      this.closeFilters();
    }
  }

  closeFilters(): void {
    this.showFilters = false;
  }
} 