import { Component, ElementRef, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TaskChatService, ChatMessage } from '../../services/task-chat.service';
import { ThemeToggleComponent } from '../shared/theme-toggle.component';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-chat-interface',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ThemeToggleComponent
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0, scale: 0.95 }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(0)', opacity: 1, scale: 1 }))
      ])
    ]),
    trigger('staggerCards', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ],
  template: `
    <div class="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      
      <!-- Main Chat Panel -->
      <div class="flex flex-col flex-1 h-full overflow-hidden">
        <!-- Enhanced Header -->
        <header class="h-12 border-b border-white/20 bg-transparent dark:bg-transparent flex items-center justify-between px-4 lg:px-6 shadow-sm relative">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-400/5 dark:to-purple-400/5"></div>
          
          <!-- Left side: Mobile menu and title -->
          <div class="flex items-center space-x-4 relative z-10">
            <button onclick="window.location.href='/app'" 
                    class="group text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 flex items-center transition-all duration-200 hover:scale-105">
              <i class="bi bi-arrow-left text-xl mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200"></i>
              <span class="text-sm font-medium">Back</span>
            </button>
            <div>
              <h1 class="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">AI Assistant</h1>
              <p class="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Chat with your intelligent task assistant</p>
            </div>
          </div>
          
          <!-- Right side: Actions -->
          <div class="flex items-center space-x-2 relative z-10">
            <app-theme-toggle></app-theme-toggle>
          </div>
        </header>
        
        <!-- Chat Messages Area -->
        <div class="flex-1 overflow-y-auto py-3 px-4 md:px-6 custom-scrollbar" #scrollContainer>
          <ng-container *ngIf="chat.messages$ | async as messages">
            <!-- Enhanced Welcome message -->
            <div *ngIf="messages.length === 0" class="flex flex-col items-center justify-center h-full text-center px-4" [@fadeIn]>
              <div class="relative mb-4">
                <div class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl relative overflow-hidden">
                  <div class="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 animate-pulse"></div>
                  <i class="bi bi-chat-dots text-white text-2xl relative z-10"></i>
                </div>
                <div class="absolute -inset-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full blur-xl opacity-50 animate-pulse"></div>
              </div>
              
              <h3 class="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-2">
                Welcome to AI Assistant
              </h3>
              <p class="text-gray-600 dark:text-gray-300 mb-5 max-w-md leading-relaxed text-sm">
                I'm here to help you manage tasks, answer questions, and boost your productivity. What would you like to explore today?
              </p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl" [@staggerCards]>
                <button class="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-3 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 text-left"
                  (click)="suggestedPrompt('Create a task for tomorrow')">
                  <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div class="relative z-10">
                    <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                      <i class="bi bi-plus-circle text-white"></i>
                    </div>
                    <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-1 text-sm">Create a new task</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Add tasks to your list</p>
                  </div>
                </button>
                
                <button class="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-3 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 text-left"
                  (click)="suggestedPrompt('Show me my upcoming tasks')">
                  <div class="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div class="relative z-10">
                    <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                      <i class="bi bi-calendar-check text-white"></i>
                    </div>
                    <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-1 text-sm">View upcoming tasks</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400">See what's coming up</p>
                  </div>
                </button>
                
                <button class="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-3 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 text-left"
                  (click)="suggestedPrompt('Help me organize my tasks by priority')">
                  <div class="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div class="relative z-10">
                    <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                      <i class="bi bi-sort-alpha-down text-white"></i>
                    </div>
                    <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-1 text-sm">Organize my tasks</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Sort by priority and status</p>
                  </div>
                </button>
                
                <button class="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-3 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 text-left"
                  (click)="suggestedPrompt('Set a reminder for my important tasks')">
                  <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div class="relative z-10">
                    <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                      <i class="bi bi-bell text-white"></i>
                    </div>
                    <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-1 text-sm">Set task reminders</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Never miss important deadlines</p>
                  </div>
                </button>
              </div>
            </div>
            
            <!-- Enhanced Message bubbles -->
            <div *ngIf="messages.length > 0" class="flex flex-col space-y-4 max-w-4xl mx-auto">
              <div *ngFor="let message of messages; trackBy: trackByFn" class="flex group" [@slideIn]
                [ngClass]="message.role === 'user' ? 'justify-end' : 'justify-start'">
                <!-- Enhanced Avatar for AI -->
                <div *ngIf="message.role === 'assistant'" class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mr-3 flex-shrink-0 self-start mt-1 shadow-lg ring-1 ring-blue-500/20">
                  <i class="bi bi-robot text-xs"></i>
                </div>
                
                <!-- Enhanced Message content -->
                <div class="max-w-[85%] sm:max-w-[75%]">
                  <div class="px-4 py-3 rounded-2xl shadow-sm transform transition-all duration-200 group-hover:shadow-md relative" 
                       [ngClass]="message.role === 'user' ? 
                                 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md shadow-lg' : 
                                 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-800 dark:text-gray-100 rounded-bl-md'">
                    
                    <!-- Message status indicator for user messages -->
                    <div *ngIf="message.role === 'user'" class="absolute -bottom-1 -right-1 w-2 h-2 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                    
                    <!-- Enhanced message content with better typography -->
                    <div class="whitespace-pre-wrap break-words leading-relaxed text-sm">{{ message.text }}</div>
                  </div>
                  
                  <!-- Enhanced Timestamp -->
                  <div class="text-xs mt-1 text-gray-500 dark:text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                       [ngClass]="message.role === 'user' ? 'text-right mr-2' : 'ml-2'">
                    Just now
                  </div>
                </div>
                
                <!-- Enhanced Avatar for User -->
                <div *ngIf="message.role === 'user'" class="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-white ml-3 flex-shrink-0 self-start mt-1 shadow-lg ring-1 ring-gray-400/20">
                  <i class="bi bi-person text-xs"></i>
                </div>
              </div>
            </div>
          </ng-container>
        </div>
        
        <!-- Enhanced Input Area -->
        <div class="border-t border-white/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-3 md:p-4 relative">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-400/5 dark:to-purple-400/5"></div>
          
          <div class="max-w-4xl mx-auto relative z-10">
            <form (ngSubmit)="sendMessage(messageText)" class="relative">
              <div class="flex items-end space-x-2">
                <!-- Enhanced text input -->
                <div class="relative flex-grow group">
                  <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-200"></div>
                  <textarea
                    #messageInput
                    [(ngModel)]="messageText"
                    name="messageText"
                    placeholder="Type your message..."
                    class="relative form-input w-full py-3 pl-4 pr-10 resize-none rounded-2xl border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 shadow-sm transition-all duration-200 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                    [rows]="textareaRows"
                    (input)="adjustTextareaHeight()"
                    (keydown)="handleKeyDown($event)"
                  ></textarea>
                  
                  <!-- Enhanced emoji button -->
                  <button 
                    type="button" 
                    class="absolute right-3 bottom-3 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-200 hover:scale-110"
                  >
                    <i class="bi bi-emoji-smile text-base"></i>
                  </button>
                </div>
                
                <!-- Enhanced send button -->
                <button 
                  type="submit" 
                  [disabled]="!messageText.trim() || isLoading"
                  class="relative overflow-hidden px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex-shrink-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 hover:shadow-lg shadow-md group"
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <i class="bi bi-send text-base relative z-10" [class.animate-pulse]="isLoading"></i>
                </button>
              </div>
            </form>
            
            <!-- Typing indicator area -->
            <div class="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center opacity-75">
              Press <kbd class="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Enter</kbd> to send, 
              <kbd class="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Shift + Enter</kbd> for new line
            </div>
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
    
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
    }
    
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(to bottom, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3));
      border-radius: 3px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(to bottom, rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.5));
    }
    
    .dark .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(to bottom, rgba(96, 165, 250, 0.3), rgba(196, 181, 253, 0.3));
    }
    
    .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(to bottom, rgba(96, 165, 250, 0.5), rgba(196, 181, 253, 0.5));
    }
    
    kbd {
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(2deg); }
    }
    
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
  `]
})
export class ChatInterfaceComponent implements OnInit, OnDestroy {
  private subscription?: Subscription;
  @ViewChild('scrollContainer') private scrollContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLTextAreaElement>;
  
  messageText = '';
  textareaRows = 1;
  isLoading = false;

  constructor(public chat: TaskChatService) {}

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Ctrl+Enter or Command+Enter also sends the message
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      this.sendMessage(this.messageText);
    }
  }

  ngOnInit(): void {
    this.subscription = this.chat.messages$.subscribe(() => {
      setTimeout(() => this.scrollToBottom(), 100);
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  sendMessage(text: string): void {
    const message = text.trim();
    if (message && !this.isLoading) {
      this.isLoading = true;
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

  trackByFn(index: number, _item: ChatMessage): number {
    return index;
  }
  
  adjustTextareaHeight(): void {
    const textarea = this.messageInput.nativeElement;
    const lines = this.messageText.split('\n').length;
    
    // Calculate rows based on line breaks and text length
    const approximateRows = Math.min(6, Math.max(1, lines));
    this.textareaRows = approximateRows;
  }

  handleKeyDown(event: KeyboardEvent): void {
    // Send message on Enter without shift key
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage(this.messageText);
    }
  }

  private scrollToBottom(): void {
    const element = this.scrollContainer?.nativeElement;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }
}