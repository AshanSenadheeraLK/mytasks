import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-desktop-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-background dark:bg-background-dark transition-colors duration-300">
      <main class="container mx-auto p-6 animate-fade-in">
        <ng-content></ng-content>
      </main>
    </div>
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