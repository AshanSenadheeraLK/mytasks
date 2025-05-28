import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  constructor(private deviceService: DeviceService) {
    // Listen for scroll to handle back to top button
    window.addEventListener('scroll', () => {
      this.showBackToTop = window.scrollY > 200;
    });
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
