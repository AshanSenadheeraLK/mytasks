import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="handleSubmit()" class="p-3 flex gap-2 border-t border-gray-200 dark:border-gray-700">
      <input
        #messageInput
        [(ngModel)]="messageText"
        name="messageText"
        placeholder="Type a message..."
        class="flex-1 border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
        (keydown)="onKey($event)"
      />
      <button type="submit" [disabled]="!messageText.trim()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded">
        Send
      </button>
    </form>
  `,
  styles: []
})
export class ChatInputComponent {
  @Output() sendMessage = new EventEmitter<string>();
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;

  messageText = '';

  handleSubmit(): void {
    const msg = this.messageText.trim();
    if (msg) {
      this.sendMessage.emit(msg);
      this.messageText = '';
      setTimeout(() => this.messageInput.nativeElement.focus(), 0);
    }
  }

  onKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.handleSubmit();
    }
  }
}
