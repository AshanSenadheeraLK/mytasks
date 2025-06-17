import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Conversation } from '../../services/chat-firestore.service';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <aside 
      *ngIf="isOpen" 
      class="flex flex-col h-full border-r border-gray-200 dark:border-gray-700 
             bg-card dark:bg-card-dark overflow-hidden transition-all duration-300"
    >
      <!-- Sidebar header -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 class="font-semibold text-gray-800 dark:text-gray-200">Conversations</h2>
        <button 
          (click)="onNewConversation()" 
          class="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 
                 text-gray-600 dark:text-gray-300"
          title="New Conversation"
        >
          <i class="bi bi-plus-lg"></i>
        </button>
      </div>
      
      <!-- Conversations list -->
      <div class="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700 custom-scrollbar">
        <ng-container *ngIf="conversations.length > 0">
          <div 
            *ngFor="let convo of conversations"
            class="group px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            [ngClass]="{'bg-gray-100 dark:bg-gray-800': currentConversation?.id === convo.id}"
          >
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 dark:bg-primary-light/10 text-primary dark:text-primary-light flex-shrink-0">
                <i class="bi bi-chat-dots"></i>
              </div>
              <div class="flex-1 min-w-0" (click)="onSelectConversation(convo.id)">
                <div class="flex items-center justify-between">
                  <ng-container *ngIf="editingConversation !== convo.id; else editTitle">
                    <h3 class="text-sm font-medium truncate text-gray-800 dark:text-gray-200">
                      {{ convo.title }}
                    </h3>
                  </ng-container>
                  <ng-template #editTitle>
                    <input
                      #titleInput
                      type="text"
                      [(ngModel)]="editTitle"
                      (keyup.enter)="saveTitle(convo.id)"
                      (blur)="saveTitle(convo.id)"
                      class="w-full text-sm bg-transparent border-b border-primary dark:border-primary-light 
                             text-gray-800 dark:text-gray-200 focus:outline-none"
                      (click)="$event.stopPropagation()"
                    >
                  </ng-template>
                  <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    {{ formatTime(convo.updatedAt) }}
                  </span>
                </div>
                <p *ngIf="convo.lastMessage" class="text-xs truncate text-gray-500 dark:text-gray-400 mt-1">
                  {{ convo.lastMessage }}
                </p>
              </div>
              <!-- Action buttons -->
              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  (click)="startEdit(convo)"
                  class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                  title="Rename conversation"
                >
                  <i class="bi bi-pencil text-sm"></i>
                </button>
                <button 
                  (click)="onDeleteConversation(convo.id)"
                  class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                  title="Delete conversation"
                >
                  <i class="bi bi-trash text-sm"></i>
                </button>
              </div>
            </div>
          </div>
        </ng-container>
        
        <!-- Empty state -->
        <div *ngIf="conversations.length === 0" class="flex flex-col items-center justify-center p-6 text-center h-full">
          <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
            <i class="bi bi-chat text-gray-500 dark:text-gray-400 text-xl"></i>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">No conversations yet</p>
          <button 
            (click)="onNewConversation()" 
            class="px-3 py-1.5 text-sm bg-primary dark:bg-primary-light text-white dark:text-gray-900 rounded-lg hover:bg-primary-dark"
          >
            Start chatting
          </button>
        </div>
      </div>
      
      <!-- Info footer -->
      <div class="p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 text-center">
        Messages are automatically deleted after 12 hours
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class ChatSidebarComponent {
  @Input() isOpen = false;
  @Input() conversations: Conversation[] = [];
  @Input() currentConversation: Conversation | null = null;
  
  @Output() conversationSelected = new EventEmitter<string>();
  @Output() newConversation = new EventEmitter<void>();
  @Output() deleteConversation = new EventEmitter<string>();
  @Output() renameConversation = new EventEmitter<{id: string, title: string}>();
  
  editingConversation: string | null = null;
  editTitle: string = '';
  
  onSelectConversation(id: string): void {
    this.conversationSelected.emit(id);
  }
  
  onNewConversation(): void {
    this.newConversation.emit();
  }
  
  onDeleteConversation(id: string): void {
    if (confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      this.deleteConversation.emit(id);
    }
  }
  
  startEdit(conversation: Conversation): void {
    this.editingConversation = conversation.id;
    this.editTitle = conversation.title;
    setTimeout(() => {
      const input = document.querySelector('input') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    });
  }
  
  saveTitle(id: string): void {
    if (this.editingConversation && this.editTitle.trim()) {
      this.renameConversation.emit({id, title: this.editTitle.trim()});
      this.editingConversation = null;
      this.editTitle = '';
    }
  }
  
  formatTime(timestamp: any): string {
    if (!timestamp) return '';
    
    try {
      // Handle Firestore timestamp
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      
      const now = new Date();
      const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      // Today
      if (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      ) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      // Yesterday
      if (diffInDays === 1) {
        return 'Yesterday';
      }
      
      // Within a week
      if (diffInDays < 7) {
        return date.toLocaleDateString([], { weekday: 'short' });
      }
      
      // Older than a week
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (e) {
      return '';
    }
  }
}
