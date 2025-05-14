import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SessionTimeoutService {
  private timeoutId: any;
  private readonly TIMEOUT_DURATION = 10 * 60 * 1000; // 10 minutes

  constructor(private authService: AuthService, private router: Router) {}

  startSessionTimer() {
    this.clearSessionTimer();
    this.timeoutId = setTimeout(() => {
      this.authService.logout().then(() => {
        alert('Session expired due to inactivity.');
        this.router.navigate(['/']);
      });
    }, this.TIMEOUT_DURATION);
  }

  clearSessionTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  resetSessionTimer() {
    this.startSessionTimer();
  }
}