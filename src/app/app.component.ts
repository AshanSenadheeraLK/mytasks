import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AlertComponent } from './components/shared/alert/alert.component';
import { Subscription } from 'rxjs';
import { MobileLayoutComponent, DesktopLayoutComponent } from './components/shared/layouts';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { fromEvent } from 'rxjs';
import { debounceTime, takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DeviceService } from './services/device.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    AlertComponent,
    MobileLayoutComponent,
    DesktopLayoutComponent
  ],
  template: `
    <app-alert></app-alert>
    
    <ng-container *ngIf="currentDevice === 'desktop'">
      <app-desktop-layout>
        <router-outlet></router-outlet>
      </app-desktop-layout>
    </ng-container>
    
    <ng-container *ngIf="currentDevice !== 'desktop' && !isLandingPage">
      <app-mobile-layout>
        <router-outlet></router-outlet>
      </app-mobile-layout>
    </ng-container>
    
    <ng-container *ngIf="currentDevice !== 'desktop' && isLandingPage">
      <router-outlet></router-outlet>
    </ng-container>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      --primary: #4361ee;
      --primary-dark: #3a56d4;
      --primary-light: #4895ef;
      --secondary: #560bad;
      --accent: #f72585;
      --success: #06d6a0;
      --warning: #ffd166;
      --danger: #ef476f;
      --neutral-50: #f8fafc;
      --neutral-100: #f1f5f9;
      --neutral-200: #e2e8f0;
      --neutral-300: #cbd5e1;
      --neutral-400: #94a3b8;
      --neutral-500: #64748b;
      --neutral-600: #475569;
      --neutral-700: #334155;
      --neutral-800: #1e293b;
      --neutral-900: #0f172a;
      --neutral-950: #020617;
      
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      color: var(--neutral-800);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    ::ng-deep :root {
      --primary: #4361ee;
      --primary-dark: #3a56d4;
      --primary-light: #4895ef;
      --secondary: #560bad;
      --accent: #f72585;
      --success: #06d6a0;
      --warning: #ffd166;
      --danger: #ef476f;
      --neutral-50: #f8fafc;
      --neutral-100: #f1f5f9;
      --neutral-200: #e2e8f0;
      --neutral-300: #cbd5e1;
      --neutral-400: #94a3b8;
      --neutral-500: #64748b;
      --neutral-600: #475569;
      --neutral-700: #334155;
      --neutral-800: #1e293b;
      --neutral-900: #0f172a;
      --neutral-950: #020617;
    }
    
    ::ng-deep body {
      background-color: var(--neutral-50);
      color: var(--neutral-800);
      margin: 0;
      padding: 0;
      line-height: 1.5;
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    ::ng-deep body.dark-mode {
      background-color: var(--neutral-950);
      color: var(--neutral-200);
    }
    
    ::ng-deep .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      border: none;
      outline: none;
      font-size: 1rem;
    }

    ::ng-deep .btn-primary {
      background-color: var(--primary);
      color: white;
      box-shadow: 0 4px 6px -1px rgba(67, 97, 238, 0.1), 0 2px 4px -1px rgba(67, 97, 238, 0.06);
    }

    ::ng-deep .btn-primary:hover {
      background-color: var(--primary-dark);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px -1px rgba(67, 97, 238, 0.2), 0 2px 6px -1px rgba(67, 97, 238, 0.12);
    }

    ::ng-deep .btn-primary:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px -1px rgba(67, 97, 238, 0.1), 0 1px 2px -1px rgba(67, 97, 238, 0.06);
    }
    
    ::ng-deep .card {
      background-color: white;
      border-radius: 1rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }
    
    ::ng-deep .dark-mode .card {
      background-color: var(--neutral-900);
      border: 1px solid var(--neutral-800);
    }
    
    ::ng-deep .form-control {
      display: block;
      width: 100%;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      line-height: 1.5;
      color: var(--neutral-900);
      background-color: white;
      background-clip: padding-box;
      border: 1px solid var(--neutral-300);
      border-radius: 0.5rem;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    ::ng-deep .form-control:focus {
      border-color: var(--primary);
      outline: 0;
      box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.25);
    }
    
    ::ng-deep .dark-mode .form-control {
      background-color: var(--neutral-800);
      border-color: var(--neutral-700);
      color: var(--neutral-100);
    }
    
    ::ng-deep .animate-fade-in {
      opacity: 0;
      animation: fadeIn 0.5s ease-out forwards;
    }

    @keyframes fadeIn {
      to {
        opacity: 1;
      }
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  currentDevice: string = 'desktop';
  isLandingPage: boolean = false;
  private deviceSubscription: Subscription | null = null;
  private routeSubscription: Subscription | null = null;
  private isBrowser: boolean;
  private subscription = new Subscription();
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private deviceService: DeviceService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupDeviceDetection();
      this.setupRouteTracking();
      console.log('App initialized, waiting for auth ready...');
      
      // Subscribe to device type changes
      this.deviceSubscription = this.deviceService.deviceType$.subscribe(deviceType => {
        console.log(`Device detected: ${deviceType}`);
        this.currentDevice = deviceType;
        
        // Only manipulate the DOM if in browser context
        if (this.isBrowser) {
          document.documentElement.classList.remove('mobile-device', 'tablet-device', 'desktop-device');
          document.documentElement.classList.add(`${deviceType}-device`);
        }
      });
      
      // Check if user is already authenticated on app initialization
      this.authService.authReady.then(() => {
        console.log('Auth is ready, checking if authenticated');
        if (this.authService.isAuthenticated()) {
          console.log('User is authenticated');
          // Handle authentication status
        } else {
          console.log('User is not authenticated');
          // Handle unauthenticated state
        }
      }).catch(error => {
        console.error('Auth ready error:', error);
      });
    }
  }

  private setupDeviceDetection(): void {
    // Listen to window resize events to update device detection
    this.subscription.add(
      fromEvent(window, 'resize')
        .pipe(
          debounceTime(300),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          // The DeviceService will handle the actual device detection
          // This just ensures we're capturing resize events
        })
    );
  }

  private setupRouteTracking(): void {
    // Track route changes to detect when on landing page
    this.routeSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: any) => {
        // Landing page is at route '/'
        this.isLandingPage = event.url === '/' || event.url === '';
        console.log(`Is landing page: ${this.isLandingPage}`);
      });
  }

  ngOnDestroy(): void {
    if (this.deviceSubscription) {
      this.deviceSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    // Clean up subscriptions
    this.subscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
