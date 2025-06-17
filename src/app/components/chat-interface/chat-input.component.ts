import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="handleSubmit()" class="p-3 border-t border-gray-200 dark:border-gray-700 bg-card dark:bg-card-dark">
      <div class="flex items-end gap-2">
        <div class="relative flex-1">
          <textarea
            #messageInput
            [(ngModel)]="messageText"
            name="messageText"
            placeholder="Type a message..."
            class="w-full rounded-lg px-4 py-3 pr-10 border border-gray-200 dark:border-gray-700
                   bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 
                   focus:ring-primary dark:focus:ring-primary-light focus:border-primary 
                   placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
            rows="1"
            [maxlength]="maxLength"
            (input)="adjustTextareaHeight($event)"
            (keydown)="onKey($event)"
            [disabled]="isLoading"
          ></textarea>
          
          <!-- Character count -->
          <div 
            *ngIf="messageText.length > 0" 
            class="absolute bottom-2 right-3 text-xs" 
            [ngClass]="messageText.length > maxLength * 0.8 ? 'text-yellow-500' : 'text-gray-400 dark:text-gray-500'"
          >
            {{ messageText.length }}/{{ maxLength }}
          </div>
        </div>

        <button 
          type="submit" 
          [disabled]="!messageText.trim() || isLoading" 
          class="px-4 py-3 rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors focus:ring-2 
                 focus:ring-primary/50 dark:focus:ring-primary-light/50 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <i class="bi" [ngClass]="isLoading ? 'bi-hourglass-split' : 'bi-send'"></i>
        </button>
      </div>

      <!-- Help text -->
      <div class="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
        <span>Press <kbd class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">Shift+Enter</kbd> for new line | <kbd class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">Ctrl+Enter</kbd> to send</span>
      </div>
    </form>
  `,
  styles: []
})
export class ChatInputComponent {
  @Output() sendMessage = new EventEmitter<string>();
  @Input() isLoading = false;
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLTextAreaElement>;

  messageText = '';
  maxLength = 2000;

  handleSubmit(): void {
    const msg = this.messageText.trim();
    if (msg && !this.isLoading) {
      this.sendMessage.emit(msg);
      this.messageText = '';
      setTimeout(() => this.resetTextareaHeight(), 0);
    }
  }

  onKey(event: KeyboardEvent): void {
    // Send on Enter (not Shift+Enter)
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.handleSubmit();
    }
  }

  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    
    // Limit to 5 rows maximum
    const maxHeight = 120; // approximately 5 rows
    const scrollHeight = textarea.scrollHeight;
    
    textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
    
    // Show scrollbar if content exceeds max height
    textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
  }

  resetTextareaHeight(): void {
    const textarea = this.messageInput.nativeElement;
    textarea.style.height = 'auto';
    this.messageInput.nativeElement.focus();
  }
}
