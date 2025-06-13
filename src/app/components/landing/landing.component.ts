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
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-sky-500/10 rounded-full blur-2xl animate-ping delay-2000"></div>
    </div>
    
    <!-- Mobile Navbar -->
    <nav class="backdrop-blur-md bg-white/10 border-b border-white/20 fixed top-0 left-0 right-0 z-50">
      <div class="px-4 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-bold bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent">MY TASKS</h1>
          <div class="flex items-center space-x-3">
            <a routerLink="/login" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors duration-200">Login</a>
            <a routerLink="/register" class="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-full hover:from-blue-600 hover:to-sky-600 transition-all duration-200 shadow-lg hover:shadow-blue-500/25">Register</a>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Hero -->
    <div class="flex-1 flex flex-col justify-center items-center px-6 pt-24 pb-12 text-center relative z-10">
      <div class="mb-8 relative">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
        <div class="relative bg-gradient-to-r from-blue-500 to-sky-500 p-4 rounded-full">
          <i class="bi bi-journal-check text-4xl text-white"></i>
        </div>
      </div>
      
      <h1 class="text-4xl font-bold text-white mb-4 leading-tight">
        <span class="bg-gradient-to-r from-blue-400 via-indigo-400 to-sky-400 bg-clip-text text-transparent">
          Stay on Track,
        </span>
        <br>
        <span class="text-white">Effortlessly</span>
      </h1>
      
      <p class="text-lg text-gray-300 mb-8 max-w-sm leading-relaxed">
        All your tasks, reminders, and goals in one 
        <span class="text-sky-400 font-semibold">beautiful</span> and 
        <span class="text-blue-400 font-semibold">intelligent</span> app.
      </p>
      
      <a routerLink="/register" class="group relative w-full max-w-xs mx-auto">
        <div class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
        <div class="relative px-8 py-4 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full text-white font-semibold text-center hover:from-blue-600 hover:to-sky-600 transition-all duration-200">
          Get Started Free
        </div>
      </a>
    </div>
    
    <!-- Trust signals -->
    <div class="flex justify-center gap-8 text-sm text-gray-400 pb-8 z-10 relative">
      <div class="flex items-center">
        <i class="bi bi-people-fill mr-2 text-blue-400"></i>
        <span>12,000+ users</span>
      </div>
      <div class="flex items-center">
        <i class="bi bi-star-fill mr-2 text-yellow-400"></i>
        <span>4.9/5 rating</span>
      </div>
    </div>
    
    <!-- Mobile Footer -->
    <footer class="py-6 relative z-10">
      <div class="text-center">
        <app-footer></app-footer>
      </div>
    </footer>
  </div>
</ng-template>

