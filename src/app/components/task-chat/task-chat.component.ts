import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskChatService } from '../../services/task-chat.service';

@Component({
  selector: 'app-task-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-xl mx-auto p-4 space-y-4">
      <div class="h-96 overflow-y-auto border rounded p-3 bg-white dark:bg-gray-800" #scroll>
        <div *ngFor="let msg of chat.messages$ | async">
          <div [class.text-right]="msg.role === 'user'">
            <span class="inline-block px-3 py-2 my-1 rounded-lg"
                  [ngClass]="msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'">
              {{ msg.text }}
            </span>
          </div>
        </div>
      </div>
      <form class="flex gap-2" (ngSubmit)="send()">
        <input name="message" [(ngModel)]="input" required
               class="flex-1 p-2 border rounded" placeholder="Type a message...">
        <button type="submit" class="btn btn-primary px-4">Send</button>
      </form>
    </div>
  `,
  styles: []
})
export class TaskChatComponent {
  input = '';
  constructor(public chat: TaskChatService) {}

  async send() {
    const text = this.input.trim();
    if (!text) return;
    this.input = '';
    await this.chat.sendMessage(text);
  }
}
