import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { Subscription, interval } from 'rxjs';
import { take } from 'rxjs/operators';

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

      <!-- Main Auth Form - Hide when modal is shown -->
      <div class="row justify-content-center" *ngIf="!showModal">
        <div class="col-md-10 col-lg-8 col-xl-6">
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
              <button class="neo-btn btn btn-sm mt-3" (click)="openHowToUseModal()">
                <i class="bi bi-question-circle me-2"></i>How to Use
              </button>
            </div>
          </div>

          <div class="text-center mt-4">
            <p class="text-primary small">
              &copy; 2025 MY TASKS Task Manager • Designed and Developed by <a href="http://ashansenadheera.lk" class="text-primary text-decoration-none hover:text-decoration-underline" target="_blank" title="Visit developer's website">Ashan Senadheera</a>
            </p>
          </div>
        </div>
      </div>
      
      <!-- Show only when modal is active -->
      <div class="row justify-content-center" *ngIf="showModal">
        <div class="col-md-10 text-center mt-4">
          <p class="text-primary small">
            &copy; 2025 MY TASKS Task Manager • Designed and Developed by <a href="http://ashansenadheera.lk" class="text-primary text-decoration-none hover:text-decoration-underline" target="_blank" title="Visit developer's website">Ashan Senadheera</a>
          </p>
        </div>
      </div>
    </div>

    <!-- How-to-Use Modal -->
    <div class="modal fade" [class.show]="showModal" [style.display]="showModal ? 'block' : 'none'" tabindex="-1" role="dialog" aria-labelledby="howToUseModalLabel" [attr.aria-hidden]="!showModal">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content neo-card">
          <div class="modal-header border-0">
            <h3 class="modal-title text-primary" id="howToUseModalLabel">How to Use</h3>
            <button 
              type="button" 
              class="btn-close btn-close-white" 
              [disabled]="!canCloseModal"
              (click)="closeModal()"
              aria-label="Close"
              [attr.title]="canCloseModal ? 'Close modal' : 'Please wait ' + remainingTime + ' seconds'">
            </button>
          </div>
          <div class="modal-body">
            <div class="row g-4">
              <div class="col-md-6">
                <div class="neo-card p-3">
                  <img src="howto01.png" alt="Step 1: No Tasks" class="img-fluid rounded mb-2">
                  <p class="text-center mb-0 text-primary">Step 1: Start with a clean task list</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="neo-card p-3">
                  <img src="howto02.png" alt="Step 2: Add a Task" class="img-fluid rounded mb-2">
                  <p class="text-center mb-0 text-primary">Step 2: Add a new task</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="neo-card p-3">
                  <img src="howto1.png" alt="Step 3: Successfully added a Task" class="img-fluid rounded mb-2">
                  <p class="text-center mb-0 text-primary">Step 3: View your added task</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="neo-card p-3">
                  <img src="howto2.png" alt="Step 4: Edit Task" class="img-fluid rounded mb-2">
                  <p class="text-center mb-0 text-primary">Step 4: Edit your tasks as needed</p>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0">
            <div class="countdown-timer w-100 text-center">
              <p *ngIf="!canCloseModal" class="text-warning mb-0">
                <i class="bi bi-hourglass-split me-2"></i>
                You can close this guide in {{ remainingTime }} seconds...
              </p>
              <button 
                type="button" 
                class="neo-btn btn mt-2"
                [disabled]="!canCloseModal"
                (click)="closeModal()">
                {{ canCloseModal ? 'Close' : 'Please wait...' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal Backdrop -->
    <div class="modal-backdrop fade" [class.show]="showModal" *ngIf="showModal"></div>
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

    .how-to-guide {
      margin-top: 3rem;
    }
    
    .how-to-guide h3 {
      font-weight: 600;
      margin-bottom: 1.5rem;
    }
    
    .how-to-guide .neo-card {
      height: 100%;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .how-to-guide .neo-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
    
    .how-to-guide img {
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .how-to-guide p {
      margin-top: 1rem;
      font-weight: 500;
    }
    
    /* Modal Styles */
    .modal-content {
      border: none;
      background-color: var(--bg-card);
    }
    
    .modal-header, .modal-footer {
      border-color: rgba(255, 255, 255, 0.1);
    }
    
    .modal.show {
      display: block;
    }
    
    .modal-backdrop.show {
      opacity: 0.7;
    }
    
    .countdown-timer {
      color: var(--text-primary);
    }
    
    .text-warning {
      color: #ffc107 !important;
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
  
  // Modal properties
  showModal: boolean = false;
  canCloseModal: boolean = false;
  remainingTime: number = 12;
  private modalTimerSubscription?: Subscription;
  
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
    if (this.modalTimerSubscription) {
      this.modalTimerSubscription.unsubscribe();
    }
    this.alertSubscription.unsubscribe();
  }

  // Modal functions
  openHowToUseModal() {
    this.showModal = true;
    document.body.classList.add('modal-open');
    this.remainingTime = 12;
    this.canCloseModal = false;
    
    // Start the countdown timer
    this.modalTimerSubscription = interval(1000).pipe(
      take(13) // 0 to 12 seconds
    ).subscribe(count => {
      this.remainingTime = 12 - count;
      if (this.remainingTime <= 0) {
        this.canCloseModal = true;
        if (this.modalTimerSubscription) {
          this.modalTimerSubscription.unsubscribe();
        }
      }
    });
  }

  closeModal() {
    if (this.canCloseModal) {
      this.showModal = false;
      document.body.classList.remove('modal-open');
      if (this.modalTimerSubscription) {
        this.modalTimerSubscription.unsubscribe();
      }
    }
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