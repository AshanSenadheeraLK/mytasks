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
          <i class="bi bi-search text-gray-400 dark:text-gray-500 text-sm"></i>
        </div>
        <input 
          type="search"
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearchChange()"
          [placeholder]="placeholder"
          class="search-input"
        />
        
        <!-- Right side buttons -->
        <div class="absolute inset-y-0 end-0 flex items-center space-x-1 pe-3">
          <!-- Clear button -->
          <button 
            *ngIf="searchTerm && searchTerm.length > 0"
            (click)="clearSearch()"
            class="p-1.5 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary"
            aria-label="Clear search"
          >
            <i class="bi bi-x-lg text-sm"></i>
          </button>
          
          <!-- Filter button -->
          <button 
            (click)="toggleFilters()"
            class="relative p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-primary transition-colors duration-200"
            [class.text-primary]="showFilters || getActiveFiltersCount() > 0"
            [class.dark:text-primary-light]="showFilters || getActiveFiltersCount() > 0"
            [class.text-gray-400]="!showFilters && getActiveFiltersCount() === 0"
            [class.dark:text-gray-500]="!showFilters && getActiveFiltersCount() === 0"
            aria-label="Toggle filters"
          >
            <i class="bi bi-funnel text-sm"></i>
            <!-- Active filters count badge -->
            <div *ngIf="getActiveFiltersCount() > 0" 
                 class="absolute -top-1 -right-1 w-4 h-4 bg-primary dark:bg-primary-light text-white dark:text-gray-900 text-xs font-bold rounded-full flex items-center justify-center">
              {{ getActiveFiltersCount() }}
            </div>
          </button>
        </div>
      </div>
      
      <!-- Filter Options Dropdown -->
      <div *ngIf="showFilters" 
           class="absolute right-0 top-full mt-2 w-full md:w-80 z-20 animate-scale-in bg-card dark:bg-card-dark rounded-lg border border-border dark:border-border-dark shadow-lg p-4 space-y-4">
        <!-- Filters Header -->
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-gray-800 dark:text-gray-200">Filter Tasks</h3>
          <button 
            (click)="closeFilters()" 
            class="p-1.5 rounded-full text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            aria-label="Close filters"
          >
            <i class="bi bi-x"></i>
          </button>
        </div>

        <!-- Task Status Filters -->
        <div class="space-y-2">
          <h3 class="text-xs font-medium text-gray-600 dark:text-gray-400">Task Status</h3>
          <div class="flex flex-wrap gap-1">
            <button
              (click)="setTaskStatusFilter('all')"
              class="filter-badge"
              [class.active-filter]="taskStatus === 'all'"
            >
              All Tasks
            </button>
            <button
              (click)="setTaskStatusFilter('pending')"
              class="filter-badge"
              [class.active-filter]="taskStatus === 'pending'"
            >
              Pending
            </button>
            <button
              (click)="setTaskStatusFilter('completed')"
              class="filter-badge"
              [class.active-filter]="taskStatus === 'completed'"
            >
              Completed
            </button>
          </div>
        </div>

        <!-- Search In Filters -->
        <div class="space-y-2">
          <h3 class="text-xs font-medium text-gray-600 dark:text-gray-400">Search In</h3>
          <div class="flex flex-wrap gap-1">
            <button 
              (click)="setFilterType('all')" 
              class="filter-badge"
              [class.active-filter]="filterType === 'all'"
            >
              All
            </button>
            <button 
              (click)="setFilterType('title')" 
              class="filter-badge"
              [class.active-filter]="filterType === 'title'"
            >
              Title
            </button>
            <button 
              (click)="setFilterType('description')" 
              class="filter-badge"
              [class.active-filter]="filterType === 'description'"
            >
              Description
            </button>
          </div>
        </div>
        
        <!-- Priority Filters -->
        <div class="space-y-2">
          <h3 class="text-xs font-medium text-gray-600 dark:text-gray-400">Priority</h3>
          <div class="flex flex-wrap gap-1">
            <button 
              (click)="setPriorityFilter('low')" 
              class="filter-badge bg-base-green/10 text-base-green dark:bg-base-green/20 dark:text-status-successDark"
              [class.active-filter-green]="filterType === 'priority' && priorityValue === 'low'"
            >
              Low
            </button>
            <button 
              (click)="setPriorityFilter('medium')" 
              class="filter-badge bg-base-yellow/10 text-base-yellow dark:bg-base-yellow/20 dark:text-status-warningDark"
              [class.active-filter-yellow]="filterType === 'priority' && priorityValue === 'medium'"
            >
              Medium
            </button>
            <button 
              (click)="setPriorityFilter('high')" 
              class="filter-badge bg-base-red/10 text-base-red dark:bg-base-red/20 dark:text-status-errorDark"
              [class.active-filter-red]="filterType === 'priority' && priorityValue === 'high'"
            >
              High
            </button>
          </div>
        </div>
        
        <!-- Overdue Filter -->
        <div class="space-y-2">
          <h3 class="text-xs font-medium text-gray-600 dark:text-gray-400">Due Date</h3>
          <button
            (click)="setFilterType('overdue')"
            class="filter-badge bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
            [class.active-filter-purple]="filterType === 'overdue'"
          >
            Overdue
          </button>
        </div>

        <!-- Tag Filter -->
        <div class="space-y-2">
          <h3 class="text-xs font-medium text-gray-600 dark:text-gray-400">Tag</h3>
          <input 
            type="text" 
            [(ngModel)]="tag" 
            (ngModelChange)="emitCurrentFilter()" 
            class="w-full px-3 py-2 text-sm border border-border dark:border-border-dark rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-primary dark:focus:ring-primary-light focus:border-primary dark:focus:border-primary-light transition-colors" 
            placeholder="Enter tag..." />
        </div>
        
        <!-- Reset Filters Button -->
        <div class="pt-2 border-t border-border dark:border-border-dark">
          <button 
            (click)="resetFilters()"
            class="w-full py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light flex items-center justify-center"
          >
            <i class="bi bi-arrow-clockwise mr-1.5"></i>
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-input {
      @apply w-full ps-10 pe-16 py-2.5 
             bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm 
             border border-gray-200 dark:border-gray-700 rounded-lg 
             text-gray-900 dark:text-white text-sm 
             focus:ring-2 focus:ring-primary/30 dark:focus:ring-primary-light/30
             focus:border-primary dark:focus:border-primary-light
             transition-colors duration-200;
    }
    
    .filter-badge {
      @apply px-2 py-1 text-xs font-medium rounded-md
             bg-gray-100 dark:bg-gray-800 
             text-gray-700 dark:text-gray-300
             hover:bg-gray-200 dark:hover:bg-gray-700
             transition-colors duration-200;
    }
    
    .active-filter {
      @apply bg-primary text-white dark:bg-primary-light dark:text-gray-900;
    }
    
    .active-filter-green {
      @apply bg-base-green text-white dark:bg-status-successDark dark:text-gray-900;
    }
    
    .active-filter-yellow {
      @apply bg-base-yellow text-gray-900 dark:bg-status-warningDark dark:text-gray-900;
    }
    
    .active-filter-red {
      @apply bg-base-red text-white dark:bg-status-errorDark dark:text-gray-900;
    }
    
    .active-filter-purple {
      @apply bg-purple-600 text-white dark:bg-purple-500 dark:text-white;
    }
    
    .animate-scale-in {
      animation: scaleIn 0.2s ease-out forwards;
      transform-origin: top right;
    }
    
    @keyframes scaleIn {
      0% {
        opacity: 0;
        transform: scale(0.95);
      }
      100% {
        opacity: 1;
        transform: scale(1);
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
    
    // Reset priority value when changing to a non-priority filter type
    // since we're setting it to another type
    this.priorityValue = undefined;
    
    this.emitCurrentFilter();
  }

  setPriorityFilter(priority: 'low' | 'medium' | 'high'): void {
    if (this.filterType === 'priority' && this.priorityValue === priority) {
      // Reset to 'all' if clicking the same priority
      this.filterType = 'all';
      this.priorityValue = undefined;
    } else {
      this.filterType = 'priority';
      this.priorityValue = priority;
    }
    
    this.emitCurrentFilter();
  }

  setTaskStatusFilter(statusToSet: 'all' | 'pending' | 'completed'): void {
    if (this.taskStatus === statusToSet) {
      // Reset to 'all' if clicking the same status
      this.taskStatus = 'all';
    } else {
      this.taskStatus = statusToSet;
    }
    
    this.emitCurrentFilter();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.emitCurrentFilter();
  }
  
  resetFilters(): void {
    this.filterType = 'all';
    this.priorityValue = undefined;
    this.taskStatus = 'all';
    this.tag = '';
    this.emitCurrentFilter();
  }

  public emitCurrentFilter(): void {
    this.searchSubject.next({
      term: this.searchTerm,
      filterType: this.filterType,
      priorityValue: this.priorityValue,
      taskStatus: this.taskStatus,
      tag: this.tag || undefined
    });
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.filterType !== 'all') count++;
    if (this.taskStatus !== 'all') count++;
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