import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="hidden lg:flex flex-col w-64 border-r border-gray-200 dark:border-gray-700 h-full bg-white dark:bg-gray-800">
      <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 font-semibold">
        Conversations
      </div>
      <div class="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
        <div class="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" *ngFor="let i of [1,2,3,4]">
          Conversation {{i}}
        </div>
      </div>
    </aside>
  `,
  styles: []
})
export class ChatSidebarComponent {}
