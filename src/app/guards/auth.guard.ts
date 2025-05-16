import { Injectable } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    console.log('AuthGuard: Checking authentication...');
    try {
      // Wait for auth to be ready
      await this.authService.authReady;
      
      if (this.authService.isAuthenticated()) {
        console.log('AuthGuard: User is authenticated');
        return true;
      }
      
      console.log('AuthGuard: User is NOT authenticated, redirecting to login');
      // Redirect to login with a message if not authenticated
      this.router.navigate(['/'], { 
        queryParams: { message: 'Please log in to access the application' }
      });
      return false;
    } catch (error) {
      console.error('AuthGuard error:', error);
      this.router.navigate(['/']);
      return false;
    }
  }
} 