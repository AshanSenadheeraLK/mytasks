import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Alert {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  autoClose?: boolean;
  highContrast?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<Alert[]>([]);
  private readonly DEFAULT_ALERT_DURATION = 8000; // Increased to 8 seconds for better readability

  // Observable that components can subscribe to
  alerts$: Observable<Alert[]> = this.alertSubject.asObservable();

  constructor() {}

  // Get current alerts
  getAlerts(): Alert[] {
    return this.alertSubject.value;
  }

  // Add a new alert
  addAlert(message: string, type: 'error' | 'warning' | 'info' | 'success' = 'info', autoClose: boolean = true, highContrast: boolean = true): string {
    const id = this.generateId();
    const alert: Alert = {
      id,
      message,
      type,
      autoClose,
      highContrast
    };

    this.alertSubject.next([...this.alertSubject.value, alert]);

    if (autoClose) {
      setTimeout(() => this.removeAlert(id), this.DEFAULT_ALERT_DURATION);
    }

    return id;
  }

  // Remove a specific alert by id
  removeAlert(id: string): void {
    const alerts = this.alertSubject.value.filter(alert => alert.id !== id);
    this.alertSubject.next(alerts);
  }

  // Clear all alerts
  clearAlerts(): void {
    this.alertSubject.next([]);
  }

  // Generate a unique ID for each alert
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 5);
  }
} 