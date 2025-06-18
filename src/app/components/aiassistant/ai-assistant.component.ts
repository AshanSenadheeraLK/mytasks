import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiChatService, ChatMessage } from '../../services/ai-chat.service';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex flex-col p-4">
      <div class="flex-1 overflow-auto mb-4 space-y-2">
        <div *ngFor="let msg of messages">
          <div [class.text-right]="msg.role === 'user'">
            <span [ngClass]="msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'" class="rounded p-2 inline-block max-w-full break-words">
              {{ msg.content }}
            </span>
          </div>
        </div>
      </div>
      <form (ngSubmit)="send()" class="flex space-x-2">
        <input name="input" [(ngModel)]="input" required placeholder="Ask the assistant..." class="flex-1 border rounded px-2 py-1 dark:bg-gray-700 dark:text-white" />
        <button type="submit" class="px-4 py-1 rounded bg-primary text-white">Send</button>
      </form>
    </div>
  `
})
export class AiAssistantComponent {
  messages: ChatMessage[] = [];
  input = '';

  constructor(private chat: AiChatService) {}

  send() {
    const content = this.input.trim();
    if (!content) return;
    this.messages.push({ role: 'user', content });
    this.input = '';
    this.chat.send(this.messages).subscribe(res => {
      const reply = res?.choices?.[0]?.message?.content || '';
      if (reply) {
        this.messages.push({ role: 'assistant', content: reply });
      }
    });
  }
}
