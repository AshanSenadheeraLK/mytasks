import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../services/task-chat.service';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex" [ngClass]="message.role === 'user' ? 'justify-end' : 'justify-start'">
      <!-- Avatar for AI -->
      <div *ngIf="message.role === 'assistant'" class="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white mr-3 flex-shrink-0 self-start mt-1">
        <i class="bi bi-robot"></i>
      </div>
      
      <!-- Message content -->
      <div class="max-w-[80%]">
        <div class="px-4 py-3 rounded-2xl shadow-sm" 
             [ngClass]="message.role === 'user' ? 
                       'bg-accent text-white rounded-br-none' : 
                       'bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-bl-none'">
          <!-- Format the message with proper styling -->
          <div [innerHTML]="formatMessage(message.text)"></div>
        </div>
        
        <!-- Timestamp -->
        <div class="text-xs mt-1 text-gray-500 dark:text-gray-400" [ngClass]="message.role === 'user' ? 'text-right mr-2' : 'ml-2'">
          Just now
        </div>
      </div>
      
      <!-- Avatar for User -->
      <div *ngIf="message.role === 'user'" class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200 ml-3 flex-shrink-0 self-start mt-1">
        <i class="bi bi-person"></i>
      </div>
    </div>
  `
})
export class MessageBubbleComponent {
  @Input() message!: ChatMessage;
  
  formatMessage(text: string): string {
    // Escape HTML to prevent XSS
    let escapedText = this.escapeHtml(text);
    
    // Replace URLs with clickable links
    escapedText = escapedText.replace(
      /(https?:\/\/[^\s]+)/g, 
      '<a href="$1" target="_blank" class="text-blue-400 hover:underline">$1</a>'
    );
    
    // Replace code blocks (simple version)
    escapedText = escapedText.replace(
      /`([^`]+)`/g, 
      '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>'
    );
    
    // Convert line breaks to <br>
    return escapedText.replace(/\n/g, '<br>');
  }
  
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
} 