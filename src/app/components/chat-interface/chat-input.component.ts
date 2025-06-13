import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 md:p-4">
      <div class="max-w-3xl mx-auto">
        <form (ngSubmit)="handleSubmit()" class="relative">
          <div class="flex items-end space-x-2">
            <!-- Main text input -->
            <div class="relative flex-grow">
              <!-- Format buttons -->
              <div class="absolute bottom-full left-0 mb-2 flex space-x-1 text-gray-500 dark:text-gray-400">
                <button type="button" class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                  <i class="bi bi-type-bold"></i>
                </button>
                <button type="button" class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                  <i class="bi bi-type-italic"></i>
                </button>
                <button type="button" class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                  <i class="bi bi-code-slash"></i>
                </button>
                <button type="button" class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                  <i class="bi bi-link-45deg"></i>
                </button>
              </div>
              
              <textarea
                #messageInput
                [(ngModel)]="messageText"
                name="messageText"
                placeholder="Type your message..."
                class="form-input w-full py-3 pl-4 pr-10 resize-none rounded-xl border-gray-300 dark:border-gray-600 focus:border-accent dark:focus:border-accent-light focus:ring-accent dark:focus:ring-accent-light"
                [rows]="textareaRows"
                (input)="adjustTextareaHeight()"
              ></textarea>
              
              <!-- Emoji button -->
              <button 
                type="button" 
                class="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <i class="bi bi-emoji-smile"></i>
              </button>
            </div>
            
            <!-- Send button -->
            <button 
              type="submit" 
              [disabled]="!messageText.trim()"
              class="btn px-4 py-3 rounded-xl bg-accent hover:bg-accent-dark text-white flex-shrink-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="bi bi-send"></i>
            </button>
          </div>
          
          <!-- Attachment and assistance buttons -->
          <div class="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-400 px-1">
            <div class="flex space-x-3">
              <button type="button" class="flex items-center hover:text-accent">
                <i class="bi bi-paperclip mr-1"></i>
                <span>Attach</span>
              </button>
              <button type="button" class="flex items-center hover:text-accent">
                <i class="bi bi-mic mr-1"></i>
                <span>Voice</span>
              </button>
            </div>
            <button type="button" class="flex items-center hover:text-accent">
              <i class="bi bi-lightbulb mr-1"></i>
              <span>Suggestions</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ChatInputComponent {
  @Output() sendMessage = new EventEmitter<string>();
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLTextAreaElement>;
  
  messageText = '';
  textareaRows = 1;
  
  handleSubmit(): void {
    const message = this.messageText.trim();
    if (message) {
      this.sendMessage.emit(message);
      this.messageText = '';
      this.textareaRows = 1;
      
      // Focus the input after sending
      setTimeout(() => {
        this.messageInput.nativeElement.focus();
      }, 0);
    }
  }
  
  adjustTextareaHeight(): void {
    const textarea = this.messageInput.nativeElement;
    const lines = this.messageText.split('\n').length;
    
    // Calculate rows based on line breaks and text length
    const approximateRows = Math.min(6, Math.max(1, lines));
    this.textareaRows = approximateRows;
  }
} 