<!-- Tablet Template -->
<ng-template #tabletTemplate>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
    <!-- Animated background -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-60 -right-60 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-60 -left-60 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute top-1/3 right-1/4 w-32 h-32 bg-sky-500/10 rounded-full blur-xl animate-ping delay-2000"></div>
    </div>
    
    <!-- Tablet Navbar -->
    <nav class="backdrop-blur-md bg-white/10 border-b border-white/20 fixed top-0 left-0 right-0 z-50">
      <div class="px-8 py-5">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent">MY TASKS</h1>
          <div class="flex items-center space-x-4">
            <a routerLink="/login" class="px-6 py-3 text-white/80 hover:text-white font-medium transition-colors duration-200">Login</a>
            <a routerLink="/register" class="px-6 py-3 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-full hover:from-blue-600 hover:to-sky-600 transition-all duration-200 font-medium shadow-lg hover:shadow-blue-500/25">Register</a>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Hero -->
    <div class="flex-1 flex flex-col justify-center items-center px-12 pt-32 pb-20 relative z-10">
      <div class="w-full max-w-6xl grid grid-cols-2 gap-12 items-center">
        <div class="flex flex-col items-start">
          <h1 class="text-5xl font-bold text-white mb-6 leading-tight">
            <span class="bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent">Organize.</span>
            <br>
            <span class="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">Focus.</span>
            <br>
            <span class="text-white">Achieve.</span>
          </h1>
          
          <p class="text-xl text-gray-300 mb-8 leading-relaxed">
            Your daily companion for managing tasks, deadlines, and goals—
            <span class="text-sky-400 font-semibold">beautifully</span> and 
            <span class="text-blue-400 font-semibold">efficiently</span>.
          </p>
          
          <a routerLink="/register" class="group relative mb-6">
            <div class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
            <div class="relative px-10 py-4 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full text-white font-semibold hover:from-blue-600 hover:to-sky-600 transition-all duration-200">
              Start Free
            </div>
          </a>
          
          <div class="flex gap-8 text-sm text-gray-400">
            <div class="flex items-center">
              <i class="bi bi-people-fill mr-2 text-blue-400"></i>
              <span>12,000+ users</span>
            </div>
            <div class="flex items-center">
              <i class="bi bi-star-fill mr-2 text-yellow-400"></i>
              <span>4.9/5 rating</span>
            </div>
            <div class="flex items-center">
              <i class="bi bi-shield-lock mr-2 text-green-400"></i>
              <span>Secure</span>
            </div>
          </div>
        </div>
        
        <div class="flex justify-center items-center">
          <div class="relative">
            <div class="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-sky-500/20 rounded-3xl blur-xl"></div>
            <div class="relative backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div class="text-center mb-6">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-sky-500 rounded-2xl mb-4">
                  <i class="bi bi-calendar2-check text-2xl text-white"></i>
                </div>
                <div class="font-bold text-white text-lg">Today's Focus</div>
              </div>
              
              <ul class="space-y-3 mb-6">
                <li class="flex items-center text-gray-300">
                  <i class="bi bi-check-circle-fill text-green-400 mr-3"></i>
                  <span>Finish project report</span>
                </li>
                <li class="flex items-center text-gray-300">
                  <i class="bi bi-check-circle-fill text-green-400 mr-3"></i>
                  <span>Call with team</span>
                </li>
                <li class="flex items-center text-gray-300">
                  <i class="bi bi-circle text-gray-500 mr-3"></i>
                  <span>Plan next week</span>
                </li>
              </ul>
              
              <button class="w-full py-3 bg-gradient-to-r from-blue-500/20 to-sky-500/20 border border-blue-500/30 rounded-xl text-white font-medium hover:from-blue-500/30 hover:to-sky-500/30 transition-all duration-200">
                + Add Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Tablet Footer -->
    <footer class="py-8 relative z-10">
      <div class="text-center">
        <app-footer></app-footer>
      </div>
    </footer>
  </div>
</ng-template>

