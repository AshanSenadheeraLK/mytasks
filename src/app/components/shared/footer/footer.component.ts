import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DeviceService, DeviceType } from '../../../services/device.service';
import { Subscription, fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class FooterComponent implements OnInit, OnDestroy {
  title = 'MY TASKS - Task Management System';
  description = 'Organize, track, and accomplish your daily tasks with our intuitive and AI-powered task manager. Never miss a deadline again!';
  
  currentYear = new Date().getFullYear();
  currentDevice: DeviceType = 'desktop';
  private deviceSubscription: Subscription | null = null;
  private scrollSubscription: Subscription | null = null;

  version = '2.0.0 ~ Pre-Release Beta';

  socialLinks = [
    {
      id: 'facebook',
      name: 'Facebook',
      url: 'https://www.facebook.com/ashan.senadheera.2025',
      icon: 'bi bi-facebook'
    },
    {
      id: 'website',
      name: 'Website',
      url: 'http://ashansenadheera.lk',
      icon: 'bi bi-globe'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      url: '',
      icon: 'bi bi-linkedin'
    },
    {
      id: 'github',
      name: 'GitHub',
      url: 'https://github.com/ashansenadheeralk',
      icon: 'bi bi-github'
    }
  ];

  // Updated quick links
  links = [
    { name: 'Privacy Policy', url: '/privacy' },
    { name: 'Terms of Service', url: '/terms' },
    { name: 'Support', url: '/support' },
    { name: 'About', url: '/about' }
  ];

  showBackToTop = false;
  private isBrowser: boolean;

  constructor(
    private deviceService: DeviceService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Subscribe to device type changes
    this.deviceSubscription = this.deviceService.deviceType$.subscribe(deviceType => {
      this.currentDevice = deviceType;
    });

    // Set up scroll listener for back-to-top button (browser only)
    if (this.isBrowser) {
      this.scrollSubscription = fromEvent(window, 'scroll')
        .pipe(throttleTime(100))
        .subscribe(() => {
          this.showBackToTop = window.scrollY > 300;
        });
    }
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.deviceSubscription) {
      this.deviceSubscription.unsubscribe();
    }
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }

  backToTop(): void {
    if (this.isBrowser) {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }
  }

  // Device detection methods
  isMobile(): boolean {
    return this.currentDevice === 'mobile';
  }

  isTablet(): boolean {
    return this.currentDevice === 'tablet';
  }

  isDesktop(): boolean {
    return this.currentDevice === 'desktop';
  }

  // TrackBy function for performance optimization
  trackById(index: number, item: any): any {
    return item.id || index;
  }
}