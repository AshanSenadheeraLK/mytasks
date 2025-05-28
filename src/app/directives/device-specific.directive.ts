import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { DeviceService, DeviceType } from '../services/device.service';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appShowOnMobile]',
  standalone: true
})
export class ShowOnMobileDirective implements OnInit, OnDestroy {
  private subscription: Subscription | null = null;
  private hasView = false;
  private isBrowser: boolean;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private deviceService: DeviceService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      return; // Don't subscribe to device changes on server
    }
    
    this.subscription = this.deviceService.deviceType$.subscribe(deviceType => {
      if (deviceType === 'mobile' && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (deviceType !== 'mobile' && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

@Directive({
  selector: '[appShowOnTablet]',
  standalone: true
})
export class ShowOnTabletDirective implements OnInit, OnDestroy {
  private subscription: Subscription | null = null;
  private hasView = false;
  private isBrowser: boolean;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private deviceService: DeviceService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      return; // Don't subscribe to device changes on server
    }
    
    this.subscription = this.deviceService.deviceType$.subscribe(deviceType => {
      if (deviceType === 'tablet' && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (deviceType !== 'tablet' && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

@Directive({
  selector: '[appShowOnDesktop]',
  standalone: true
})
export class ShowOnDesktopDirective implements OnInit, OnDestroy {
  private subscription: Subscription | null = null;
  private hasView = false;
  private isBrowser: boolean;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private deviceService: DeviceService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      // For SSR, default to showing desktop view
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
      return;
    }
    
    this.subscription = this.deviceService.deviceType$.subscribe(deviceType => {
      if (deviceType === 'desktop' && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (deviceType !== 'desktop' && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
} 