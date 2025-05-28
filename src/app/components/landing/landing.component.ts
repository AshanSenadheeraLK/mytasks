import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ResponsiveLayoutComponent } from '../shared/responsive-layout.component';
import { DeviceService } from '../../services/device.service';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule, CommonModule, ResponsiveLayoutComponent, FooterComponent],
  template: `
    <app-responsive-layout
      [mobileTemplate]="mobileTemplate"
      [tabletTemplate]="tabletTemplate"
      [desktopTemplate]="desktopTemplate">
    </app-responsive-layout>

    <!-- Mobile Template -->
    <ng-template #mobileTemplate>
      <!-- Mobile-specific UI -->
      <div class="bg-gradient-to-r from-primary to-blue-600 min-h-screen">
        <!-- Mobile Navbar -->
        <nav class="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
          <div class="px-4 py-3">
            <div class="flex justify-between items-center">
              <h1 class="text-lg font-display text-primary font-bold">MY TASKS</h1>
              <div class="flex items-center space-x-2">
                <a routerLink="/login" class="btn btn-secondary text-xs px-3 py-1.5">Login</a>
                <a routerLink="/register" class="btn btn-primary text-xs px-3 py-1.5">Register</a>
              </div>
            </div>
          </div>
        </nav>

        <!-- Mobile Hero Content -->
        <div class="px-4 py-12 text-center">
          <h1 class="text-3xl font-extrabold text-white tracking-tight">
            Manage your tasks with ease
          </h1>
          <p class="mt-3 text-sm text-blue-100">
            Organize, track, and accomplish your daily tasks with our intuitive task manager. 
            Never miss a deadline again!
          </p>
          <div class="mt-6 flex flex-col space-y-3">
            <a routerLink="/register" class="w-full btn btn-accent bg-accent hover:bg-blue-600 text-white py-3">
              Get Started
            </a>
            <a routerLink="/login" class="w-full btn text-blue-700 bg-blue-100 hover:bg-blue-200 py-3">
              Login
            </a>
          </div>
        </div>

        <!-- Mobile Features -->
        <div class="bg-white py-12 px-4">
          <div class="text-center">
            <h2 class="text-base text-accent font-semibold tracking-wide uppercase">Features</h2>
            <p class="mt-2 text-2xl font-bold text-gray-900">
              Everything you need to stay organized
            </p>
          </div>

          <div class="mt-8 space-y-6">
            <!-- Feature 1 -->
            <div class="bg-white rounded-lg shadow-md p-5">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <span class="inline-flex items-center justify-center p-3 bg-accent rounded-md shadow-lg">
                    <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                  </span>
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900">Task Management</h3>
                  <p class="mt-1 text-sm text-gray-500">
                    Create, edit, and organize your tasks with ease.
                  </p>
                </div>
              </div>
            </div>

            <!-- Feature 2 -->
            <div class="bg-white rounded-lg shadow-md p-5">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <span class="inline-flex items-center justify-center p-3 bg-accent rounded-md shadow-lg">
                    <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </span>
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900">Time Tracking</h3>
                  <p class="mt-1 text-sm text-gray-500">
                    Never miss a deadline with our intuitive time tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile How to Use -->
        <div class="bg-blue-50 py-12 px-4">
          <div class="text-center">
            <h2 class="text-base text-accent font-semibold tracking-wide uppercase">How to Use</h2>
            <p class="mt-2 text-2xl font-bold text-gray-900">
              Get started in three easy steps
            </p>
          </div>

          <div class="mt-8 space-y-6">
            <!-- Step 1 -->
            <div class="bg-white rounded-lg shadow-md p-5">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <span class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white text-lg font-bold">
                    1
                  </span>
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900">Create an account</h3>
                  <p class="mt-1 text-sm text-gray-500">
                    Sign up with your email to create your personal account.
                  </p>
                </div>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="bg-white rounded-lg shadow-md p-5">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <span class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white text-lg font-bold">
                    2
                  </span>
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900">Add your tasks</h3>
                  <p class="mt-1 text-sm text-gray-500">
                    Create tasks and organize them by priority and deadline.
                  </p>
                </div>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="bg-white rounded-lg shadow-md p-5">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <span class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white text-lg font-bold">
                    3
                  </span>
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900">Track your progress</h3>
                  <p class="mt-1 text-sm text-gray-500">
                    Monitor completion status and celebrate your achievements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Footer -->
        <footer class="bg-gray-100 py-4">
          <!-- Footer -->
          <div class="mt-auto text-center w-1/2 mx-auto">
            <app-footer></app-footer>
          </div>
        </footer>
      </div>
    </ng-template>

    <!-- Tablet Template -->
    <ng-template #tabletTemplate>
      <!-- Tablet-specific UI -->
      <div class="bg-gradient-to-r from-primary to-blue-600 min-h-screen">
        <!-- Tablet Navbar -->
        <nav class="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
          <div class="px-6 py-4">
            <div class="flex justify-between items-center">
              <h1 class="text-xl font-display text-primary font-bold">MY TASKS</h1>
              <div class="flex items-center space-x-3">
                <a routerLink="/login" class="btn btn-secondary px-4 py-2">Login</a>
                <a routerLink="/register" class="btn btn-primary px-4 py-2">Register</a>
              </div>
            </div>
          </div>
        </nav>

        <!-- Tablet Hero Content -->
        <div class="px-6 py-16">
          <div class="grid grid-cols-2 gap-8 items-center">
            <div>
              <h1 class="text-4xl font-extrabold text-white tracking-tight">
                Manage your tasks with ease
              </h1>
              <p class="mt-4 text-lg text-blue-100">
                Organize, track, and accomplish your daily tasks with our intuitive task manager. 
                Never miss a deadline again!
              </p>
              <div class="mt-8 flex space-x-4">
                <a routerLink="/register" class="btn btn-accent bg-accent hover:bg-blue-600 text-white px-6 py-3">
                  Get Started
                </a>
                <a routerLink="/login" class="btn text-blue-700 bg-blue-100 hover:bg-blue-200 px-6 py-3">
                  Login
                </a>
              </div>
            </div>
            <div class="relative">
              <img class="w-full rounded-lg shadow-xl" src="hero.png" alt="Task management illustration">
            </div>
          </div>
        </div>

        <!-- Tablet Features -->
        <div class="bg-white py-16 px-6">
          <div class="text-center mb-10">
            <h2 class="text-base text-accent font-semibold tracking-wide uppercase">Features</h2>
            <p class="mt-2 text-3xl font-bold text-gray-900">
              Everything you need to stay organized
            </p>
          </div>

          <div class="grid grid-cols-2 gap-8">
            <!-- Feature 1 -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <div>
                <span class="inline-flex items-center justify-center p-3 bg-accent rounded-md shadow-lg">
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                </span>
                <h3 class="mt-4 text-lg font-medium text-gray-900">Task Management</h3>
                <p class="mt-2 text-base text-gray-500">
                  Create, edit, and organize your tasks with ease. Set due dates and priorities to stay on track.
                </p>
              </div>
            </div>

            <!-- Feature 2 -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <div>
                <span class="inline-flex items-center justify-center p-3 bg-accent rounded-md shadow-lg">
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </span>
                <h3 class="mt-4 text-lg font-medium text-gray-900">Time Tracking</h3>
                <p class="mt-2 text-base text-gray-500">
                  Never miss a deadline with our intuitive time tracking. Monitor your progress and stay on schedule.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tablet How to Use -->
        <div class="bg-blue-50 py-16 px-6">
          <div class="text-center mb-10">
            <h2 class="text-base text-accent font-semibold tracking-wide uppercase">How to Use</h2>
            <p class="mt-2 text-3xl font-bold text-gray-900">
              Get started in three easy steps
            </p>
          </div>

          <div class="grid grid-cols-3 gap-8">
            <!-- Step 1 -->
            <div class="bg-white rounded-lg shadow-md p-6 text-center">
              <div class="flex flex-col items-center">
                <span class="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white text-2xl font-bold">
                  1
                </span>
                <h3 class="mt-4 text-lg font-medium text-gray-900">Create an account</h3>
                <p class="mt-2 text-base text-gray-500">
                  Sign up with your email to create your personal account.
                </p>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="bg-white rounded-lg shadow-md p-6 text-center">
              <div class="flex flex-col items-center">
                <span class="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white text-2xl font-bold">
                  2
                </span>
                <h3 class="mt-4 text-lg font-medium text-gray-900">Add your tasks</h3>
                <p class="mt-2 text-base text-gray-500">
                  Create tasks and organize them by priority and deadline.
                </p>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="bg-white rounded-lg shadow-md p-6 text-center">
              <div class="flex flex-col items-center">
                <span class="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white text-2xl font-bold">
                  3
                </span>
                <h3 class="mt-4 text-lg font-medium text-gray-900">Track your progress</h3>
                <p class="mt-2 text-base text-gray-500">
                  Monitor completion status and celebrate your achievements.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tablet Footer -->
        <footer class="bg-gray-100 py-6">
          <!-- Footer -->
          <div class="mt-auto text-center w-1/2 mx-auto">
            <app-footer></app-footer>
          </div>
        </footer>
      </div>
    </ng-template>

    <!-- Desktop Template (Original Layout) -->
    <ng-template #desktopTemplate>
      <!-- Desktop UI (Original) -->
    <div class="bg-gradient-to-r from-primary to-blue-600 min-h-screen">
      <!-- Navbar -->
      <nav class="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-display text-primary font-bold">MY TASKS</h1>
            </div>
            <div class="flex items-center space-x-4">
              <a routerLink="/login" class="btn btn-secondary">Login</a>
              <a routerLink="/register" class="btn btn-primary">Register</a>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="lg:grid lg:grid-cols-12 lg:gap-8">
          <div class="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1 class="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              Manage your tasks with ease
            </h1>
            <p class="mt-3 text-base text-blue-100 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              Organize, track, and accomplish your daily tasks with our intuitive task manager. 
              Never miss a deadline again!
            </p>
            <div class="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
              <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div class="rounded-md shadow">
                  <a routerLink="/register" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-accent hover:bg-blue-600 md:py-4 md:text-lg md:px-10">
                    Get Started
                  </a>
                </div>
                <div class="mt-3 sm:mt-0 sm:ml-3">
                  <a routerLink="/login" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10">
                    Login
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div class="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <img class="w-full rounded-lg" src="hero.png" alt="Task management illustration">
            </div>
          </div>
        </div>
      </div>

      <!-- Feature Section -->
      <div class="bg-white py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="lg:text-center">
            <h2 class="text-base text-accent font-semibold tracking-wide uppercase">Features</h2>
            <p class="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to stay organized
            </p>
            <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Simplify your workflow and boost your productivity with these powerful features.
            </p>
          </div>

          <div class="mt-10">
            <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <!-- Feature 1 -->
              <div class="pt-6">
                <div class="flow-root bg-white rounded-lg shadow-md px-6 pb-8">
                  <div class="-mt-6">
                    <div>
                      <span class="inline-flex items-center justify-center p-3 bg-accent rounded-md shadow-lg">
                        <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                        </svg>
                      </span>
                    </div>
                    <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">Task Management</h3>
                    <p class="mt-5 text-base text-gray-500">
                      Create, edit, and organize your tasks with ease. Set due dates and priorities to stay on track.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Feature 2 -->
              <div class="pt-6">
                <div class="flow-root bg-white rounded-lg shadow-md px-6 pb-8">
                  <div class="-mt-6">
                    <div>
                      <span class="inline-flex items-center justify-center p-3 bg-accent rounded-md shadow-lg">
                        <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </span>
                    </div>
                    <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">Time Tracking</h3>
                    <p class="mt-5 text-base text-gray-500">
                      Never miss a deadline with our intuitive time tracking. Monitor your progress and stay on schedule.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Feature 3 -->
                <div class="pt-6">
                  <div class="flow-root bg-white rounded-lg shadow-md px-6 pb-8">
                    <div class="-mt-6">
                      <div>
                        <span class="inline-flex items-center justify-center p-3 bg-accent rounded-md shadow-lg">
                          <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </span>
                      </div>
                      <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">Smart Prioritization</h3>
                      <p class="mt-5 text-base text-gray-500">
                        Let our AI help you prioritize tasks based on deadlines, importance, and your work patterns.
                      </p>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      <!-- How to Use Section -->
      <div class="bg-blue-50 py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="lg:text-center">
            <h2 class="text-base text-accent font-semibold tracking-wide uppercase">How to Use</h2>
            <p class="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
              Get started in three easy steps
            </p>
            <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Follow these simple steps to get your tasks organized and boost your productivity.
            </p>
          </div>

          <div class="mt-10">
            <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <!-- Step 1 -->
              <div class="pt-6">
                <div class="flow-root bg-white rounded-lg shadow-md px-6 pb-8 text-center">
                  <div class="-mt-6">
                    <div class="flex justify-center">
                      <span class="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white text-2xl font-bold">
                        1
                      </span>
                    </div>
                    <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">Create an account</h3>
                    <p class="mt-5 text-base text-gray-500">
                      Sign up with your email to create your personal account and start managing your tasks.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Step 2 -->
              <div class="pt-6">
                <div class="flow-root bg-white rounded-lg shadow-md px-6 pb-8 text-center">
                  <div class="-mt-6">
                    <div class="flex justify-center">
                      <span class="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white text-2xl font-bold">
                        2
                      </span>
                    </div>
                    <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">Add your tasks</h3>
                    <p class="mt-5 text-base text-gray-500">
                      Create tasks and organize them by priority, deadline, and categories to stay organized.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Step 3 -->
              <div class="pt-6">
                <div class="flow-root bg-white rounded-lg shadow-md px-6 pb-8 text-center">
                  <div class="-mt-6">
                    <div class="flex justify-center">
                      <span class="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white text-2xl font-bold">
                        3
                      </span>
                    </div>
                    <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">Track your progress</h3>
                    <p class="mt-5 text-base text-gray-500">
                      Monitor your task completion status, track your productivity, and celebrate your achievements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-auto text-center">
        <app-footer></app-footer>
      </div>
    </div>
    </ng-template>
  `,
  styles: []
})
export class LandingComponent {
  constructor(private deviceService: DeviceService) {}
} 