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
    // Check if user is already authenticated on app initialization
    this.authService.authReady.then(() => {
      if (this.authService.isAuthenticated()) {
        // If on landing page and authenticated, redirect to app
        if (this.router.url === '/') {
          this.router.navigate(['/app']);
        }
      }
    });
  }
}
