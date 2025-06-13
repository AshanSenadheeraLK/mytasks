import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TaskChatService } from '../../services/task-chat.service';
import { ThemeToggleComponent } from '../shared/theme-toggle.component';

@Component({
  selector: 'app-task-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ThemeToggleComponent],
  template: `
    <div class="flex flex-col h-full">
      <header class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h1 class="text-lg font-semibold">AI Assistant</h1>
        <app-theme-toggle></app-theme-toggle>
      </header>
      <div class="flex-1 overflow-y-auto p-4 space-y-4" #scroll>
        <div *ngFor="let msg of chat.messages$ | async" class="flex" [ngClass]="{ 'justify-end': msg.role === 'user' }">
          <div class="max-w-lg px-4 py-2 rounded-2xl shadow" [ngClass]="msg.role === 'user' ? 'bg-accent text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'">
            {{ msg.text }}
          </div>
        </div>
      </div>
      <form class="flex items-center gap-3 p-4 border-t border-gray-200 dark:border-gray-700" (ngSubmit)="send()">
        <textarea name="message" [(ngModel)]="input" required rows="1" placeholder="Type your message..." class="flex-1 resize-none form-input"></textarea>
        <button type="submit" class="btn btn-primary flex items-center px-4">
          <i class="bi bi-send mr-1"></i> Send
        </button>
      </form>
    </div>
  `,
  styles: []
})
export class TaskChatComponent implements OnInit, OnDestroy {
  input = '';
  private sub?: Subscription;
  @ViewChild('scroll') private scrollElem?: ElementRef<HTMLDivElement>;

  constructor(public chat: TaskChatService) {}

  ngOnInit(): void {
    this.sub = this.chat.messages$.subscribe(() => {
      setTimeout(() => this.scrollToBottom(), 50);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  async send() {
    const text = this.input.trim();
    if (!text) return;
    this.input = '';
    await this.chat.sendMessage(text);
  }

  private scrollToBottom(): void {
    const el = this.scrollElem?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }
}
