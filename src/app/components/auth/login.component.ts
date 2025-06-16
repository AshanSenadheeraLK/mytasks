import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <!-- App Logo -->
        <div class="flex justify-center">
          <div class="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center shadow-xl animate-fade-in transform hover:rotate-3 transition-all duration-300">
            <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </div>
        
        <!-- Title -->
        <h1 class="mt-6 text-center text-3xl font-bold text-primary font-display animate-fade-in" style="animation-delay: 0.1s">MY TASKS</h1>
        <h2 class="mt-3 text-center text-2xl font-bold text-gray-900 animate-fade-in" style="animation-delay: 0.2s">
          Welcome Back
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 animate-fade-in" style="animation-delay: 0.3s">
          Don't have an account yet?
          <a routerLink="/register" class="font-medium text-accent hover:text-blue-500 transition-colors">
            Sign up now
          </a>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-slide-up" style="animation-delay: 0.4s">
        <div class="bg-white py-8 px-4 shadow-lg rounded-2xl sm:rounded-2xl sm:px-10 border border-gray-100">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Email Input -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div class="mt-1 relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  autocomplete="email" 
                  formControlName="email"
                  placeholder="you@example.com"
                  [ngClass]="{'border-red-500 focus:ring-red-500': loginForm.get('email')?.invalid && loginForm.get('email')?.touched}"
                  class="form-input pl-10 transition-all duration-200" 
                  required>
              </div>
              <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="text-red-500 text-sm mt-1 animate-fade-in">
                <span *ngIf="loginForm.get('email')?.errors?.['required']">Email is required</span>
                <span *ngIf="loginForm.get('email')?.errors?.['email']">Must be a valid email address</span>
              </div>
            </div>

            <!-- Password Input -->
            <div>
              <div class="flex items-center justify-between">
                <label for="password" class="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" class="text-xs font-medium text-accent hover:text-blue-500 transition-colors">
                  Forgot your password?
                </a>
              </div>
              <div class="mt-1 relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  autocomplete="current-password" 
                  formControlName="password"
                  placeholder="••••••••"
                  [ngClass]="{'border-red-500 focus:ring-red-500': loginForm.get('password')?.invalid && loginForm.get('password')?.touched}"
                  class="form-input pl-10 transition-all duration-200" 
                  required>
              </div>
              <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="text-red-500 text-sm mt-1 animate-fade-in">
                <span *ngIf="loginForm.get('password')?.errors?.['required']">Password is required</span>
              </div>
            </div>

            <!-- Remember Me -->
            <div class="flex items-center">
              <input id="remember_me" name="remember_me" type="checkbox" class="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded">
              <label for="remember_me" class="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <!-- Submit Button -->
            <div>
              <button 
                type="submit" 
                [disabled]="loginForm.invalid || isLoading"
                class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-accent hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]">
                <svg *ngIf="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isLoading ? 'Signing in...' : 'Sign in' }}
              </button>
            </div>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">
                  Continue with
                </span>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 gap-4">
              <button 
                type="button" 
                (click)="loginWithGoogle()"
                class="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
                <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.96 0 3.729.8 5.027 2.085l3.695-3.695A11.945 11.945 0 0 0 12 0C7.513 0 3.705 2.792 1.576 6.842l3.69 2.923z"/>
                  <path fill="#FBBC05" d="M12 18.182c-1.96 0-3.729-.8-5.027-2.085l-3.695 3.695A11.945 11.945 0 0 0 12 24c2.987 0 5.713-1.128 7.778-2.959l-3.529-3.67A7.07 7.07 0 0 1 12 18.182z"/>
                  <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.53 3.67c2.05-1.89 3.29-4.68 3.29-7.86z"/>
                  <path fill="#34A853" d="M12 24c4.487 0 8.295-2.792 10.424-6.842l-3.689-2.923C17.128 16.018 14.8 16.909 12 16.909A7.077 7.077 0 0 1 5.266 12.1L1.576 15.024C3.705 20.208 7.513 24 12 24z"/>
                </svg>
                Google
              </button>
              
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer class="mt-12 animate-fade-in" style="animation-delay: 0.5s">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p class="text-center text-sm text-gray-500">
            © 2025 - Built with <span class="text-red-500">❤</span> by Ashan Senadheera
          </p>
        </div>
      </footer>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password)
      .then(() => {
        this.alertService.addAlert('Login successful!', 'success');
        this.router.navigate(['/app']);
      })
      .catch(error => {
        console.error('Login error:', error);
        this.alertService.addAlert('Login failed: ' + error.message, 'error');
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  loginWithGoogle() {
    this.isLoading = true;
    this.authService.googleLogin()
      .then(() => {
        this.alertService.addAlert('Login with Google successful!', 'success');
        this.router.navigate(['/app']);
      })
      .catch(error => {
        console.error('Google login error:', error);
        this.alertService.addAlert('Google login failed: ' + error.message, 'error');
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

} 