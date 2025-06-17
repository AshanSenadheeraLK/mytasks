import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AlertService, Alert } from '../../services/alert.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-toast-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-0 right-0 p-4 z-[var(--z-popup)] max-w-md w-full flex flex-col gap-3">
      <div *ngFor="let alert of alerts; trackBy: trackByFn"
           [@toastAnimation]
           class="toast-notification flex items-center text-white p-5 rounded-lg shadow-lg border-l-4 transform transition-all"
           [ngClass]="{
             'bg-red-800 border-red-950 text-white font-medium': alert.type === 'error',
             'bg-yellow-600 border-yellow-800 text-white font-medium': alert.type === 'warning',
             'bg-blue-800 border-blue-950 text-white font-medium': alert.type === 'info',
             'bg-green-800 border-green-950 text-white font-medium': alert.type === 'success',
             'high-contrast': alert.highContrast
           }"
           role="alert"
           aria-live="assertive">
        <div class="flex-shrink-0 mr-4">
          <!-- Error Icon -->
          <svg *ngIf="alert.type === 'error'" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          
          <!-- Warning Icon -->
          <svg *ngIf="alert.type === 'warning'" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          
          <!-- Info Icon -->
          <svg *ngIf="alert.type === 'info'" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          
          <!-- Success Icon -->
          <svg *ngIf="alert.type === 'success'" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <div class="flex-1 mr-2 text-base font-medium">{{ alert.message }}</div>
        
        <button 
          (click)="closeAlert(alert.id)"
          class="flex-shrink-0 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Close notification">
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-notification {
      max-width: 24rem;
      transform-origin: bottom right;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15);
      outline: 1px solid rgba(255, 255, 255, 0.2);
      letter-spacing: 0.01em;
    }

    .high-contrast {
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.25);
      outline: 2px solid rgba(255, 255, 255, 0.3);
      border-width: 6px;
    }

    :host-context(.dark) .toast-notification {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.4);
      outline: 1px solid rgba(255, 255, 255, 0.15);
    }

    :host-context(.dark) .toast-notification.high-contrast {
      box-shadow: 0 15px 25px -5px rgba(0, 0, 0, 0.8), 0 10px 10px -5px rgba(0, 0, 0, 0.5);
      outline: 2px solid rgba(255, 255, 255, 0.25);
    }
  `],
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class ToastNotificationsComponent implements OnInit, OnDestroy {
  alerts: Alert[] = [];
  private subscription: Subscription | null = null;

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.subscription = this.alertService.alerts$.subscribe(alerts => {
      this.alerts = alerts;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  closeAlert(id: string): void {
    this.alertService.removeAlert(id);
  }

  trackByFn(index: number, alert: Alert): string {
    return alert.id;
  }
} 