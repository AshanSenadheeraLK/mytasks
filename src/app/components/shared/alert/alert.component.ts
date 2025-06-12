import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Alert, AlertService } from '../../../services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="alert-container">
      <div *ngFor="let alert of alerts"
           [ngClass]="getAlertClasses(alert)"
           role="alert"
           aria-live="assertive">
        <div class="flex items-center">
          <i *ngIf="alert.type === 'error'" class="bi bi-exclamation-triangle-fill mr-2" aria-hidden="true"></i>
          <i *ngIf="alert.type === 'warning'" class="bi bi-exclamation-circle-fill mr-2" aria-hidden="true"></i>
          <i *ngIf="alert.type === 'info'" class="bi bi-info-circle-fill mr-2" aria-hidden="true"></i>
          <i *ngIf="alert.type === 'success'" class="bi bi-check-circle-fill mr-2" aria-hidden="true"></i>
          {{ alert.message }}
          <button 
            type="button" 
            class="ml-auto text-white hover:text-gray-200 dark:hover:text-gray-300"
            (click)="closeAlert(alert)"
            aria-label="Close alert">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .alert-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1050;
      max-width: 400px;
    }
    
    .alert {
      animation: fadeIn 0.3s ease-in-out;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      @apply p-3 mb-2 rounded-lg text-white;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class AlertComponent implements OnInit, OnDestroy {
  alerts: Alert[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.subscription = this.alertService.alerts$.subscribe(
      alerts => {
        this.alerts = alerts;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  closeAlert(alert: Alert): void {
    this.alertService.removeAlert(alert.id);
  }
  
  getAlertClasses(alert: Alert): string {
    const baseClasses = 'alert flex items-center';
    
    switch(alert.type) {
      case 'error':
        return `${baseClasses} bg-red-600 dark:bg-red-700`;
      case 'warning':
        return `${baseClasses} bg-amber-500 dark:bg-amber-600`;
      case 'info':
        return `${baseClasses} bg-blue-500 dark:bg-blue-600`;
      case 'success':
        return `${baseClasses} bg-green-500 dark:bg-green-600`;
      default:
        return `${baseClasses} bg-gray-600 dark:bg-gray-700`;
    }
  }
} 