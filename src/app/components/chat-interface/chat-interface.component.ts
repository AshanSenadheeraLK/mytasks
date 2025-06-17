import { Component, ElementRef, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TaskChatService, ChatMessage } from '../../services/task-chat.service';
import { ThemeToggleComponent } from '../shared/theme-toggle.component';
import { ChatSidebarComponent } from './chat-sidebar.component';
import { ChatInputComponent } from './chat-input.component';
import { MessageBubbleComponent } from './message-bubble.component';

@Component({
  selector: 'app-chat-interface',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent, ChatSidebarComponent, ChatInputComponent, MessageBubbleComponent],
  template: `
    <div class="flex flex-col h-screen bg-white dark:bg-gray-900">
      <header class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <button (click)="navigateBack()" class="flex items-center text-sm gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-600">
          <i class="bi bi-arrow-left"></i><span>Back</span>
        </button>
        <h1 class="font-semibold">Chat Assistant</h1>
        <app-theme-toggle></app-theme-toggle>
      </header>
      <div class="flex flex-1 overflow-hidden">
        <app-chat-sidebar></app-chat-sidebar>
        <div class="flex flex-col flex-1">
          <div class="flex-1 overflow-y-auto p-4 space-y-4" #scrollContainer>
            <ng-container *ngFor="let message of chat.messages$ | async; trackBy: trackByFn">
              <app-message-bubble [message]="message"></app-message-bubble>
            </ng-container>
          </div>
          <app-chat-input (sendMessage)="sendMessage($event)" #messageInput></app-chat-input>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; }
  `]
})
export class ChatInterfaceComponent implements OnInit, OnDestroy {
  private subscription?: Subscription;
  @ViewChild('scrollContainer') private scrollContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('messageInput') messageInputComp?: ChatInputComponent;

  constructor(public chat: TaskChatService) {}

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      this.messageInputComp?.handleSubmit();
    }
  }

  ngOnInit(): void {
    this.subscription = this.chat.messages$.subscribe(() => {
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  navigateBack() {
    window.location.href = '/app';
  }

  sendMessage(text: string): void {
    const message = text.trim();
    if (message) {
      this.chat.sendMessage(message);
    }
  }

  trackByFn(index: number, _item: ChatMessage): number {
    return index;
  }

  private scrollToBottom(): void {
    const element = this.scrollContainer?.nativeElement;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }
}
