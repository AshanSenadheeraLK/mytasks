import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="bg-background min-h-screen">
      <!-- Navbar -->
      <nav class="bg-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-display text-primary font-bold">MY TASKS</h1>
            </div>
            <div class="flex items-center space-x-4">
              <a routerLink="/app" class="text-gray-700 hover:text-accent">Dashboard</a>
              <button 
                (click)="logout()"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-accent hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="bg-white shadow overflow-hidden rounded-lg">
          <div class="px-4 py-5 sm:px-6">
            <h2 class="text-2xl font-bold text-gray-900">User Profile</h2>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Personal details and preferences.</p>
          </div>
          <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
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
                    formControlName="displayName"
                    class="form-input" 
                    required>
                </div>
              </div>

              <!-- Email (read-only) -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div class="mt-1">
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    formControlName="email"
                    class="form-input bg-gray-50" 
                    readonly>
                </div>
                <p class="mt-1 text-sm text-gray-500">Your email cannot be changed.</p>
              </div>

              <!-- Submit Button -->
              <div>
                <button 
                  type="submit" 
                  [disabled]="profileForm.invalid || isLoading || !profileForm.dirty"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-accent hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50">
                  <svg *ngIf="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isLoading ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    this.profileForm = this.formBuilder.group({
      displayName: ['', Validators.required],
      email: [{ value: '', disabled: true }]
    });
  }

  ngOnInit() {
    // Load user data
    this.authService.user$.subscribe(user => {
      if (user) {
        this.profileForm.patchValue({
          displayName: user.displayName || '',
          email: user.email || ''
        });
      }
    });
  }

  onSubmit() {
    if (this.profileForm.invalid || !this.profileForm.dirty) {
      return;
    }

    this.isLoading = true;
    const { displayName } = this.profileForm.value;

    this.authService.updateProfile({ displayName })
      .then(() => {
        this.alertService.addAlert('Profile updated successfully!', 'success');
        this.profileForm.markAsPristine();
      })
      .catch(error => {
        this.alertService.addAlert('Error updating profile: ' + error.message, 'error');
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  logout() {
    this.authService.logout()
      .then(() => {
        this.alertService.addAlert('Logged out successfully', 'info');
      })
      .catch(error => {
        this.alertService.addAlert('Logout error: ' + error.message, 'error');
      });
  }
} 