import { Component, OnInit, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { TodoService, Todo } from '../../services/todo.service';
import { AuthService } from '../../services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { TodoEditModalComponent } from './todo-edit-modal.component';
import { AlertService } from '../../services/alert.service';
import { ThemeService } from '../../services/theme.service';
import { ToastNotificationsComponent } from '../shared/toast-notifications.component';
import { SearchBarComponent, SearchFilter } from '../shared/search-bar.component';
import { ThemeToggleComponent } from '../shared/theme-toggle.component';
import { ResponsiveLayoutComponent } from '../shared/responsive-layout.component';
import { DeviceService } from '../../services/device.service';
import { AnalyticsService } from '../../services/analytics.service';
// Import compiler to ensure JIT compilation works
import '@angular/compiler';

const version = '2.0.0';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterModule,
    TodoEditModalComponent,
    ToastNotificationsComponent,
    SearchBarComponent,
    ThemeToggleComponent,
    ResponsiveLayoutComponent
  ],
  template: `
    <app-responsive-layout
      [mobileTemplate]="mobileTemplate"
      [tabletTemplate]="tabletTemplate"
      [desktopTemplate]="desktopTemplate">
    </app-responsive-layout>

    <!-- Mobile Template -->
    <ng-template #mobileTemplate>
      <div class="p-4">
        <h1 class="text-xl font-bold">My Tasks</h1>
        <div class="mt-2">
          <app-search-bar (search)="onSearch($event)" placeholder="Search tasks..." class="w-full"></app-search-bar>
        </div>
        <div class="mt-4 space-y-4">
          <div *ngFor="let todo of filteredTodos" class="task-item mb-4">
            <div class="flex justify-between items-start">
              <label class="flex items-center space-x-2">
                <input type="checkbox" [checked]="todo.completed" (change)="toggleTodo(todo.id!)" class="checkbox-custom">
                <span [class.task-completed]="todo.completed" class="font-medium">{{ todo.title }}</span>
              </label>
              <div class="flex space-x-2">
                <button (click)="openEditModal(todo)" class="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700" aria-label="Edit task">
                  <i class="bi bi-pencil text-xs text-gray-500 dark:text-gray-400"></i>
                </button>
                <button (click)="deleteTodo(todo.id!)" class="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700" aria-label="Delete task">
                  <i class="bi bi-trash text-xs text-gray-500 dark:text-gray-400"></i>
                </button>
              </div>
            </div>
            <p *ngIf="todo.description" class="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
              {{ todo.description }}
            </p>
            <div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
              <span *ngIf="todo.dueDate">Due: {{ formatDate(todo.dueDate) }}</span>
              <span *ngIf="todo.priority" [ngClass]="{
                'text-red-500 dark:text-red-400': todo.priority === 'high',
                'text-yellow-500 dark:text-yellow-400': todo.priority === 'medium',
                'text-green-500 dark:text-green-400': todo.priority === 'low'
              }">
                {{ todo.priority | titlecase }}
              </span>
            </div>
          </div>
        </div>
        <button (click)="openAddModal()" class="fab">+</button>
        <app-todo-edit-modal *ngIf="showModal" [todo]="selectedTodo" (save)="onModalSave($event)" (close)="closeModal()"></app-todo-edit-modal>
        <app-toast-notifications></app-toast-notifications>
        <app-theme-toggle></app-theme-toggle>
      </div>
    </ng-template>

    <!-- Tablet Template -->
    <ng-template #tabletTemplate>
      <div class="p-6 grid grid-cols-2 gap-4">
        <div>
          <h2 class="text-lg font-semibold">Stats</h2>
          <div>Total: {{ todos.length }}</div>
          <div>Pending: {{ getActiveCount(todos) }}</div>
          <div>Completed: {{ getCompletedCount(todos) }}</div>
        </div>
        <div>
          <app-search-bar (search)="onSearch($event)" placeholder="Search tasks..." class="w-full"></app-search-bar>
          <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div *ngFor="let todo of filteredTodos" class="task-item">
              <div class="flex justify-between items-start mb-2">
                <label class="flex items-center space-x-2">
                  <input type="checkbox" [checked]="todo.completed" (change)="toggleTodo(todo.id!)" class="checkbox-custom">
                  <span [class.task-completed]="todo.completed" class="font-medium">{{ todo.title }}</span>
                </label>
                <div class="flex space-x-2">
                  <button (click)="openEditModal(todo)" class="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700" aria-label="Edit task">
                    <i class="bi bi-pencil text-xs text-gray-500 dark:text-gray-400"></i>
                  </button>
                  <button (click)="deleteTodo(todo.id!)" class="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700" aria-label="Delete task">
                    <i class="bi bi-trash text-xs text-gray-500 dark:text-gray-400"></i>
                  </button>
                </div>
              </div>
              <p *ngIf="todo.description" class="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                {{ todo.description }}
              </p>
              <div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span *ngIf="todo.dueDate">Due: {{ formatDate(todo.dueDate) }}</span>
                <span *ngIf="todo.priority" [ngClass]="{
                  'text-red-500 dark:text-red-400': todo.priority === 'high',
                  'text-yellow-500 dark:text-yellow-400': todo.priority === 'medium',
                  'text-green-500 dark:text-green-400': todo.priority === 'low'
                }">
                  {{ todo.priority | titlecase }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <button (click)="openAddModal()" class="fab">+</button>
        <app-todo-edit-modal *ngIf="showModal" [todo]="selectedTodo" (save)="onModalSave($event)" (close)="closeModal()"></app-todo-edit-modal>
        <app-toast-notifications></app-toast-notifications>
        <app-theme-toggle class="fixed top-4 right-4"></app-theme-toggle>
      </div>
    </ng-template>

    <!-- Desktop Template (Original) -->
    <ng-template #desktopTemplate>
      <!-- Original desktop template content -->
      <!-- Fixed Top Navigation -->
      <nav class="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-nav z-[var(--z-sticky)] transition-colors duration-200">
        <div class="max-w-7xl mx-auto">
          <!-- Desktop Navigation -->
          <div class="px-4 sm:px-6 lg:px-8">
            <div class="relative flex items-center justify-between h-16">
              <!-- Left side - Brand -->
              <div class="flex-shrink-0 flex items-center">
                <div class="flex items-center space-x-3">
                  <h1 class="text-2xl font-bold text-primary dark:text-blue-400 tracking-tight">MY TASKS</h1>
                  <div class="hidden sm:flex items-center space-x-2">
                    <span class="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-blue-300 rounded-full font-medium">
                      <a routerLink="/versions/{{ getVersion() }}" class="text-primary dark:text-blue-300">
                      v{{ getVersion() }} <i class="bi bi-box-arrow-up-right text-sm"></i>
                      </a>
                    </span>
                    <div class="h-5 w-px bg-gray-200 dark:bg-gray-700"></div>
                    <span class="text-sm text-gray-600 dark:text-gray-300">
                      {{ getActiveCount(todos) }} pending
                    </span>
                  </div>
                </div>
              </div>

              <!-- Middle - Search Bar (for medium screens and up) -->
              <div class="hidden md:flex flex-1 items-center justify-center px-8 max-w-2xl mx-auto">
                <app-search-bar
                  (search)="onSearch($event)"
                  placeholder="Search tasks..."
                  class="w-full">
                </app-search-bar>
              </div>

              <!-- Right side - Theme Toggle & User Info -->
              <div class="flex items-center space-x-4">
                <app-theme-toggle></app-theme-toggle>
                <a routerLink="/app/chat" class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200">
                  <svg class="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  AI Assistant
                </a>
                
                <!-- User Profile -->
                <div class="flex items-center">
                  <div class="flex items-center space-x-3">
                    <div class="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg transition-all hover:bg-gray-200 dark:hover:bg-gray-600">
                      <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ userName || 'User' }}</span>
                    </div>
                    
                    <a routerLink="/profile"
                      class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200">
                      <svg class="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.994.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile Search (for small screens only) -->
          <div class="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div class="px-4 py-3">
              <app-search-bar
                (search)="onSearch($event)"
                placeholder="Search tasks..."
                class="w-full">
              </app-search-bar>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Left Sidebar -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Task Stats Card -->
            <div class="card shadow-lg animate-fade-in dark:bg-gray-800 overflow-hidden">
              <div class="p-5">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Task Summary
                </h2>
                
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                  <!-- Completion Progress -->
                  <div class="col-span-2 sm:col-span-3 lg:col-span-1 bg-gradient-to-r from-blue-600 to-accent rounded-xl p-5 text-white">
                    <div class="flex justify-between items-center mb-2">
                      <div class="text-sm font-medium">Completion Rate</div>
                      <div class="text-lg font-bold">{{ getCompletionRate(todos).toFixed(0) }}%</div>
                    </div>
                    <div class="h-2 bg-blue-300/50 rounded-full overflow-hidden">
                      <div class="h-2 bg-white rounded-full transition-all duration-700 ease-out" [style.width.%]="getCompletionRate(todos)"></div>
                    </div>
                  </div>
                
                  <!-- Completed Tasks -->
                  <div class="bg-white dark:bg-gray-700 shadow-sm rounded-xl p-4 transform transition-all hover:scale-[1.02] border border-gray-100 dark:border-gray-800">
                    <div class="flex flex-col justify-between h-full">
                      <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ getCompletedCount(todos) }}</div>
                      <div class="text-sm text-gray-600 dark:text-gray-300 mt-1">Completed</div>
                    </div>
                  </div>
                  
                  <!-- Pending Tasks -->
                  <div class="bg-white dark:bg-gray-700 shadow-sm rounded-xl p-4 transform transition-all hover:scale-[1.02] border border-gray-100 dark:border-gray-800">
                    <div class="flex flex-col justify-between h-full">
                      <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ getActiveCount(todos) }}</div>
                      <div class="text-sm text-gray-600 dark:text-gray-300 mt-1">Pending</div>
                    </div>
                  </div>
                  
                  <!-- Total Tasks -->
                  <div class="hidden sm:block lg:block bg-white dark:bg-gray-700 shadow-sm rounded-xl p-4 transform transition-all hover:scale-[1.02] border border-gray-100 dark:border-gray-800">
                    <div class="flex flex-col justify-between h-full">
                      <div class="text-2xl font-bold text-gray-800 dark:text-gray-200">{{ todos.length || 0 }}</div>
                      <div class="text-sm text-gray-600 dark:text-gray-300 mt-1">Total</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Last Update Info -->
              <div class="px-5 py-3 bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
                Last updated: {{ formatCurrentDate() }}
              </div>
            </div>

            <!-- Quick Links and App Info -->
            <div class="card shadow-lg animate-fade-in dark:bg-gray-800" style="animation-delay: 0.1s">
              <div class="p-5">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Links
                </h2>
                
                <div class="space-y-2">
                  <a href="#" (click)="showTodaysTasks(); $event.preventDefault()" class="block p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 flex items-center">
                    <svg class="w-5 h-5 mr-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="text-sm text-gray-700 dark:text-gray-300">Today's Tasks</span>
                  </a>
                  <a href="#" (click)="showLatestCompleted(); $event.preventDefault()" class="block p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 flex items-center">
                    <svg class="w-5 h-5 mr-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-sm text-gray-700 dark:text-gray-300">Latest Completed</span>
                  </a>
                  <a href="#" (click)="showMyNotes(); $event.preventDefault()" class="block p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 flex items-center">
                    <svg class="w-5 h-5 mr-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    <span class="text-sm text-gray-700 dark:text-gray-300">My Notes</span>
                  </a>
                  <a routerLink="/app/chat" class="block p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 flex items-center">
                    <svg class="w-5 h-5 mr-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
                    </svg>
                    <span class="text-sm text-gray-700 dark:text-gray-300">AI Assistant</span>
                  </a>
                </div>
              </div>
              
              <!-- App Version Info -->
              <div class="px-5 py-3 bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 flex items-center">
                <span class="bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-blue-300 rounded-full px-2 py-0.5 mr-2 font-medium">v{{ getVersion() }}</span>
                <span>MyTasks App</span>
              </div>
            </div>
          </div>

          <!-- Main Task List Area -->
          <div class="lg:col-span-3">
            <!-- Add Task Header -->
            <div class="card mb-6 animate-fade-in shadow-lg" style="animation-delay: 0.2s">
              <div class="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div class="flex-1">
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <svg class="w-6 h-6 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Welcome back, {{ userName || 'User' }}!
                  </h2>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Add, manage, and track your tasks efficiently.
                  </p>
                </div>

                <!-- Quick Action Buttons -->
                <div class="flex space-x-2">
                  <button 
                    (click)="openAddModal()"
                    class="btn btn-primary px-4 py-2 shadow-lg">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Task
                  </button>
                  <div class="relative">
                    <button 
                      class="btn btn-outline-secondary px-3 py-2"
                      aria-label="More actions">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                    <!-- Dropdown menu could be added here -->
                  </div>
                </div>
              </div>
              <!-- Quick Add Task Form -->
              <div class="p-4 sm:p-6 pt-0 sm:pt-0 border-t border-gray-200 dark:border-gray-700 mt-4 hidden">
                <form class="flex items-center space-x-2">
                  <div class="relative flex-1">
                    <input type="text" placeholder="Enter a task title..." 
                           class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:ring-accent focus:border-accent bg-white dark:bg-gray-800">
                  </div>
                  <button type="submit" class="btn btn-primary">Add</button>
                </form>
              </div>
            </div>

            <!-- Task List -->
            <div class="card shadow-lg animate-fade-in" style="animation-delay: 0.3s">
              <div class="p-4 sm:p-6">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4 sm:mb-0">
                    <svg class="w-5 h-5 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {{ getTaskListTitle() }}
                  </h2>
                  
                  <!-- Sorting/View Options -->
                  <div class="flex items-center space-x-2 text-sm">
                    <span class="text-gray-500 dark:text-gray-400">View:</span>
                    <select 
                      class="form-select py-1 px-2 text-sm rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-accent focus:border-accent"
                      aria-label="Sort tasks">
                      <option>Latest</option>
                      <option>Oldest</option>
                      <option>Priority</option>
                      <option>Due date</option>
                    </select>
                  </div>
                </div>

                <div *ngIf="(todos$ | async) as todos">
                  <div *ngIf="filteredTodos.length > 0; else emptyState">
                    <div class="space-y-4">
                      <div *ngFor="let todo of filteredTodos; let i = index" 
                           class="group relative bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl p-4 sm:p-5 border dark:border-gray-700 hover:shadow-md transition-all duration-300 animate-slide-up"
                           [class.border-l-4]="true"
                           [class.border-red-400]="todo.priority === 'high'"
                           [class.border-yellow-400]="todo.priority === 'medium'"
                           [class.border-green-400]="todo.priority === 'low'"
                           [class.border-gray-300]="!todo.priority"
                           [style.animation-delay]="i * 0.05 + 's'">
                        
                        <!-- Task Header -->
                        <div class="flex items-center justify-between mb-3">
                          <div class="flex items-center">
                            <input 
                              type="checkbox" 
                              [checked]="todo.completed"
                              (change)="toggleTodo(todo.id!)"
                              [id]="'check-' + todo.id"
                              class="checkbox-custom w-5 h-5"
                              [attr.aria-label]="'Mark ' + (todo.title || '') + ' as ' + (todo.completed ? 'incomplete' : 'complete')">
                            <label 
                              [for]="'check-' + todo.id"
                              class="ml-3 block text-base font-medium cursor-pointer transition-all duration-300"
                              [class]="todo.completed ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'">
                              {{ todo.title }}
                            </label>
                          </div>
                          
                          <!-- Priority Badge -->
                          <!-- 
                          <ng-container *ngIf="todo.priority">
                            <span class="hidden sm:flex items-center px-2.5 py-1 text-xs font-medium rounded-full shadow-sm"
                              [class.bg-red-100]="todo.priority === 'high'"
                              [class.text-red-700]="todo.priority === 'high'"
                              [class.dark:bg-red-900/30]="todo.priority === 'high'"
                              [class.dark:text-red-300]="todo.priority === 'high'"
                              [class.bg-yellow-100]="todo.priority === 'medium'"
                              [class.text-yellow-700]="todo.priority === 'medium'"
                              [class.dark:bg-yellow-900/30]="todo.priority === 'medium'"
                              [class.dark:text-yellow-300]="todo.priority === 'medium'"
                              [class.bg-green-100]="todo.priority === 'low'"
                              [class.text-green-700]="todo.priority === 'low'"
                              [class.dark:bg-green-900/30]="todo.priority === 'low'"
                              [class.dark:text-green-300]="todo.priority === 'low'">
                              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path *ngIf="todo.priority === 'high'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                                <path *ngIf="todo.priority === 'medium'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                <path *ngIf="todo.priority === 'low'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                              </svg>
                              {{ todo.priority }}
                            </span>
                          </ng-container>
                          -->
                        </div>
                        
                        <!-- Description -->
                        <div class="pl-8">
                          <p *ngIf="todo.description" 
                             class="mt-1 mb-3 text-sm text-gray-500 dark:text-gray-400">
                            {{ todo.description }}
                          </p>
                          
                          <!-- Task Metadata -->
                          <div class="flex flex-wrap items-center gap-3 mt-3">
                            <!-- Due Date -->
                            <span *ngIf="todo.dueDate" 
                                  class="inline-flex items-center text-xs rounded-md px-2 py-1"
                                  [class.bg-red-50]="isOverdue(todo)"
                                  [class.text-red-700]="isOverdue(todo)"
                                  [class.bg-gray-100]="!isOverdue(todo)"
                                  [class.dark:bg-gray-700]="!isOverdue(todo)"
                                  [class.text-gray-600]="!isOverdue(todo)"
                                  [class.dark:text-gray-300]="!isOverdue(todo)">
                              <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {{ formatDate(todo.dueDate) }}
                            </span>
                            
                            <!-- Priority (mobile only) -->
                            <span 
                              *ngIf="todo.priority" 
                              class="sm:hidden inline-flex items-center px-2 py-1 text-xs font-medium rounded-md"
                              [class.bg-red-100]="todo.priority === 'high'"
                              [class.text-red-700]="todo.priority === 'high'"
                              [class.bg-yellow-100]="todo.priority === 'medium'"
                              [class.text-yellow-700]="todo.priority === 'medium'"
                              [class.bg-green-100]="todo.priority === 'low'"
                              [class.text-green-700]="todo.priority === 'low'">
                              {{ todo.priority }}
                            </span>
                            
                            <!-- Status -->
                            <span 
                              class="inline-flex items-center text-xs font-medium rounded-md px-2 py-1"
                              [class.bg-green-100]="todo.completed"
                              [class.text-green-700]="todo.completed"
                              [class.bg-blue-100]="!todo.completed"
                              [class.text-blue-700]="!todo.completed">
                              <svg *ngIf="todo.completed" class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              <svg *ngIf="!todo.completed" class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              {{ todo.completed ? 'Completed' : 'Pending' }}
                            </span>
                            
                            <!-- Created date -->
                            <span class="ml-auto text-xs text-gray-500 dark:text-gray-400 hidden sm:inline-block">
                              Created: {{ formatDate(todo.createdAt) }}
                            </span>
                          </div>
                        </div>

                        <!-- Action buttons (visible on hover/mobile) -->
                        <div class="absolute top-4 right-4 sm:static sm:mt-4 sm:flex sm:justify-end">
                          <div class="flex space-x-2 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button 
                              (click)="openEditModal(todo)"
                              class="p-2 text-blue-600 hover:bg-blue-100 rounded-full" 
                              [attr.aria-label]="'Edit ' + (todo.title || '')">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button 
                              (click)="deleteTodo(todo.id!)"
                              class="p-2 text-red-600 hover:bg-red-100 rounded-full" 
                              [attr.aria-label]="'Delete ' + (todo.title || '')">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Pagination -->
                    <div class="mt-6 flex justify-between items-center">
                      <div class="text-sm text-gray-700 dark:text-gray-300">
                        Showing <span class="font-medium">{{ filteredTodos.length }}</span> tasks
                      </div>
                      <div class="flex space-x-1">
                        <button class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                          Previous
                        </button>
                        <button class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-accent text-white">
                          1
                        </button>
                        <button class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                          Next
                        </button>
                      </div>
                    </div>
                  </div>

                  <ng-template #emptyState>
                    <div class="text-center py-12">
                      <svg class="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No tasks found</h3>
                      <p class="mt-2 text-sm text-gray-500 dark:text-gray-300">Get started by creating your first task!</p>
                      <button 
                        (click)="openAddModal()"
                        class="mt-6 btn btn-primary">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Task
                      </button>
                    </div>
                  </ng-template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <app-todo-edit-modal *ngIf="showModal" [todo]="selectedTodo" (save)="onModalSave($event)" (close)="closeModal()"></app-todo-edit-modal>
      <app-toast-notifications></app-toast-notifications>
    </ng-template>

    <!-- Loading State -->
    <ng-template #loadingState>
      <div class="flex items-center justify-center h-screen">
        <div class="animate-spin rounded-full h-24 w-24 border-t-2 border-blue-500"></div>
      </div>
    </ng-template>
  `,
  styles: []
})
export class TodoListComponent implements OnInit, OnDestroy {
    todos$!: Observable<Todo[]>;
    private subscriptions: Subscription[] = [];
    userName: string | null = null;
    todos: Todo[] = [];
    searchFilter: SearchFilter = { term: '', filterType: 'all', taskStatus: 'all' };
    filteredTodos: Todo[] = [];
    
