import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TaskChatService, ChatMessage } from '../../services/task-chat.service';
import { ThemeToggleComponent } from '../shared/theme-toggle.component';

@Component({
  selector: 'app-chat-interface',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ThemeToggleComponent
  ],
  template: `
    <div class="flex h-screen bg-background dark:bg-background-dark">
      
      
      <!-- Main Chat Panel -->
      <div class="flex flex-col flex-1 h-full overflow-hidden">
        <!-- Header -->
        <header class="h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between px-4 lg:px-6 shadow-sm">
          <!-- Left side: Mobile menu and title -->
          <div class="flex items-center space-x-4">
            <button onclick="window.location.href='/app'" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center">
              <i class="bi bi-arrow-left text-xl mr-2"></i>
              <span class="text-sm">Back</span>
            </button>
            <div>
              <h1 class="text-lg font-medium">AI Assistant</h1>
              <p class="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Chat with your task assistant</p>
            </div>
          </div>
          
          <!-- Right side: Actions -->
          <div class="flex items-center space-x-2">
            <app-theme-toggle></app-theme-toggle>
          </div>
        </header>
        
        <!-- Chat Messages Area -->
        <div class="flex-1 overflow-y-auto py-4 px-4 md:px-6 custom-scrollbar" #scrollContainer>
          <ng-container *ngIf="chat.messages$ | async as messages">
            <!-- Welcome message when no messages -->
            <div *ngIf="messages.length === 0" class="flex flex-col items-center justify-center h-full text-center px-4">
              <div class="w-16 h-16 mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                <i class="bi bi-chat-dots text-accent text-2xl"></i>
              </div>
              <h3 class="text-xl font-medium mb-2">Welcome to AI Assistant</h3>
              <p class="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
                I can help you manage your tasks and answer questions. What would you like to do today?
              </p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                <button class="btn btn-ghost border border-gray-200 dark:border-gray-700 justify-start px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                  (click)="suggestedPrompt('Create a task for tomorrow')">
                  <i class="bi bi-plus-circle mr-3 text-accent"></i>
                  Create a new task
                </button>
                <button class="btn btn-ghost border border-gray-200 dark:border-gray-700 justify-start px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                  (click)="suggestedPrompt('Show me my upcoming tasks')">
                  <i class="bi bi-calendar-check mr-3 text-accent"></i>
                  View upcoming tasks
                </button>
                <button class="btn btn-ghost border border-gray-200 dark:border-gray-700 justify-start px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                  (click)="suggestedPrompt('Help me organize my tasks by priority')">
                  <i class="bi bi-sort-alpha-down mr-3 text-accent"></i>
                  Organize my tasks
                </button>
                <button class="btn btn-ghost border border-gray-200 dark:border-gray-700 justify-start px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                  (click)="suggestedPrompt('Set a reminder for my important tasks')">
                  <i class="bi bi-bell mr-3 text-accent"></i>
                  Set task reminders
                </button>
              </div>
            </div>
            
            <!-- Message bubbles -->
            <div *ngIf="messages.length > 0" class="flex flex-col space-y-6 max-w-3xl mx-auto">
              <div *ngFor="let message of messages; trackBy: trackByFn" class="flex animate-fade-in"
                [ngClass]="message.role === 'user' ? 'justify-end' : 'justify-start'">
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
                    <div>{{ message.text }}</div>
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
            </div>
          </ng-container>
        </div>
        
        <!-- Input Area -->
        <div class="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 md:p-4">
          <div class="max-w-3xl mx-auto">
            <form (ngSubmit)="sendMessage(messageText)" class="relative">
              <div class="flex items-end space-x-2">
                <!-- Main text input -->
                <div class="relative flex-grow">
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
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
    }
  `]
})
export class ChatInterfaceComponent implements OnInit, OnDestroy {
  private subscription?: Subscription;
  @ViewChild('scrollContainer') private scrollContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLTextAreaElement>;
  
  messageText = '';
  textareaRows = 1;

  constructor(public chat: TaskChatService) {}

  ngOnInit(): void {
    this.subscription = this.chat.messages$.subscribe(() => {
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  sendMessage(text: string): void {
    const message = text.trim();
    if (message) {
      this.chat.sendMessage(message);
      this.messageText = '';
      this.textareaRows = 1;
      
      // Focus the input after sending
      setTimeout(() => {
        this.messageInput?.nativeElement.focus();
      }, 0);
    }
  }

  suggestedPrompt(prompt: string): void {
    this.sendMessage(prompt);
  }

  trackByFn(_index: number, item: ChatMessage): string {
    // Using the combination of role and text as a unique identifier
    return `${item.role}-${item.text}`;
  }
  
  adjustTextareaHeight(): void {
    const textarea = this.messageInput.nativeElement;
    const lines = this.messageText.split('\n').length;
    
    // Calculate rows based on line breaks and text length
    const approximateRows = Math.min(6, Math.max(1, lines));
    this.textareaRows = approximateRows;
  }

  private scrollToBottom(): void {
    const element = this.scrollContainer?.nativeElement;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }
} 