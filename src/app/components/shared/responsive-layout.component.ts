import { Component, OnInit, OnDestroy, Input, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceService, DeviceType } from '../../services/device.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-responsive-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="responsive-layout">
      <!-- Mobile Layout -->
      <div *ngIf="currentDevice === 'mobile' && mobileTemplate" class="mobile-layout">
        <ng-container [ngTemplateOutlet]="mobileTemplate"></ng-container>
      </div>
      
      <!-- Tablet Layout -->
      <div *ngIf="currentDevice === 'tablet' && tabletTemplate" class="tablet-layout">
        <ng-container [ngTemplateOutlet]="tabletTemplate"></ng-container>
      </div>
      
      <!-- Desktop Layout (default) -->
      <div *ngIf="(currentDevice === 'desktop' || !mobileTemplate || !tabletTemplate) && desktopTemplate" class="desktop-layout">
        <ng-container [ngTemplateOutlet]="desktopTemplate"></ng-container>
      </div>
    </div>
  `,
  styles: [`
    .responsive-layout {
      width: 100%;
      height: 100%;
    }
    
    .mobile-layout {
      max-width: 100%;
    }
    
    .tablet-layout {
      max-width: 100%;
    }
    
    .desktop-layout {
      max-width: 100%;
    }
  `]
})
export class ResponsiveLayoutComponent implements OnInit, OnDestroy {
  @Input() mobileTemplate!: TemplateRef<any>;
  @Input() tabletTemplate!: TemplateRef<any>;
  @Input() desktopTemplate!: TemplateRef<any>;
  
  currentDevice: DeviceType = 'desktop';
  private subscription: Subscription = new Subscription();
  
  constructor(private deviceService: DeviceService) {}
  
  ngOnInit(): void {
    this.subscription.add(
      this.deviceService.deviceType$.subscribe(deviceType => {
        this.currentDevice = deviceType;
      })
    );
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
} 