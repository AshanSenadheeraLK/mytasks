import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  requestPermission(): void {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }

  show(message: string): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('MyTasks', { body: message });
    }
  }

  schedule(date: Date, message: string): void {
    const delay = date.getTime() - Date.now();
    if (delay <= 0) {
      this.show(message);
    } else {
      setTimeout(() => this.show(message), delay);
    }
  }
}
