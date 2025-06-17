import { Component, ElementRef, OnDestroy, OnInit, ViewChild, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ThemeToggleComponent } from '../shared/theme-toggle.component';
import { ChatSidebarComponent } from './chat-sidebar.component';
import { ChatInputComponent } from './chat-input.component';
import { MessageBubbleComponent } from './message-bubble.component';
import { ChatHeaderComponent } from './chat-header.component';
import { ChatFirestoreService, ChatMessage, Conversation } from '../../services/chat-firestore.service';
import { AiAgentService } from '../../services/ai-agent.service';

@Component({
  selector: 'app-chat-interface',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ThemeToggleComponent, 
    ChatSidebarComponent, 
    ChatInputComponent, 
    MessageBubbleComponent,
    ChatHeaderComponent
  ],
  template: `
    <div class="flex flex-col h-screen bg-background dark:bg-background-dark transition-colors">
      <app-chat-header
        [conversation]="currentConversation"
        [isSidebarOpen]="isSidebarOpen()"
        (toggleSidebar)="toggleSidebar()"
        (navigateBack)="navigateBack()"
      ></app-chat-header>
      
      <div class="flex flex-1 overflow-hidden">
        <app-chat-sidebar 
          [isOpen]="isSidebarOpen()" 
          [conversations]="conversations"
          [currentConversation]="currentConversation"
          (conversationSelected)="selectConversation($event)"
          (newConversation)="createNewConversation()"
          (deleteConversation)="deleteConversation($event)"
          (renameConversation)="renameConversation($event)"
          class="transition-all duration-300 ease-in-out"
          [ngClass]="{'w-80': isSidebarOpen(), 'w-0': !isSidebarOpen()}"
        ></app-chat-sidebar>
        
        <div class="flex flex-col flex-1">
          <!-- Loading indicator -->
          <div *ngIf="isLoading" class="absolute inset-0 bg-white/70 dark:bg-gray-900/70 z-10 flex items-center justify-center">
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <p class="mt-4 text-gray-600 dark:text-gray-300">Processing...</p>
            </div>
          </div>
          
          <!-- Empty state when no messages -->
          <div *ngIf="messages.length === 0 && !isLoading" class="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div class="w-20 h-20 bg-primary/10 dark:bg-primary-light/10 rounded-full flex items-center justify-center mb-4">
              <i class="bi bi-chat-dots text-3xl text-primary dark:text-primary-light"></i>
            </div>
            <h3 class="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">Start a conversation</h3>
            <p class="text-gray-600 dark:text-gray-400 max-w-md mb-6">
              Chat with your AI assistant to help you manage tasks, answer questions, or just have a conversation!
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-500">
              Messages are stored for 12 hours and then automatically deleted
            </p>
          </div>
          
          <!-- Messages area -->
          <div 
            *ngIf="messages.length > 0"
            class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
            #scrollContainer
          >
            <div class="max-w-screen-md mx-auto">
              <div *ngIf="messages.length > 0" class="text-center mb-6">
                <span class="inline-block px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-500 dark:text-gray-400">
                  Messages expire after 12 hours
                </span>
              </div>
              
              <ng-container *ngFor="let message of messages; trackBy: trackByFn">
                <app-message-bubble [message]="message"></app-message-bubble>
              </ng-container>
            </div>
          </div>
          
          <app-chat-input 
            (sendMessage)="sendMessage($event)" 
            [isLoading]="isLoading"
            #messageInput
          ></app-chat-input>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { 
      display: block; 
      height: 100vh; 
    }
  `]
})
export class ChatInterfaceComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  
  @ViewChild('scrollContainer') private scrollContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('messageInput') messageInputComp?: ChatInputComponent;

  messages: ChatMessage[] = [];
  conversations: Conversation[] = [];
  currentConversation: Conversation | null = null;
  isLoading = false;
  isSidebarOpen = signal(false);

  constructor(
    private chatService: ChatFirestoreService,
    private ai: AiAgentService
  ) {}

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      this.messageInputComp?.handleSubmit();
    }
    
    // Toggle sidebar with Ctrl+B
    if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
      event.preventDefault();
      this.toggleSidebar();
    }
  }

  ngOnInit(): void {
    // Check if user is authenticated
    this.subscriptions.add(
      this.chatService.auth.user$.subscribe(user => {
        if (!user) {
          // Only redirect if we're not already on the login page
          if (!window.location.pathname.includes('/login')) {
            this.handleAuthError();
          }
        } else {
          // User is authenticated, load their data
          this.loadUserData();
        }
      })
    );
    
    // Check screen size to determine if sidebar should be open by default
    this.isSidebarOpen.set(window.innerWidth >= 1024);
  }

  private loadUserData(): void {
    // Subscribe to messages
    this.subscriptions.add(
      this.chatService.messages$.subscribe(messages => {
        this.messages = messages;
        setTimeout(() => this.scrollToBottom(), 100);
      })
    );
    
    // Subscribe to conversations
    this.subscriptions.add(
      this.chatService.conversations$.subscribe(conversations => {
        this.conversations = conversations;
      })
    );
    
    // Subscribe to current conversation
    this.subscriptions.add(
      this.chatService.currentConversation$.subscribe(conversation => {
        this.currentConversation = conversation;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  navigateBack() {
    window.location.href = '/app';
  }

  toggleSidebar() {
    this.isSidebarOpen.set(!this.isSidebarOpen());
  }

  async sendMessage(text: string): Promise<void> {
    const message = text.trim();
    if (message && !this.isLoading) {
      this.isLoading = true;
      
      try {
        // Send user message to Firestore
        await this.chatService.sendMessage(message, 'user');
        
        try {
          // Get AI response
          const response = await this.ai.sendPrompt(message);
          
          // Send AI reply to Firestore
          if (response) {
            const aiMessage = typeof response === 'string' ? response : response.reply || 'I processed your request but couldn\'t generate a proper response.';
            await this.chatService.sendMessage(aiMessage, 'assistant');
          } else {
            // Handle null response
            await this.chatService.sendMessage('Sorry, I experienced a technical issue. Please try again later.', 'assistant');
          }
        } catch (aiError) {
          console.error('AI service error:', aiError);
          await this.chatService.sendMessage('Sorry, I\'m having trouble connecting to my brain right now. Please try again in a moment.', 'assistant');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        
        // Check if error is authentication related
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        if (errorMessage.includes('not authenticated') || errorMessage.includes('permissions')) {
          // Handle authentication error
          this.handleAuthError();
        } else {
          // Handle other errors
          await this.chatService.sendMessage('Sorry, an error occurred while processing your message. Please try again.', 'assistant')
            .catch(err => console.error('Failed to send error message:', err));
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
  
  // Handle authentication errors
  private handleAuthError(): void {
    this.messages = [
      {
        id: 'auth-error',
        conversationId: 'system',
        sender: 'system',
        text: 'You need to be logged in to use the chat feature. Please log in and try again.',
        role: 'assistant',
        createdAt: new Date()
      }
    ];
    
    // Redirect to login after 3 seconds
    setTimeout(() => {
      window.location.href = '/login';
    }, 3000);
  }

  selectConversation(conversationId: string): void {
    this.chatService.setCurrentConversation(conversationId);
    
    // Close sidebar on mobile after selecting conversation
    if (window.innerWidth < 1024) {
      this.isSidebarOpen.set(false);
    }
  }

  async createNewConversation(): Promise<void> {
    await this.chatService.createConversation('New Conversation');
  }

  async deleteConversation(id: string): Promise<void> {
    try {
      await this.chatService.deleteConversation(id);
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  }

  async renameConversation(event: {id: string, title: string}): Promise<void> {
    try {
      await this.chatService.renameConversation(event.id, event.title);
    } catch (error) {
      console.error('Error renaming conversation:', error);
    }
  }

  trackByFn(index: number, item: ChatMessage): string {
    return item.id || index.toString();
  }

  private scrollToBottom(): void {
    const element = this.scrollContainer?.nativeElement;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }
}
