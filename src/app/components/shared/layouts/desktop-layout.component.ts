import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-desktop-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- This is the original desktop layout, keeping it as is for existing desktop UI -->
    <ng-content></ng-content>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class DesktopLayoutComponent {} 