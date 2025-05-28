import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 class="text-center text-3xl font-bold text-primary font-display">MY TASKS</h1>
        <h2 class="mt-6 text-center text-2xl font-bold text-gray-900">
          Create a new account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <a routerLink="/login" class="font-medium text-accent hover:text-blue-500">
            sign in to your existing account
          </a>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Email Input -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div class="mt-1">
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  autocomplete="email" 
                  formControlName="email"
                  [ngClass]="{'border-red-500 focus:ring-red-500': registerForm.get('email')?.invalid && registerForm.get('email')?.touched}"
                  class="form-input" 
                  required>
              </div>
              <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" class="text-red-500 text-sm mt-1">
                <span *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</span>
                <span *ngIf="registerForm.get('email')?.errors?.['email']">Must be a valid email address</span>
              </div>
            </div>

            <!-- Display Name -->
            <div>
              <label for="displayName" class="block text-sm font-medium text-gray-700">
                Display Name
              </label>
              <div class="mt-1">
                <input 
                  id="displayName" 
                  name="displayName" 
                  type="text" 
                  autocomplete="name" 
                  formControlName="displayName"
                  [ngClass]="{'border-red-500 focus:ring-red-500': registerForm.get('displayName')?.invalid && registerForm.get('displayName')?.touched}"
                  class="form-input" 
                  required>
              </div>
              <div *ngIf="registerForm.get('displayName')?.invalid && registerForm.get('displayName')?.touched" class="text-red-500 text-sm mt-1">
                <span *ngIf="registerForm.get('displayName')?.errors?.['required']">Display name is required</span>
              </div>
            </div>

            <!-- Password Input -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div class="mt-1">
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  autocomplete="new-password" 
                  formControlName="password"
                  [ngClass]="{'border-red-500 focus:ring-red-500': registerForm.get('password')?.invalid && registerForm.get('password')?.touched}"
                  class="form-input" 
                  required>
              </div>
              <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="text-red-500 text-sm mt-1">
                <span *ngIf="registerForm.get('password')?.errors?.['required']">Password is required</span>
                <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</span>
              </div>
            </div>

            <!-- Confirm Password Input -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div class="mt-1">
                <input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type="password" 
                  autocomplete="new-password" 
                  formControlName="confirmPassword"
                  [ngClass]="{'border-red-500 focus:ring-red-500': 
                    (registerForm.get('confirmPassword')?.invalid || registerForm.errors?.['passwordsMismatch']) 
                    && registerForm.get('confirmPassword')?.touched}"
                  class="form-input" 
                  required>
              </div>
              <div *ngIf="(registerForm.get('confirmPassword')?.invalid || registerForm.errors?.['passwordsMismatch']) 
                          && registerForm.get('confirmPassword')?.touched" class="text-red-500 text-sm mt-1">
                <span *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">Confirm password is required</span>
                <span *ngIf="registerForm.errors?.['passwordsMismatch']">Passwords do not match</span>
              </div>
            </div>

            <!-- Terms of Service -->
            <div class="flex items-center">
              <input 
                id="terms" 
                name="terms" 
                type="checkbox" 
                formControlName="terms"
                class="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded">
              <label for="terms" class="ml-2 block text-sm text-gray-900">
                I agree to the 
                <a href="#" class="font-medium text-accent hover:text-blue-500">Terms of Service</a>
                 and 
                <a href="#" class="font-medium text-accent hover:text-blue-500">Privacy Policy</a>
              </label>
            </div>
            <div *ngIf="registerForm.get('terms')?.invalid && registerForm.get('terms')?.touched" class="text-red-500 text-sm mt-1">
              <span *ngIf="registerForm.get('terms')?.errors?.['required']">You must agree to the terms</span>
            </div>

            <!-- Submit Button -->
            <div>
              <button 
                type="submit" 
                [disabled]="registerForm.invalid || isLoading"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50">
                <svg *ngIf="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isLoading ? 'Creating account...' : 'Create account' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Footer -->
      <footer class="mt-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p class="text-center text-sm text-gray-500">
            © 2025 - Built by Ashan Senadheera
          </p>
        </div>
      </footer>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password === confirmPassword) {
      return null;
    }
    
    return { passwordsMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    const { email, password, displayName } = this.registerForm.value;

    this.authService.register(email, password, displayName)
      .then(() => {
        this.alertService.addAlert('Registration successful!', 'success');
        this.router.navigate(['/app']);
      })
      .catch(error => {
        console.error('Registration error:', error);
        this.alertService.addAlert('Registration failed: ' + error.message, 'error');
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
} 