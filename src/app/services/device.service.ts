import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private deviceTypeSubject = new BehaviorSubject<DeviceType>('desktop');
  public deviceType$: Observable<DeviceType> = this.deviceTypeSubject.asObservable();
  private isBrowser: boolean;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.detectDeviceType();
      window.addEventListener('resize', () => this.detectDeviceType());
    }
  }

  private detectDeviceType(): void {
    if (!this.isBrowser) return;
    
    const width = window.innerWidth;
    
    let deviceType: DeviceType;
    if (width < 768) {
      deviceType = 'mobile';
    } else if (width < 1024) {
      deviceType = 'tablet';
    } else {
      deviceType = 'desktop';
    }
    
    if (deviceType !== this.deviceTypeSubject.value) {
      this.deviceTypeSubject.next(deviceType);
    }
  }

  public getCurrentDeviceType(): DeviceType {
    return this.deviceTypeSubject.value;
  }

  public isMobile(): boolean {
    return this.deviceTypeSubject.value === 'mobile';
  }

  public isTablet(): boolean {
    return this.deviceTypeSubject.value === 'tablet';
  }

  public isDesktop(): boolean {
    return this.deviceTypeSubject.value === 'desktop';
  }
} 