    // Modal state
    showModal = false;
    selectedTodo: Todo | null = null;
    private isBrowser: boolean;

    constructor(
      private todoService: TodoService,
      private authService: AuthService,
      private alertService: AlertService,
      private themeService: ThemeService,
      @Inject(PLATFORM_ID) private platformId: Object,
      private deviceService: DeviceService,
      private router: Router,
      private analytics: AnalyticsService
    ) {
      this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngOnInit(): void {
      if (this.isBrowser) {
        this.todos$ = this.todoService.todos$;
        this.loadTodos();
        this.loadUserName();
        // Auto-open add modal when navigating to '/app/new'
        if (this.router.url.endsWith('/new')) {
          this.openAddModal();
        }
      }
    }

    loadTodos(): void {
      const todoSub = this.todoService.todos$.pipe(
        map(todosFromService => {
          this.todos = todosFromService;
          this.applyFilters();
        })
      ).subscribe({
        error: (err) => console.error('Error in todos$ subscription:', err)
      });
      this.subscriptions.push(todoSub);
    }

    loadUserName(): void {
      const currentUser = this.authService.getCurrentUser();
      this.userName = currentUser?.displayName || currentUser?.email || 'User';

      // Subscribe to user changes to update display name
      const userSub = this.authService.user$.subscribe(user => {
        if (user) {
          // Prioritize displayName over email
          this.userName = user.displayName || user.email || 'User';
          console.log('User display name updated:', this.userName);
        } else {
          this.userName = 'User';
        }
      });
      this.subscriptions.push(userSub);
    }

    ngOnDestroy() {
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    onSearch(searchFilterFromBar: SearchFilter): void {
      this.searchFilter = searchFilterFromBar;
      this.applyFilters();
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
              return (todo.priority?.toLowerCase() ?? '') === (this.searchFilter.priorityValue ?? '');
            case 'overdue':
              return this.isOverdue(todo);
            default: // 'all'
              return todo.title.toLowerCase().includes(searchTerm) ||
                     (todo.description?.toLowerCase().includes(searchTerm) ?? false);
          }
        });
      }

      if (this.searchFilter.tag) {
        filtered = filtered.filter(todo => todo.tags?.includes(this.searchFilter.tag!));
      }

      return filtered;
    }

    getTaskListTitle(): string {
      const statusText = this.searchFilter.taskStatus === 'all' 
        ? 'All Tasks' 
        : this.searchFilter.taskStatus === 'completed' 
          ? 'Completed Tasks' 
          : 'Pending Tasks';

      if (this.searchFilter.term) {
        return `${statusText} - Search Results`;
      }
      return statusText;
    }

    openAddModal() {
      this.selectedTodo = { 
        id: '', 
        title: '', 
        completed: false,
        userId: this.authService.getCurrentUser()?.uid || '',
        createdAt: new Date()
      };
      this.showModal = true;
      document.body.classList.add('modal-open');
    }

    openEditModal(todo: Todo) {
      this.selectedTodo = { ...todo };
      this.showModal = true;
      document.body.classList.add('modal-open');
    }

    closeModal() {
      this.showModal = false;
      document.body.classList.remove('modal-open');
    }

    async onModalSave(todoData: Partial<Todo>) {
      if (!this.isBrowser) return;
      
      try {
        if (this.selectedTodo?.id) {
          // Editing existing todo
          await this.todoService.updateTodo(this.selectedTodo.id, todoData);
          this.alertService.addAlert('Task updated successfully!', 'success', true, true);
        } else {
          // Adding new todo
          await this.todoService.addTodo(
            todoData.title!,
            todoData.description,
            todoData.dueDate as Date,
            todoData.priority as 'low' | 'medium' | 'high',
            todoData.tags || [],
            todoData.recurring || null
          );
          this.alertService.addAlert('New task added successfully!', 'success', true, true);
        }
        this.closeModal();
      } catch (error) {
        console.error('Error saving todo:', error);
        this.alertService.addAlert('Could not save task. Please try again.', 'error', true, true);
      }
    }

    async toggleTodo(id: string) {
      if (!this.isBrowser) return;
      
      try {
        await this.todoService.toggleTodoComplete(id);
        const todo = this.todos.find(t => t.id === id);
        const status = todo?.completed ? 'completed' : 'pending';
        this.alertService.addAlert(`Task marked as ${status}!`, 'info', true, true);
      } catch (error) {
        console.error('Error toggling todo:', error);
        this.alertService.addAlert('Could not update task status. Please try again.', 'error', true, true);
      }
    }

    async deleteTodo(id: string) {
      if (!this.isBrowser) return;
      
      try {
        await this.todoService.deleteTodo(id);
        this.alertService.addAlert('Task deleted successfully!', 'warning', true, true);
      } catch (error) {
        console.error('Error deleting todo:', error);
        this.alertService.addAlert('Could not delete task. Please try again.', 'error', true, true);
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
      return this.analytics.getCompletionRate(todos);
    }

    isOverdue(todo: Todo): boolean {
      if (!this.isBrowser || !todo.dueDate) return false;
      
      try {
        // Convert to date regardless of the type
        let dueDate: Date;
        
        if (todo.dueDate instanceof Date) {
          dueDate = todo.dueDate;
        } else if (todo.dueDate && typeof todo.dueDate === 'object' && 'toDate' in todo.dueDate) {
          dueDate = (todo.dueDate as any).toDate();
        } else {
          dueDate = new Date(todo.dueDate as any);
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of day
        
        return dueDate < today && !todo.completed;
      } catch (error) {
        console.error('Error checking overdue status:', error);
        return false;
      }
    }

    formatCurrentDate(): string {
      return this.formatDate(new Date());
    }

    getPriorityClass(todo: Todo): string {
      if (!todo.priority) return 'bg-gray-200 text-gray-500';
      switch (todo.priority) {
        case 'high':
          return 'bg-red-100 text-red-800';
        case 'medium':
          return 'bg-yellow-100 text-yellow-800';
        case 'low':
          return 'bg-green-100 text-green-800';
        default:
          return 'bg-gray-200 text-gray-500';
      }
    }

    // Quick Links filter methods
    showTodaysTasks(): void {
      if (!this.isBrowser) return;
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const tomorrowStart = new Date(todayStart);
      tomorrowStart.setDate(todayStart.getDate() + 1);
      this.filteredTodos = this.todos.filter(todo => {
        if (!todo.dueDate) return false;
        let dueDate: Date;
        if (todo.dueDate instanceof Date) {
          dueDate = todo.dueDate;
        } else if (todo.dueDate && typeof todo.dueDate === 'object' && 'toDate' in todo.dueDate) {
          dueDate = (todo.dueDate as any).toDate();
        } else {
          dueDate = new Date(todo.dueDate as any);
        }
        return dueDate >= todayStart && dueDate < tomorrowStart;
      });
    }

    showLatestCompleted(): void {
      if (!this.isBrowser) return;
      this.filteredTodos = this.todos
        .filter(todo => todo.completed)
        .sort((a, b) => {
          const aDate = a.createdAt instanceof Date ? a.createdAt : (a.createdAt as any).toDate();
          const bDate = b.createdAt instanceof Date ? b.createdAt : (b.createdAt as any).toDate();
          return bDate.getTime() - aDate.getTime();
        });
    }

    showMyNotes(): void {
      if (!this.isBrowser) return;
      this.filteredTodos = this.todos.filter(todo => !!todo.description && todo.description.trim() !== '');
    }
} 