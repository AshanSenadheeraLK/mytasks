import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DeviceService } from '../../services/device.service';
import { Subscription } from 'rxjs';
import { MobileTodoListComponent } from './mobile-todo-list.component';
import { TabletTodoListComponent } from './tablet-todo-list.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-responsive-todo-list',
  standalone: true,
  imports: [CommonModule, MobileTodoListComponent, TabletTodoListComponent, RouterModule],
  template: `
    <ng-container [ngSwitch]="currentDevice">
      <app-mobile-todo-list *ngSwitchCase="'mobile'"></app-mobile-todo-list>
      <app-tablet-todo-list *ngSwitchCase="'tablet'"></app-tablet-todo-list>
      <!-- Default to original desktop component when device is desktop -->
      <router-outlet *ngSwitchCase="'desktop'"></router-outlet>
      <router-outlet *ngSwitchDefault></router-outlet>
    </ng-container>
  `
})
export class ResponsiveTodoListComponent implements OnInit, OnDestroy {
  currentDevice: string = 'desktop';
  private deviceSubscription: Subscription | null = null;
  private isBrowser: boolean;

  constructor(
    private deviceService: DeviceService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      return; // No need to subscribe on server
    }
    
    this.deviceSubscription = this.deviceService.deviceType$.subscribe(deviceType => {
      this.currentDevice = deviceType;
    });
  }

  ngOnDestroy(): void {
    if (this.deviceSubscription) {
      this.deviceSubscription.unsubscribe();
    }
  }
} 