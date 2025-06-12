import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AiAgentService } from './ai-agent.service';
import { TodoService } from './todo.service';

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

interface AiAction {
  type: 'create' | 'update' | 'delete';
  id?: string;
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  completed?: boolean;
}

interface AiResult {
  reply?: string;
  actions?: AiAction[];
}

@Injectable({ providedIn: 'root' })
export class TaskChatService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();

  constructor(private ai: AiAgentService, private todos: TodoService) {}

  async sendMessage(text: string): Promise<void> {
   const messages = [...this.messagesSubject.value, { role: 'user', text }];

    this.messagesSubject.next(messages);

    const prompt = this.buildPrompt(messages);
    const response = await this.ai.sendPrompt(prompt);
    if (!response) return;

    const result: AiResult = typeof response === 'string' ? { reply: response } : response;
    if (result.reply) {
      messages.push({ role: 'assistant', text: result.reply });
    }
    this.messagesSubject.next(messages);

    if (Array.isArray(result.actions)) {
      for (const action of result.actions) {
        await this.applyAction(action);
      }
    }
  }

  private buildPrompt(messages: ChatMessage[]): string {
    const conversation = messages.map(m => `${m.role}: ${m.text}`).join('\n');
tethdq-codex/implement-ai-agent-for-task-management
    const system = `You are a task management assistant. When appropriate, respond in JSON like {
      "reply": "text",
      "actions": [{
        "type": "create|update|delete",
        "id": "optional",
        "title": "",
        "description": "",
        "dueDate": "ISO",
        "priority": "low|medium|high",
        "tags": [],
        "completed": false
      }]}. Minimize other text.`;

    const system =
      'You are a task management assistant. When appropriate, respond in JSON like '\
      + '{"reply":"text","actions":[{"type":"create|update|delete","id":"optional",' +
      '"title":"","description":"","dueDate":"ISO","priority":"low|medium|high",' +
      '"tags":[],"completed":false}]}. Minimize other text.';

    return `${system}\n${conversation}`;
  }

  private async applyAction(action: AiAction): Promise<void> {
    switch (action.type) {
      case 'create':
        await this.todos.addTodo(
          action.title || 'Untitled',
          action.description,
          action.dueDate ? new Date(action.dueDate) : undefined,
          action.priority || 'medium',
          action.tags || []
        );
        break;
      case 'update':
        if (action.id) {
          await this.todos.updateTodo(action.id, {
            title: action.title,
            description: action.description,
            dueDate: action.dueDate ? new Date(action.dueDate) : undefined,
            priority: action.priority,
            tags: action.tags,
            completed: action.completed
          });
        }
        break;
      case 'delete':
        if (action.id) {
          await this.todos.deleteTodo(action.id);
        }
        break;
    }
  }
}
