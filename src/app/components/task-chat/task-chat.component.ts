import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TaskChatService } from '../../services/task-chat.service';
import { ThemeToggleComponent } from '../shared/theme-toggle.component';
import { ChatInterfaceComponent } from '../chat-interface/chat-interface.component';
import { TimeDisplayComponent } from '../time-display/time-display.component';

@Component({
  selector: 'app-task-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ThemeToggleComponent, ChatInterfaceComponent, TimeDisplayComponent],
  template: `
  <div >
    <app-chat-interface></app-chat-interface>
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
