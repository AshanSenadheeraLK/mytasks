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
