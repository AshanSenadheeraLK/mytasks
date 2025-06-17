import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../services/chat-firestore.service';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-4 animate-fade-in" [class.animate-slide-in-right]="message.role === 'user'">
      <div class="flex" [ngClass]="message.role === 'user' ? 'justify-end' : 'justify-start'">
        <!-- Avatar for assistant -->
        <div *ngIf="message.role === 'assistant'" class="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary-light/10 flex items-center justify-center mr-2 flex-shrink-0">
          <i class="bi bi-robot text-primary dark:text-primary-light"></i>
        </div>
        
        <!-- Message bubble -->
        <div class="max-w-[85%] px-4 py-3 rounded-2xl shadow-sm" 
             [ngClass]="message.role === 'user' 
               ? 'bg-primary text-white dark:bg-primary-light dark:text-gray-900 rounded-br-none' 
               : 'bg-card dark:bg-card-dark text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-700'">
          <div class="whitespace-pre-wrap break-words">{{ message.text }}</div>
        </div>
        
        <!-- Avatar for user -->
        <div *ngIf="message.role === 'user'" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center ml-2 flex-shrink-0">
          <i class="bi bi-person text-gray-600 dark:text-gray-300"></i>
        </div>
      </div>
      
      <!-- Timestamp -->
      <div class="mt-1 text-xs text-gray-500 dark:text-gray-400" 
           [ngClass]="message.role === 'user' ? 'text-right' : 'text-left'">
        {{ formatTimestamp(message.createdAt) }}
      </div>
    </div>
  `,
  styles: []
})
export class MessageBubbleComponent {
  @Input() message!: ChatMessage;
  
  formatTimestamp(timestamp: any): string {
    if (!timestamp) return '';
    
    try {
      // Handle Firestore timestamp
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      
      // Only show time if message is from today
      const now = new Date();
      if (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      ) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      // Show date and time for older messages
      return date.toLocaleString([], { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      return '';
    }
  }
}
