import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiChatService, ChatMessage } from '../../services/ai-chat.service';
import { NetworkService } from '../../services/network.service';
import { TodoService, Todo, SubTask } from '../../services/todo.service';
import { AuthService } from '../../services/auth.service';
import { Subject, Subscription, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, takeUntil, take, map, catchError } from 'rxjs/operators';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  schemas: [NO_ERRORS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <!-- Header with improved hierarchy -->
      <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <!-- Back button -->
            <button (click)="goBack()" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 class="text-lg font-semibold text-gray-900 dark:text-white">AI Assistant</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">Manage your tasks with AI</p>
            </div>
          </div>
          
          <!-- Connection status indicator -->
          <div class="flex items-center space-x-2">
            <div *ngIf="isOnline$ | async; else offlineStatus" 
                 class="flex items-center space-x-1 text-green-600 dark:text-green-400">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-xs font-medium">Online</span>
            </div>
            <ng-template #offlineStatus>
              <div class="flex items-center space-x-1 text-amber-600 dark:text-amber-400">
                <div class="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span class="text-xs font-medium">Offline</span>
              </div>
            </ng-template>
          </div>
        </div>
        
        <!-- Offline banner with improved messaging -->
        <div *ngIf="!(isOnline$ | async)" 
             class="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div class="flex items-start space-x-2">
            <svg class="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p class="text-sm font-medium text-amber-700 dark:text-amber-300">Connection lost</p>
              <p class="text-sm text-amber-600 dark:text-amber-400">Your messages will be sent when you reconnect.</p>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Chat area with improved scrolling -->
      <main class="flex-1 overflow-hidden flex flex-col">
        <div class="flex-1 overflow-auto px-4 py-6 sm:px-6" #chatContainer>
          <!-- Empty state with better onboarding -->
          <div *ngIf="!hasInitialMessage" class="flex flex-col items-center justify-center min-h-full py-12">
            <div class="text-center max-w-md mx-auto">
              <div class="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Welcome to your AI Assistant
              </h2>
              <p class="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                I can help you organize, prioritize, and manage your tasks efficiently. Try asking me about your current tasks or creating new ones.
              </p>
              
              <!-- Suggestion cards with better accessibility -->
              <div class="grid gap-3 mb-6">
                <button *ngFor="let suggestion of suggestions" 
                        (click)="useSuggestion(suggestion.text)"
                        class="group p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                      <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="suggestion.icon" />
                      </svg>
                    </div>
                    <span class="font-medium text-gray-900 dark:text-white">{{ suggestion.text }}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Message list with improved typography -->
          <div *ngIf="hasInitialMessage" class="space-y-6 max-w-4xl mx-auto">
            <div *ngFor="let msg of visibleMessages; trackBy: trackByFn" 
                 class="flex" 
                 [class.justify-end]="msg.role === 'user'"
                 [class.justify-start]="msg.role === 'assistant'">
              
              <!-- Assistant message -->
              <div *ngIf="msg.role === 'assistant'" class="flex space-x-3 max-w-[85%]">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-sm">
                  <p class="text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">{{ msg.content }}</p>
                  <time class="text-xs text-gray-500 dark:text-gray-400 mt-2 block">
                    {{ msg.timestamp | date:'shortTime' }}
                  </time>
                </div>
              </div>
              
              <!-- User message -->
              <div *ngIf="msg.role === 'user'" class="flex space-x-3 max-w-[85%] flex-row-reverse">
                <div class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div class="bg-blue-600 text-white rounded-2xl px-4 py-3 shadow-sm">
                  <p class="leading-relaxed">{{ msg.content }}</p>
                  <time class="text-xs text-blue-100 mt-2 block text-right">
                    {{ msg.timestamp | date:'shortTime' }}
                  </time>
                </div>
              </div>
            </div>
            
            <!-- Typing indicator with better animation -->
            <div *ngIf="isLoading" class="flex space-x-3">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-sm">
                <div class="flex items-center space-x-2">
                  <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                  </div>
                  <span class="text-sm text-gray-500 dark:text-gray-400">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Error message with better design -->
        <div *ngIf="errorMessage" 
             class="mx-4 mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div class="flex items-start space-x-3">
            <svg class="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Something went wrong</h3>
              <p class="text-sm text-red-700 dark:text-red-300 mt-1">{{ errorMessage }}</p>
              <button (click)="clearError()" 
                      class="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 font-medium mt-2 focus:outline-none focus:underline">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <!-- Input area with improved design -->
      <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <form (ngSubmit)="send()" class="max-w-4xl mx-auto">
          <div class="flex space-x-3">
            <div class="flex-1 relative">
              <input 
                #messageInput
                name="input" 
                [(ngModel)]="input" 
                (ngModelChange)="inputChanged($event)"
                (keydown.enter)="handleEnterKey($event)"
                required 
                placeholder="Ask me about your tasks or type a command..." 
                class="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                [disabled]="isLoading"
                autocomplete="off"
              />
              <!-- Character count for long messages -->
              <div *ngIf="input.length > 100" 
                   class="absolute right-12 top-1/2 transform -translate-y-1/2 text-xs text-gray-400"
                   [class.text-red-500]="input.length > 500">
                {{ input.length }}/500
              </div>
            </div>
            
            <button 
              type="submit" 
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:cursor-not-allowed flex items-center space-x-2"
              [disabled]="isLoading || !input.trim() || input.length > 500"
              [attr.aria-label]="isLoading ? 'Sending message' : 'Send message'">
              
              <span *ngIf="!isLoading">Send</span>
              <span *ngIf="isLoading">Sending</span>
              
              <svg *ngIf="!isLoading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              
              <svg *ngIf="isLoading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          
          <!-- Quick actions -->
          <div *ngIf="!hasInitialMessage" class="flex flex-wrap gap-2 mt-3">
            <button *ngFor="let action of quickActions" 
                    type="button"
                    (click)="useQuickAction(action)"
                    class="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
              {{ action }}
            </button>
          </div>
          
          <!-- Reset chat button - now always visible -->
          <div class="mt-3 flex justify-end">
            <button 
              type="button" 
              (click)="resetChat()"
              class="inline-flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus:text-red-600 dark:focus:text-red-400 transition-colors"
              title="Clear chat history">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Reset Chat</span>
            </button>
          </div>
        </form>
      </footer>
    </div>
  `
})
export class AiAssistantComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;
  
  messages: ChatMessage[] = [];
  visibleMessages: ChatMessage[] = [];
  input = '';
  isLoading = false;
  errorMessage = '';
  todos: Todo[] = [];
  hasInitialMessage = false;
  
  // UX improvements
  suggestions = [
    { text: "Show me my incomplete tasks", icon: "M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { text: "What are my high priority tasks?", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { text: "Create a new task", icon: "M12 6v6m0 0v6m0-6h6m-6 0H6" },
    { text: "What's due this week?", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { text: "Mark all tasks as complete", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
    { text: "Delete all completed tasks", icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" },
    { text: "Set all tasks due next Monday", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }
  ];
  
  quickActions = [
    "Show all tasks",
    "Add task",
    "Priority tasks",
    "Due today",
    "Mark all complete",
    "Delete completed",
    "Due next Monday"
  ];
  
  private inputSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  private subscriptions = new Subscription();
  private observer: IntersectionObserver | null = null;
  private readonly MAX_VISIBLE_MESSAGES = 50;
  
  constructor(
    private chat: AiChatService,
    private cdr: ChangeDetectorRef,
    private networkService: NetworkService,
    private todoService: TodoService,
    private authService: AuthService,
    private router: Router
  ) {}
  
  // Navigation method
  goBack(): void {
    this.router.navigate(['/app/']);
  }
  
  get isOnline$(): Observable<boolean> {
    return this.networkService.isOnline$;
  }
  
  ngOnInit() {
    this.subscriptions.add(
      this.inputSubject.pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(value => {
        // Handle debounced input if needed
      })
    );
    
    this.subscriptions.add(
      this.todoService.todos$
        .pipe(takeUntil(this.destroy$))
        .subscribe(todos => {
          this.todos = todos;
        })
    );
    
    this.loadStoredMessages();
    
    if (this.messages.length === 0) {
      this.messages.push({
        role: 'assistant',
        content: 'Hello! I\'m your AI assistant. I can help you manage your tasks efficiently. What would you like to do today?',
        timestamp: Date.now()
      });
      this.updateVisibleMessages();
      this.storeMessages();
    } else {
      this.hasInitialMessage = true;
    }
  }
  
  ngAfterViewInit() {
    this.setupIntersectionObserver();
    setTimeout(() => this.scrollToBottom(), 100);
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.unsubscribe();
    
    if (this.observer) {
      this.observer.disconnect();
    }
    
    this.storeMessages();
  }
  
  // UX improvement methods
  useSuggestion(text: string) {
    this.input = text;
    this.messageInput.nativeElement.focus();
  }
  
  useQuickAction(action: string) {
    const actionMap: { [key: string]: string } = {
      'Show all tasks': 'Show me all my tasks',
      'Add task': 'Help me create a new task',
      'Priority tasks': 'What are my high priority tasks?',
      'Due today': 'What tasks are due today?',
      'Mark all complete': 'Mark all tasks as complete',
      'Delete completed': 'Delete all completed tasks',
      'Due next Monday': 'Set all tasks due next Monday'
    };
    
    this.input = actionMap[action] || action;
    this.send();
  }
  
  handleEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter' && !keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      this.send();
    }
  }
  
  clearError() {
    this.errorMessage = '';
    this.cdr.markForCheck();
  }
  
  // Rest of the existing methods remain the same...
  private setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          // Load more messages if needed when scrolling up
        },
        { threshold: 0.1 }
      );
    }
  }
  
  private loadStoredMessages() {
    try {
      const stored = localStorage.getItem('chat_messages');
      if (stored) {
        const parsedMessages = JSON.parse(stored) as ChatMessage[];
        this.messages = parsedMessages;
        this.hasInitialMessage = this.messages.length > 0;
        this.updateVisibleMessages();
      }
    } catch (err) {
      console.error('Failed to load stored messages', err);
    }
  }
  
  private storeMessages() {
    try {
      const messagesToStore = this.messages.slice(-100);
      localStorage.setItem('chat_messages', JSON.stringify(messagesToStore));
    } catch (err) {
      console.error('Failed to store messages', err);
    }
  }
  
  private updateVisibleMessages() {
    this.visibleMessages = this.messages.slice(-this.MAX_VISIBLE_MESSAGES);
    this.cdr.markForCheck();
  }
  
  inputChanged(value: string) {
    this.inputSubject.next(value);
  }

  async send() {
    const content = this.input.trim();
    if (!content || this.isLoading || content.length > 500) return;
    
    this.errorMessage = '';
    this.hasInitialMessage = true;
    
    const newMessage: ChatMessage = { 
      role: 'user', 
      content,
      timestamp: Date.now()
    };
    
    this.messages.push(newMessage);
    this.updateVisibleMessages();
    this.input = '';
    this.isLoading = true;
    
    setTimeout(() => this.scrollToBottom(), 0);
    
    try {
      const taskContext = await this.getTaskContext();
      
      const messagesWithContext = [
        { role: 'system' as const, content: `Current user tasks: ${taskContext}` },
        ...this.messages
      ];
      
      this.chat.send(messagesWithContext)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => {
            this.isLoading = false;
            this.cdr.markForCheck();
          })
        )
        .subscribe({
          next: (res) => {
            try {
              const reply = res?.choices?.[0]?.message?.content || '';
              if (reply) {
                const assistantMessage: ChatMessage = {
                  role: 'assistant', 
                  content: reply,
                  timestamp: Date.now()
                };
                
                this.messages.push(assistantMessage);
                this.updateVisibleMessages();
                this.storeMessages();
                setTimeout(() => this.scrollToBottom(), 0);
                
                this.processTaskCommands(content, reply);
              } else {
                this.errorMessage = 'I\'m having trouble responding right now. Please try again.';
              }
            } catch (err) {
              this.errorMessage = 'Something went wrong while processing the response.';
              console.error('Response processing error:', err);
            }
          },
          error: (err) => {
            this.errorMessage = 'I\'m unable to respond right now. Please check your connection and try again.';
            console.error('Chat error:', err);
          }
        });
    } catch (error) {
      this.isLoading = false;
      this.errorMessage = 'Unable to access your task data at the moment.';
      this.cdr.markForCheck();
    }
  }
  
  private async getTaskContext(): Promise<string> {
    if (this.todos.length > 0) {
      return this.formatTodosForAI(this.todos);
    }
    
    const user = this.authService.getCurrentUser();
    if (!user) {
      return "No tasks available. User is not logged in.";
    }
    
    try {
      await new Promise<void>((resolve) => {
        this.todoService.todos$
          .pipe(take(1))
          .subscribe(todos => {
            this.todos = todos;
            resolve();
          });
      });
      
      return this.formatTodosForAI(this.todos);
    } catch (error) {
      console.error('Error getting task context:', error);
      return "Error accessing task data.";
    }
  }
  
  private formatTodosForAI(todos: Todo[]): string {
    if (todos.length === 0) {
      return "You don't have any tasks yet.";
    }
    
    const formattedTodos = todos.map(todo => {
      const status = todo.completed ? 'completed' : 'incomplete';
      
      let dueDateStr = 'no due date';
      if (todo.dueDate) {
        if ('toDate' in todo.dueDate && typeof todo.dueDate.toDate === 'function') {
          dueDateStr = todo.dueDate.toDate().toLocaleDateString();
        } else if (todo.dueDate instanceof Date) {
          dueDateStr = todo.dueDate.toLocaleDateString();
        } else {
          try {
            dueDateStr = new Date(todo.dueDate as any).toLocaleDateString();
          } catch (e) {
            dueDateStr = 'invalid date';
          }
        }
      }
      
      return `- "${todo.title}" (${status}, priority: ${todo.priority || 'medium'}, due: ${dueDateStr})${todo.description ? ': ' + todo.description : ''}`;
    }).join('\n');
    
    return `${todos.length} tasks:\n${formattedTodos}`;
  }
  
  private processTaskCommands(userQuery: string, aiResponse: string): void {
    let taskActionPerformed = false;
    let actionFeedback = '';
    
    // Check for bulk operations first
    if (/all|every|all of|each|multiple tasks/i.test(userQuery.toLowerCase())) {
      // Bulk mark complete/incomplete
      if (/mark|set|complete|finish|done|incomplete|undone/i.test(userQuery.toLowerCase())) {
        const shouldComplete = /complete|finish|done/i.test(userQuery) && 
                             !(/incomplete|not complete|undone/i.test(userQuery));
        
        const updateData: {id: string, data: Partial<Omit<Todo, 'id' | 'userId' | 'createdAt'>>}[] = [];
        const affectedTasks: string[] = [];
        
        this.todos.forEach(todo => {
          // Skip tasks that are already in the desired state
          if (todo.completed === shouldComplete) return;
          
          if (todo.id) {
            updateData.push({
              id: todo.id,
              data: { completed: shouldComplete }
            });
            affectedTasks.push(todo.title);
          }
        });
        
        if (updateData.length > 0) {
          this.todoService.updateMultipleTodos(updateData)
            .then(() => {
              taskActionPerformed = true;
              const taskCount = affectedTasks.length;
              actionFeedback = `✅ ${taskCount} tasks marked as ${shouldComplete ? 'complete' : 'incomplete'}.`;
              this.addSystemFeedbackMessage(actionFeedback);
            })
            .catch(err => {
              console.error('Error updating multiple tasks:', err);
              this.addSystemFeedbackMessage(`❌ Failed to update tasks: ${err.message}`);
            });
        }
        
        return; // Exit early after handling bulk operation
      }
      
      // Bulk delete
      if (/delete|remove|eliminate|trash/i.test(userQuery.toLowerCase())) {
        // Check for specific condition like "all completed tasks"
        const deleteCompleted = /completed|finished|done/i.test(userQuery.toLowerCase());
        
        const idsToDelete: string[] = [];
        const affectedTasks: string[] = [];
        
        this.todos.forEach(todo => {
          // If we're only deleting completed tasks, skip incomplete ones
          if (deleteCompleted && !todo.completed) return;
          
          if (todo.id) {
            idsToDelete.push(todo.id);
            affectedTasks.push(todo.title);
          }
        });
        
        if (idsToDelete.length > 0) {
          this.todoService.deleteMultipleTodos(idsToDelete)
            .then(() => {
              taskActionPerformed = true;
              const taskCount = affectedTasks.length;
              actionFeedback = `✅ ${taskCount} tasks have been deleted.`;
              this.addSystemFeedbackMessage(actionFeedback);
            })
            .catch(err => {
              console.error('Error deleting multiple tasks:', err);
              this.addSystemFeedbackMessage(`❌ Failed to delete tasks: ${err.message}`);
            });
        }
        
        return; // Exit early after handling bulk operation
      }
      
      // Bulk update priority
      if (/change|update|set|modify|priority/i.test(userQuery.toLowerCase())) {
        const priorityMatch = /\b(high|medium|low)\b\s+priority|\bpriority\s+\b(high|medium|low)\b/i.exec(userQuery);
        
        if (priorityMatch) {
          const priority = (priorityMatch[1] || priorityMatch[2]).toLowerCase() as 'high' | 'medium' | 'low';
          
          const updateData: {id: string, data: Partial<Omit<Todo, 'id' | 'userId' | 'createdAt'>>}[] = [];
          const affectedTasks: string[] = [];
          
          this.todos.forEach(todo => {
            // Skip tasks that already have this priority
            if (todo.priority === priority) return;
            
            if (todo.id) {
              updateData.push({
                id: todo.id,
                data: { priority }
              });
              affectedTasks.push(todo.title);
            }
          });
          
          if (updateData.length > 0) {
            this.todoService.updateMultipleTodos(updateData)
              .then(() => {
                taskActionPerformed = true;
                const taskCount = affectedTasks.length;
                actionFeedback = `✅ ${taskCount} tasks updated to ${priority} priority.`;
                this.addSystemFeedbackMessage(actionFeedback);
              })
              .catch(err => {
                console.error('Error updating priority for multiple tasks:', err);
                this.addSystemFeedbackMessage(`❌ Failed to update task priorities: ${err.message}`);
              });
          }
          
          return; // Exit early after handling bulk operation
        }
      }
      
      // Bulk update due date
      if (/due date|deadline|reschedule/i.test(userQuery.toLowerCase())) {
        let dueDate: Date | undefined = undefined;
        let dueDateText = '';
        
        // Enhanced date parsing
        if (/tomorrow/i.test(userQuery)) {
          dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 1);
          dueDateText = 'tomorrow';
        } else if (/next week/i.test(userQuery)) {
          dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 7);
          dueDateText = 'next week';
        } else if (/today/i.test(userQuery)) {
          dueDate = new Date();
          dueDateText = 'today';
        } else if (/next month/i.test(userQuery)) {
          dueDate = new Date();
          dueDate.setMonth(dueDate.getMonth() + 1);
          dueDateText = 'next month';
        } else if (/next friday|this friday/i.test(userQuery)) {
          dueDate = this.getNextDayOfWeek(5); // Friday is 5 (0 is Sunday)
          dueDateText = 'Friday';
        } else if (/next monday|this monday/i.test(userQuery)) {
          dueDate = this.getNextDayOfWeek(1); // Monday is 1
          dueDateText = 'Monday';
        } else if (/(\d{1,2})(?:st|nd|rd|th)? of (?:january|february|march|april|may|june|july|august|september|october|november|december)/i.test(userQuery)) {
          // Match patterns like "15th of December" or "3rd of March"
          const dateMatch = userQuery.match(/(\d{1,2})(?:st|nd|rd|th)? of (january|february|march|april|may|june|july|august|september|october|november|december)/i);
          if (dateMatch) {
            const day = parseInt(dateMatch[1], 10);
            const monthName = dateMatch[2].toLowerCase();
            const monthIndex = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'].indexOf(monthName);
            
            if (monthIndex !== -1 && day >= 1 && day <= 31) {
              const now = new Date();
              let year = now.getFullYear();
              
              // If the month is before current month, assume next year
              if (monthIndex < now.getMonth()) {
                year++;
              }
              
              dueDate = new Date(year, monthIndex, day);
              dueDateText = `${day} ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}`;
            }
          }
        } else if (/in (\d+) days?/i.test(userQuery)) {
          // Match patterns like "in 5 days" or "in 1 day"
          const daysMatch = userQuery.match(/in (\d+) days?/i);
          if (daysMatch) {
            const days = parseInt(daysMatch[1], 10);
            dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + days);
            dueDateText = `in ${days} day${days === 1 ? '' : 's'}`;
          }
        }
        
        if (dueDate) {
          const updateData: {id: string, data: Partial<Omit<Todo, 'id' | 'userId' | 'createdAt'>>}[] = [];
          const affectedTasks: string[] = [];
          
          // Check for incomplete only condition
          const incompleteOnly = /incomplete|not done|not completed|unfinished/i.test(userQuery);
          
          this.todos.forEach(todo => {
            // Skip completed tasks if we're only updating incomplete ones
            if (incompleteOnly && todo.completed) return;
            
            if (todo.id) {
              updateData.push({
                id: todo.id,
                data: { dueDate }
              });
              affectedTasks.push(todo.title);
            }
          });
          
          if (updateData.length > 0) {
            this.todoService.updateMultipleTodos(updateData)
              .then(() => {
                taskActionPerformed = true;
                const taskCount = affectedTasks.length;
                actionFeedback = `✅ ${taskCount} tasks due date set to ${dueDateText}.`;
                this.addSystemFeedbackMessage(actionFeedback);
              })
              .catch(err => {
                console.error('Error updating due dates for multiple tasks:', err);
                this.addSystemFeedbackMessage(`❌ Failed to update due dates: ${err.message}`);
              });
          }
          
          return; // Exit early after handling bulk operation
        }
      }
      
      // Add tags to tasks
      if (/add tags?|apply tags?|set tags?/i.test(userQuery.toLowerCase())) {
        const tagsMatch = userQuery.match(/tags?\s+["']?([^"']+)["']?(?:\s+to|\s+for|\s+on)/i);
        const taskMatch = userQuery.match(/(?:to|for|on)\s+(?:all|every|tasks?|todo)/i);
        
        if (tagsMatch && taskMatch) {
          const tags = tagsMatch[1].split(/,|\s+/).map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0);
          
          if (tags.length > 0) {
            const promises: Promise<void>[] = [];
            const affectedTasks: string[] = [];
            
            this.todos.forEach(todo => {
              if (todo.id) {
                promises.push(
                  this.todoService.addTags(todo.id, tags)
                    .then(() => {
                      affectedTasks.push(todo.title);
                    })
                );
              }
            });
            
            if (promises.length > 0) {
              Promise.all(promises)
                .then(() => {
                  taskActionPerformed = true;
                  actionFeedback = `✅ Added tags [${tags.join(', ')}] to ${affectedTasks.length} tasks.`;
                  this.addSystemFeedbackMessage(actionFeedback);
                })
                .catch(err => {
                  console.error('Error adding tags to tasks:', err);
                  this.addSystemFeedbackMessage(`❌ Failed to add tags: ${err.message}`);
                });
            }
            
            return; // Exit early after handling bulk operation
          }
        }
      }
      
      // Add tags to a specific task
      if (/add tags?|apply tags?|set tags?/i.test(userQuery.toLowerCase())) {
        const tagsMatch = userQuery.match(/tags?\s+["']?([^"']+)["']?(?:\s+to|\s+for|\s+on)/i);
        const taskMatch = userQuery.match(/(?:to|for|on)\s+["']([^"']+)["']|(?:to|for|on)\s+task\s+["']?([^"']+?)["']?(?:\s|$)/i);
        
        if (tagsMatch && taskMatch) {
          const tags = tagsMatch[1].split(/,|\s+/).map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0);
          const taskTitle = (taskMatch[1] || taskMatch[2]).trim();
          
          if (tags.length > 0) {
            const matchingTask = this.todos.find(t => 
              t.title.toLowerCase() === taskTitle.toLowerCase() || 
              t.title.toLowerCase().includes(taskTitle.toLowerCase())
            );
            
            if (matchingTask && matchingTask.id) {
              this.todoService.addTags(matchingTask.id, tags)
                .then(() => {
                  taskActionPerformed = true;
                  actionFeedback = `✅ Added tags [${tags.join(', ')}] to task "${matchingTask.title}".`;
                  this.addSystemFeedbackMessage(actionFeedback);
                })
                .catch(err => {
                  console.error('Error adding tags to task:', err);
                  this.addSystemFeedbackMessage(`❌ Failed to add tags: ${err.message}`);
                });
            }
          }
          
          return; // Exit early after handling operation
        }
      }
      
      // Remove tags from tasks
      if (/remove tags?|delete tags?|clear tags?/i.test(userQuery.toLowerCase())) {
        const tagsMatch = userQuery.match(/tags?\s+["']?([^"']+)["']?(?:\s+from|\s+in|\s+on)/i);
        const taskMatch = userQuery.match(/(?:from|in|on)\s+(?:all|every|tasks?|todo)/i);
        
        if (tagsMatch && taskMatch) {
          const tags = tagsMatch[1].split(/,|\s+/).map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0);
          
          if (tags.length > 0) {
            const promises: Promise<void>[] = [];
            const affectedTasks: string[] = [];
            
            this.todos.forEach(todo => {
              if (todo.id) {
                promises.push(
                  this.todoService.removeTags(todo.id, tags)
                    .then(() => {
                      affectedTasks.push(todo.title);
                    })
                );
              }
            });
            
            if (promises.length > 0) {
              Promise.all(promises)
                .then(() => {
                  taskActionPerformed = true;
                  actionFeedback = `✅ Removed tags [${tags.join(', ')}] from ${affectedTasks.length} tasks.`;
                  this.addSystemFeedbackMessage(actionFeedback);
                })
                .catch(err => {
                  console.error('Error removing tags from tasks:', err);
                  this.addSystemFeedbackMessage(`❌ Failed to remove tags: ${err.message}`);
                });
            }
            
            return; // Exit early after handling bulk operation
          }
        }
      }
      
      // Add subtask to a task
      if (/add subtask|create subtask|new subtask/i.test(userQuery.toLowerCase())) {
        const subtaskMatch = userQuery.match(/subtask\s+["']?([^"']+)["']?(?:\s+to|\s+for|\s+on)/i);
        const taskMatch = userQuery.match(/(?:to|for|on)\s+["']([^"']+)["']|(?:to|for|on)\s+task\s+["']?([^"']+?)["']?(?:\s|$)/i);
        
        if (subtaskMatch && taskMatch) {
          const subtaskTitle = subtaskMatch[1].trim();
          const taskTitle = (taskMatch[1] || taskMatch[2]).trim();
          
          const matchingTask = this.todos.find(t => 
            t.title.toLowerCase() === taskTitle.toLowerCase() || 
            t.title.toLowerCase().includes(taskTitle.toLowerCase())
          );
          
          if (matchingTask && matchingTask.id) {
            const subtask: SubTask = {
              id: Date.now().toString(), // Generate a simple unique ID
              title: subtaskTitle,
              completed: false
            };
            
            this.todoService.addOrUpdateSubtask(matchingTask.id, subtask)
              .then(() => {
                taskActionPerformed = true;
                actionFeedback = `✅ Added subtask "${subtaskTitle}" to task "${matchingTask.title}".`;
                this.addSystemFeedbackMessage(actionFeedback);
              })
              .catch(err => {
                console.error('Error adding subtask:', err);
                this.addSystemFeedbackMessage(`❌ Failed to add subtask: ${err.message}`);
              });
              
            return; // Exit early after handling operation
          }
        }
      }
      
      // Complete/mark subtask as done
      if (/complete subtask|mark subtask|finish subtask|done subtask/i.test(userQuery.toLowerCase())) {
        const subtaskMatch = userQuery.match(/subtask\s+["']?([^"']+)["']?(?:\s+in|\s+of|\s+from)/i);
        const taskMatch = userQuery.match(/(?:in|of|from)\s+["']([^"']+)["']|(?:in|of|from)\s+task\s+["']?([^"']+?)["']?(?:\s|$)/i);
        
        if (subtaskMatch && taskMatch) {
          const subtaskTitle = subtaskMatch[1].trim();
          const taskTitle = (taskMatch[1] || taskMatch[2]).trim();
          
          const matchingTask = this.todos.find(t => 
            t.title.toLowerCase() === taskTitle.toLowerCase() || 
            t.title.toLowerCase().includes(taskTitle.toLowerCase())
          );
          
          if (matchingTask && matchingTask.id && matchingTask.subtasks) {
            const matchingSubtask = matchingTask.subtasks.find(s => 
              s.title.toLowerCase() === subtaskTitle.toLowerCase() || 
              s.title.toLowerCase().includes(subtaskTitle.toLowerCase())
            );
            
            if (matchingSubtask) {
              // Toggle the completion status
              const updatedSubtask: SubTask = {
                ...matchingSubtask,
                completed: !matchingSubtask.completed
              };
              
              this.todoService.addOrUpdateSubtask(matchingTask.id, updatedSubtask)
                .then(() => {
                  taskActionPerformed = true;
                  const status = updatedSubtask.completed ? 'completed' : 'incomplete';
                  actionFeedback = `✅ Marked subtask "${subtaskTitle}" as ${status}.`;
                  this.addSystemFeedbackMessage(actionFeedback);
                })
                .catch(err => {
                  console.error('Error updating subtask:', err);
                  this.addSystemFeedbackMessage(`❌ Failed to update subtask: ${err.message}`);
                });
                
              return; // Exit early after handling operation
            }
          }
        }
      }
      
      // Remove subtask
      if (/remove subtask|delete subtask/i.test(userQuery.toLowerCase())) {
        const subtaskMatch = userQuery.match(/subtask\s+["']?([^"']+)["']?(?:\s+from|\s+in|\s+of)/i);
        const taskMatch = userQuery.match(/(?:from|in|of)\s+["']([^"']+)["']|(?:from|in|of)\s+task\s+["']?([^"']+?)["']?(?:\s|$)/i);
        
        if (subtaskMatch && taskMatch) {
          const subtaskTitle = subtaskMatch[1].trim();
          const taskTitle = (taskMatch[1] || taskMatch[2]).trim();
          
          const matchingTask = this.todos.find(t => 
            t.title.toLowerCase() === taskTitle.toLowerCase() || 
            t.title.toLowerCase().includes(taskTitle.toLowerCase())
          );
          
          if (matchingTask && matchingTask.id && matchingTask.subtasks) {
            const matchingSubtask = matchingTask.subtasks.find(s => 
              s.title.toLowerCase() === subtaskTitle.toLowerCase() || 
              s.title.toLowerCase().includes(subtaskTitle.toLowerCase())
            );
            
            if (matchingSubtask) {
              this.todoService.removeSubtask(matchingTask.id, matchingSubtask.id)
                .then(() => {
                  taskActionPerformed = true;
                  actionFeedback = `✅ Removed subtask "${subtaskTitle}" from task "${matchingTask.title}".`;
                  this.addSystemFeedbackMessage(actionFeedback);
                })
                .catch(err => {
                  console.error('Error removing subtask:', err);
                  this.addSystemFeedbackMessage(`❌ Failed to remove subtask: ${err.message}`);
                });
                
              return; // Exit early after handling operation
            }
          }
        }
      }
      
      // Bulk create tasks
      if (/create|add|new tasks/i.test(userQuery.toLowerCase())) {
        // Look for multiple tasks in various formats
        let taskTitles: string[] = [];
        
        // Format 1: "create tasks: task1, task2, task3"
        const tasksColonMatch = userQuery.match(/(?:create|add|new) tasks:?\s*(.+?)(?:with|by|due|$)/i);
        if (tasksColonMatch && tasksColonMatch[1]) {
          taskTitles = tasksColonMatch[1].split(/,|\n/).map(title => title.trim()).filter(title => title.length > 0);
        }
        
        // Format 2: "create the following tasks: task1, task2, task3"
        const followingTasksMatch = userQuery.match(/(?:create|add|new) (?:the )?following tasks:?\s*(.+?)(?:with|by|due|$)/i);
        if (followingTasksMatch && followingTasksMatch[1]) {
          taskTitles = followingTasksMatch[1].split(/,|\n/).map(title => title.trim()).filter(title => title.length > 0);
        }
        
        // Format 3: Numbered or bulleted list
        // Look for patterns like "1. Task one", "2. Task two" or "- Task one", "* Task two"
        const listItemRegex = /(?:^|\n)(?:\d+\.|\*|\-)\s*([^\n]+)/g;
        let listMatch;
        const listItems: string[] = [];
        while ((listMatch = listItemRegex.exec(userQuery)) !== null) {
          if (listMatch[1] && listMatch[1].trim().length > 0) {
            listItems.push(listMatch[1].trim());
          }
        }
        
        if (listItems.length > 0) {
          taskTitles = listItems;
        }
        
        if (taskTitles.length > 0) {
          let priority: 'low' | 'medium' | 'high' = 'medium';
          if (/high priority/i.test(userQuery)) priority = 'high';
          if (/low priority/i.test(userQuery)) priority = 'low';
          
          let dueDate: Date | undefined = undefined;
          if (/due (tomorrow|today|next week)/i.test(userQuery)) {
            const date = new Date();
            if (/tomorrow/i.test(userQuery)) {
              date.setDate(date.getDate() + 1);
            } else if (/next week/i.test(userQuery)) {
              date.setDate(date.getDate() + 7);
            }
            dueDate = date;
          } else if (/next month/i.test(userQuery)) {
            dueDate = new Date();
            dueDate.setMonth(dueDate.getMonth() + 1);
          } else if (/next friday|this friday/i.test(userQuery)) {
            dueDate = this.getNextDayOfWeek(5); // Friday is 5 (0 is Sunday)
          } else if (/next monday|this monday/i.test(userQuery)) {
            dueDate = this.getNextDayOfWeek(1); // Monday is 1
          }
          
          // Create array of todos for batch creation
          const todosToCreate = taskTitles.map(title => {
            return {
              title,
              description: '',
              completed: false,
              priority,
              dueDate
            };
          });
          
          this.todoService.addMultipleTodos(todosToCreate)
            .then(() => {
              taskActionPerformed = true;
              actionFeedback = `✅ Created ${taskTitles.length} new tasks.`;
              this.addSystemFeedbackMessage(actionFeedback);
            })
            .catch(err => {
              console.error('Error creating multiple tasks:', err);
              this.addSystemFeedbackMessage(`❌ Failed to create tasks: ${err.message}`);
            });
          
          return; // Exit early after handling bulk operation
        }
      }
    }
  }
  
  private addSystemFeedbackMessage(content: string): void {
    // Add a system message that will be shown to the user
    const feedbackMessage: ChatMessage = {
      role: 'assistant',
      content,
      timestamp: Date.now()
    };
    
    // Add with a slight delay to ensure it appears after the AI's response
    setTimeout(() => {
      this.messages.push(feedbackMessage);
      this.updateVisibleMessages();
      this.storeMessages();
      this.scrollToBottom();
    }, 500);
  }
  
  trackByFn(index: number, item: ChatMessage): number {
    return item.timestamp || index;
  }
  
  private scrollToBottom() {
    if (this.chatContainer && this.chatContainer.nativeElement) {
      const element = this.chatContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }
  
  resetChat() {
    this.messages = [];
    this.visibleMessages = [];
    this.hasInitialMessage = false;
    this.errorMessage = '';
    this.input = '';
    this.storeMessages();
    this.cdr.markForCheck();
  }
  
  // Helper method to get the next occurrence of a specific day of week
  private getNextDayOfWeek(dayOfWeek: number): Date {
    const result = new Date();
    result.setDate(result.getDate() + (dayOfWeek + 7 - result.getDay()) % 7);
    return result;
  }
}