import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../shared/theme-toggle.component';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent],
  template: `
    <header class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
      <div class="font-semibold">Chat</div>
      <app-theme-toggle></app-theme-toggle>
    </header>
  `,
  styles: []
})
export class ChatHeaderComponent {}