<!-- Desktop Template -->
<ng-template #desktopTemplate>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-80 -right-80 w-[40rem] h-[40rem] bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-80 -left-80 w-[40rem] h-[40rem] bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute top-1/4 right-1/3 w-64 h-64 bg-sky-500/10 rounded-full blur-2xl animate-ping delay-2000"></div>
      <div class="absolute bottom-1/4 left-1/3 w-48 h-48 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-3000"></div>
    </div>
    
    <!-- Navbar -->
    <nav class="backdrop-blur-sm bg-white/10 border-b border-white/20 fixed top-0 left-0 right-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-20">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent">MY TASKS</h1>
          </div>
          <div class="flex items-center space-x-6">
            <a routerLink="/login" class="px-6 py-3 text-white/80 hover:text-white font-medium transition-colors duration-200">Login</a>
            <a routerLink="/register" class="group relative">
              <div class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
              <div class="relative px-8 py-3 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full text-white font-medium hover:from-blue-600 hover:to-sky-600 transition-all duration-200">
                Register
              </div>
            </a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
      <div class="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
        <div class="lg:col-span-6 lg:text-left">
          <h1 class="text-6xl font-bold text-white sm:text-7xl lg:text-8xl leading-tight">
            <span class="bg-gradient-to-r from-blue-400 via-indigo-400 to-sky-400 bg-clip-text text-transparent">
              Manage
            </span>
            <br>
            <span class="text-white">your tasks</span>
            <br>
            <span class="bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
              with ease
            </span>
          </h1>
          
          <p class="mt-8 text-xl text-gray-300 max-w-2xl leading-relaxed">
            Organize, track, and accomplish your daily tasks with our 
            <span class="text-sky-400 font-semibold">intuitive</span> task manager. 
            Never miss a deadline again with our 
            <span class="text-blue-400 font-semibold">AI-powered</span> assistance!
          </p>
          
          <div class="mt-12 flex flex-col sm:flex-row gap-4">
            <a routerLink="/register" class="group relative">
              <div class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-sky-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
              <div class="relative px-12 py-4 bg-gradient-to-r from-blue-500 to-sky-500 rounded-2xl text-white font-semibold text-lg hover:from-blue-600 hover:to-sky-600 transition-all duration-200 text-center">
                Get Started
              </div>
            </a>
            
            <a routerLink="/login" class="px-12 py-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl text-white font-semibold text-lg hover:bg-white/20 transition-all duration-200 text-center">
              Login
            </a>
          </div>
        </div>
        
        <div class="mt-16 lg:mt-0 lg:col-span-6 lg:flex lg:items-center lg:justify-center">
          <div class="relative">
            <div class="absolute -inset-8 bg-gradient-to-r from-blue-500/20 to-sky-500/20 rounded-3xl blur-2xl"></div>
            <div class="relative w-full max-w-md">
              <img class="w-full rounded-2xl shadow-2xl" src="hero.png" alt="Task management illustration">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Feature Section -->
    <div class="relative py-32 backdrop-blur-sm bg-white/5 border-y border-white/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center mb-20">
          <h2 class="text-lg font-semibold text-blue-400 uppercase tracking-wide">Features</h2>
          <p class="mt-4 text-4xl font-bold text-white sm:text-5xl">
            Everything you need to 
            <span class="bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent">stay organized</span>
          </p>
          <p class="mt-6 max-w-3xl text-xl text-gray-300 lg:mx-auto">
            Simplify your workflow and boost your productivity with these powerful, cutting-edge features.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Feature 1 -->
          <div class="group relative">
            <div class="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-sky-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div class="relative backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
              <div class="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-sky-500 rounded-2xl mb-6">
                <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-4">Task Management</h3>
              <p class="text-gray-300 leading-relaxed">
                Create, edit, and organize your tasks with ease. Set due dates and priorities to stay on track with intelligent suggestions.
              </p>
            </div>
          </div>

          <!-- Feature 2 -->
          <div class="group relative">
            <div class="absolute -inset-2 bg-gradient-to-r from-sky-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div class="relative backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
              <div class="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl mb-6">
                <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-4">Time Tracking</h3>
              <p class="text-gray-300 leading-relaxed">
                Never miss a deadline with our intuitive time tracking. Monitor your progress and stay on schedule with smart notifications.
              </p>
            </div>
          </div>

          <!-- Feature 3 -->
          <div class="group relative">
            <div class="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div class="relative backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
              <div class="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl mb-6">
                <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-4">Smart Prioritization</h3>
              <p class="text-gray-300 leading-relaxed">
                Let our AI help you prioritize tasks based on deadlines, importance, and your unique work patterns for maximum efficiency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- How to Use Section -->
    <div class="relative py-32">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center mb-20">
          <h2 class="text-lg font-semibold text-sky-400 uppercase tracking-wide">How to Use</h2>
          <p class="mt-4 text-4xl font-bold text-white sm:text-5xl">
            Get started in 
            <span class="bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">three easy steps</span>
          </p>
          <p class="mt-6 max-w-3xl text-xl text-gray-300 lg:mx-auto">
            Follow these simple steps to get your tasks organized and boost your productivity instantly.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Step 1 -->
          <div class="group relative text-center">
            <div class="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-sky-500/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div class="relative">
              <div class="flex justify-center mb-8">
                <div class="relative">
                  <div class="absolute -inset-2 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full blur opacity-75"></div>
                  <div class="relative flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-sky-500 text-white text-3xl font-bold shadow-2xl">
                    1
                  </div>
                </div>
              </div>
              <h3 class="text-2xl font-semibold text-white mb-4">Create an account</h3>
              <p class="text-gray-300 leading-relaxed max-w-sm mx-auto">
                Sign up with your email to create your personal account and start managing your tasks with our intelligent platform.
              </p>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="group relative text-center">
            <div class="absolute -inset-4 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div class="relative">
              <div class="flex justify-center mb-8">
                <div class="relative">
                  <div class="absolute -inset-2 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full blur opacity-75"></div>
                  <div class="relative flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-3xl font-bold shadow-2xl">
                    2
                  </div>
                </div>
              </div>
              <h3 class="text-2xl font-semibold text-white mb-4">Add your tasks</h3>
              <p class="text-gray-300 leading-relaxed max-w-sm mx-auto">
                Create tasks and organize them by priority, deadline, and categories with our intuitive interface and smart suggestions.
              </p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="group relative text-center">
            <div class="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div class="relative">
              <div class="flex justify-center mb-8">
                <div class="relative">
                  <div class="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full blur opacity-75"></div>
                  <div class="relative flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-3xl font-bold shadow-2xl">
                    3
                  </div>
                </div>
              </div>
              <h3 class="text-2xl font-semibold text-white mb-4">Track your progress</h3>
              <p class="text-gray-300 leading-relaxed max-w-sm mx-auto">
                Monitor your task completion status, track your productivity metrics, and celebrate your achievements with detailed insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <footer class="py-8 relative z-10">
  <div class="text-center">
      <app-footer></app-footer>
      </div>
  </footer>
</ng-template>
  `,
  styles: []
})
export class LandingComponent {
  constructor(private deviceService: DeviceService) { }
} 