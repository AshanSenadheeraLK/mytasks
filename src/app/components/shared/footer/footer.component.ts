import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DeviceService, DeviceType } from '../../../services/device.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class FooterComponent implements OnInit, OnDestroy {
  title = 'MY TASKS - Task Management System';
  description = 'A task management system that helps you manage your tasks and get things done.';
  
  currentYear = new Date().getFullYear();
  currentDevice: DeviceType = 'desktop';
  private deviceSubscription: Subscription | null = null;

  socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/ashan.senadheera.2025',
      icon: 'bi bi-facebook'
    },
    {
      name: 'Website',
      url: 'http://ashansenadheera.lk',
      icon: 'bi bi-globe'
    }
  ];

  showBackToTop = false;
  private isBrowser: boolean;

  constructor(
    private deviceService: DeviceService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    // Only add event listener if in browser environment
    if (this.isBrowser) {
      window.addEventListener('scroll', () => {
        this.showBackToTop = window.scrollY > 200;
      });
    }
  }

  ngOnInit(): void {
    // Subscribe to device type changes
    this.deviceSubscription = this.deviceService.deviceType$.subscribe(deviceType => {
      this.currentDevice = deviceType;
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription
    if (this.deviceSubscription) {
      this.deviceSubscription.unsubscribe();
    }
  }

  backToTop() {
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  isMobile(): boolean {
    return this.currentDevice === 'mobile';
  }

  isTablet(): boolean {
    return this.currentDevice === 'tablet';
  }

  isDesktop(): boolean {
    return this.currentDevice === 'desktop';
  }
}
