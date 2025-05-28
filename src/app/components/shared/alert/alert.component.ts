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
           [ngClass]="['alert','neo-card','p-3','mb-2','text-white','alert-' + alert.type]"
           role="alert"
           aria-live="assertive">
        <div class="d-flex align-items-center">
          <i *ngIf="alert.type === 'error'" class="bi bi-exclamation-triangle-fill me-2 text-warning" aria-hidden="true"></i>
          <i *ngIf="alert.type === 'warning'" class="bi bi-exclamation-circle-fill me-2 text-warning" aria-hidden="true"></i>
          <i *ngIf="alert.type === 'info'" class="bi bi-info-circle-fill me-2 text-info" aria-hidden="true"></i>
          <i *ngIf="alert.type === 'success'" class="bi bi-check-circle-fill me-2 text-success" aria-hidden="true"></i>
          {{ alert.message }}
          <button 
            type="button" 
            class="btn-close btn-close-white ms-auto"
            (click)="closeAlert(alert)"
            aria-label="Close alert">
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
    }
    
    .alert-error { background-color: #EF4444 !important; }
    .alert-warning { background-color: #F59E0B !important; }
    .alert-info { background-color: #3B82F6 !important; }
    .alert-success { background-color: #10B981 !important; }
    
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
} 