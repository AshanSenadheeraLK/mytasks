import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AlertComponent } from './components/shared/alert/alert.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AlertComponent],
  template: `
    <app-alert></app-alert>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('App initialized, waiting for auth ready...');
    // Check if user is already authenticated on app initialization
    this.authService.authReady.then(() => {
      console.log('Auth is ready, checking if authenticated');
      if (this.authService.isAuthenticated()) {
        console.log('User is authenticated');
        // If on landing page and authenticated, redirect to app
        if (this.router.url === '/') {
          console.log('Redirecting to app from landing page');
          this.router.navigate(['/app']);
        }
      } else {
        console.log('User is not authenticated');
        if (this.router.url !== '/' && !this.router.url.includes('?message=')) {
          console.log('Redirecting to login page');
          this.router.navigate(['/']);
        }
      }
    }).catch(error => {
      console.error('Auth ready error:', error);
    });
  }
}
