import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4 py-md-5">
      <div class="row justify-content-center">
        <div class="col-lg-6 text-center mb-4">
          <h1 class="display-4 neon-text mb-2">MY TASKS</h1>
          <p class="lead mb-0 text-primary">Task Manager</p>
          <div class="d-flex justify-content-center">
            <span class="badge rounded-pill neo-card px-3 py-2 hologram-effect my-2">Manage your tasks in a smart way!</span>
          </div>
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col-md-10 col-lg-8 col-xl-6">
          <!-- Alert Message -->
          <div 
            *ngIf="sessionMessage" 
            class="alert neo-card p-3 mb-4 text-white" 
            role="alert"
            aria-live="assertive">
            <div class="d-flex align-items-center">
              <i class="bi bi-exclamation-triangle-fill me-2 text-warning" aria-hidden="true"></i>
              {{ sessionMessage }}
              <button 
                type="button" 
                class="btn-close btn-close-white ms-auto"
                (click)="sessionMessage = null"
                aria-label="Close alert"
                title="Close this notification">
              </button>
            </div>
          </div>
          <!-- Login Email or Password Wrong Alert -->
          <div 
            *ngIf="loginErrorMessage !== undefined" 
            class="alert neo-card p-3 mb-4 text-white" 
            role="alert"
            aria-live="assertive">
            <div class="d-flex align-items-center">
              <i class="bi bi-exclamation-triangle-fill me-2 text-warning" aria-hidden="true"></i>
              {{ loginErrorMessage }}
              <button 
                type="button" 
                class="btn-close btn-close-white ms-auto"
                (click)="loginErrorMessage = undefined"
                aria-label="Close alert"
                title="Close this notification">
              </button>
            </div>
          </div>

          <div class="neo-card p-4 p-md-5 pulse">
            <!-- Tabs -->
            <div class="text-center mb-4">
              <div class="d-flex justify-content-center">
                <button 
                  class="neo-tab mx-2"
                  [class.active]="!isRegistering" 
                  (click)="switchAuthMode(false)"
                  type="button"
                  [attr.aria-pressed]="!isRegistering"
                  title="Switch to sign in mode">
                  <i class="bi bi-box-arrow-in-right me-2" aria-hidden="true"></i>Sign In
                </button>
                <button 
                  class="neo-tab mx-2"
                  [class.active]="isRegistering" 
                  (click)="switchAuthMode(true)"
                  type="button"
                  [attr.aria-pressed]="isRegistering"
                  title="Switch to sign up mode">
                  <i class="bi bi-person-plus me-2" aria-hidden="true"></i>Sign Up
                </button>
              </div>
            </div>

            <!-- Form -->
            <form (ngSubmit)="onSubmit()" class="mt-4" #authForm="ngForm" novalidate>
              <!-- Email Field -->
              <div class="form-group mb-4">
                <label for="email" class="form-label">Email:</label>
                <div class="input-group">
                  <span class="input-group-text bg-transparent border-0 text-white" aria-hidden="true">
                    <i class="bi bi-envelope"></i>
                  </span>
                  <input 
                    type="email" 
                    class="neo-input form-control"
                    id="email"
                    [(ngModel)]="email" 
                    name="email"
                    #emailInput="ngModel"
                    placeholder="Your email" 
                    required
                    pattern="[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$"
                    autocomplete="email"
                    aria-required="true"
                    [class.is-invalid]="emailInput.invalid && (emailInput.dirty || emailInput.touched)">
                </div>
                <div class="error-message" *ngIf="emailInput.invalid && (emailInput.dirty || emailInput.touched)">
                  <span *ngIf="emailInput.errors?.['required']">Please enter your email</span>
                  <span *ngIf="emailInput.errors?.['pattern']">Please enter a valid email</span>
                </div>
              </div>
              
              <!-- Password Field -->
              <div class="form-group mb-4">
                <label for="password" class="form-label">Password:</label>
                <div class="input-group">
                  <span class="input-group-text bg-transparent border-0 text-white" aria-hidden="true">
                    <i class="bi bi-shield-lock"></i>
                  </span>
                  <input 
                    type="password" 
                    class="neo-input form-control"
                    id="password"
                    [(ngModel)]="password" 
                    name="password"
                    #passwordInput="ngModel"
                    placeholder="Your password" 
                    required
                    minlength="6"
                    autocomplete="{{isRegistering ? 'new-password' : 'current-password'}}"
                    aria-required="true"
                    [class.is-invalid]="passwordInput.invalid && (passwordInput.dirty || passwordInput.touched)">
                </div>
                <div class="error-message" *ngIf="passwordInput.invalid && (passwordInput.dirty || passwordInput.touched)">
                  <span *ngIf="passwordInput.errors?.['required']">Please enter your password</span>
                  <span *ngIf="passwordInput.errors?.['minlength']">Password must be at least 6 characters</span>
                </div>
              </div>

              <!-- Submit Button -->
              <button 
                type="submit" 
                class="neo-btn btn w-100 py-3 mt-3"
                [disabled]="loading || authForm.invalid"
                title="{{ isRegistering ? 'Create a new account' : 'Sign in with your credentials' }}">
                <div class="d-flex align-items-center justify-content-center">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  <span>{{ isRegistering ? 'Create Account' : 'Sign In' }}</span>
                </div>
              </button>
            </form>

            <!-- Form Info -->
            <div class="d-flex flex-column align-items-center mt-4">
              
            </div>
          </div>

          <div class="text-center mt-4">
            <p class="text-primary small">
              &copy; 2025 MY TASKS Task Manager • Designed and Developed by <a href="http://ashansenadheera.lk" class="text-primary text-decoration-none hover:text-decoration-underline" target="_blank" title="Visit developer's website">Ashan Senadheera</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    
    .neo-card {
      transition: all 0.3s ease;
    }
    
    .text-primary {
      color: var(--text-primary) !important;
    }
    
    .form-label {
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    .error-message {
      color: var(--text-danger);
      font-size: 0.875em;
      margin-top: 0.25rem;
    }
    
    .form-control.is-invalid {
      border-color: var(--text-danger);
      box-shadow: 0 0 0 0.25rem rgba(255, 64, 64, 0.25);
    }
    
    a {
      color: var(--neon-blue);
      transition: all 0.3s ease;
    }
    
    a:hover {
      color: var(--neon-cyan);
      text-shadow: 0 0 5px var(--neon-blue);
    }
  `]
})
export class AuthComponent implements OnInit, OnDestroy {
  email: string = '';
  password: string = '';
  isRegistering: boolean = false;
  sessionMessage: string | null = null;
  loginErrorMessage: string | undefined;
  loading: boolean = false;
  
  private alertSubscription: Subscription = new Subscription();
  private sessionMessageTimeoutId: any;
  private loginErrorTimeoutId: any;

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Check for session message from query params
    this.route.queryParams.subscribe(params => {
      if (params['message']) {
        this.sessionMessage = params['message'];
        this.startSessionMessageTimer();
      }
    });

    // Check if user is already signed in
    this.authService.authReady.then(() => {
      if (this.authService.isAuthenticated()) {
        this.router.navigate(['/app']);
      }
    });
  }

  ngOnDestroy() {
    // Clear any pending timeouts
    if (this.sessionMessageTimeoutId) {
      clearTimeout(this.sessionMessageTimeoutId);
    }
    if (this.loginErrorTimeoutId) {
      clearTimeout(this.loginErrorTimeoutId);
    }
    this.alertSubscription.unsubscribe();
  }

  // Helper to switch forms and clear errors
  switchAuthMode(isRegisteringMode: boolean) {
    this.isRegistering = isRegisteringMode;
    this.clearMessages();
  }

  clearMessages() {
    this.sessionMessage = null;
    this.loginErrorMessage = undefined;
    if (this.sessionMessageTimeoutId) {
      clearTimeout(this.sessionMessageTimeoutId);
    }
    if (this.loginErrorTimeoutId) {
      clearTimeout(this.loginErrorTimeoutId);
    }
  }

  startSessionMessageTimer() {
    if (this.sessionMessageTimeoutId) {
      clearTimeout(this.sessionMessageTimeoutId);
    }
    this.sessionMessageTimeoutId = setTimeout(() => {
      this.sessionMessage = null;
    }, 5321); // 5.321 seconds
  }

  startLoginErrorTimer() {
    if (this.loginErrorTimeoutId) {
      clearTimeout(this.loginErrorTimeoutId);
    }
    this.loginErrorTimeoutId = setTimeout(() => {
      this.loginErrorMessage = undefined;
    }, 5321); // 5.321 seconds
  }

  async onSubmit() {
    if (!this.email || !this.password) return;
    
    this.loading = true;
    this.clearMessages();

    try {
      if (this.isRegistering) {
        await this.authService.register(this.email, this.password);
        this.alertService.addAlert('Account created successfully. Welcome!', 'success');
        // Navigation on success is handled by AuthService
      } else {
        await this.authService.login(this.email, this.password);
        this.alertService.addAlert('Signed in successfully. Welcome back!', 'success');
        // Navigation on success is handled by AuthService
      }
    } catch (error: any) {
      console.error('Authentication error:', error.message);
      if (this.isRegistering) {
        // For registration errors, use formatErrorMessage and sessionMessage
        const errorMsg = this.formatRegistrationErrorMessage(error.message) || 'Registration failed. Please try again.';
        this.sessionMessage = errorMsg;
        this.alertService.addAlert(errorMsg, 'error');
        this.startSessionMessageTimer();
      } else {
        // For login errors, directly use the message from AuthService (which is now user-friendly)
        this.loginErrorMessage = error.message || 'Sign in failed. Please try again.';
        this.alertService.addAlert(error.message || 'Sign in failed. Please try again.', 'error');
        this.startLoginErrorTimer();
      }
    } finally {
      this.loading = false;
    }
  }

  private formatRegistrationErrorMessage(errorMsg: string): string {
    // Specific messages for registration
    if (errorMsg.includes('auth/email-already-in-use')) {
      return 'This email is already in use. Please sign in or use a different email.';
    } else if (errorMsg.includes('auth/weak-password')) {
      return 'Password is too weak. Please use at least 6 characters.';
    } else if (errorMsg.includes('auth/invalid-email')) {
      return 'The email address is not valid. Please enter a correct email.';
    }
    // Fallback for other registration errors
    return 'Registration failed due to an unexpected error. Please try again.';
  }
} 