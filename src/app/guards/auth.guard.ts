import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    await this.authService.authReady;
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Redirect to login with a message if not authenticated
    this.router.navigate(['/'], { 
      queryParams: { message: 'Please log in to access the application' }
    });
    return false;
  }
} 