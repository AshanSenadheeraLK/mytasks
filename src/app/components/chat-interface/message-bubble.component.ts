import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../services/task-chat.service';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="message.role === 'user' ? 'flex justify-end' : 'flex'">
      <div class="max-w-md px-3 py-2 rounded-lg" [ngClass]="message.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'">
        {{ message.text }}
      </div>
    </div>
  `,
  styles: []
})
export class MessageBubbleComponent {
  @Input() message!: ChatMessage;
}
