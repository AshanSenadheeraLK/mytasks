import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AiAgentService } from './ai-agent.service';
import { TodoService } from './todo.service';

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

interface AiAction {
  type: 'create' | 'update' | 'delete' | 'categorize';
  id?: string;
  title?: string;
  description?: string;
  dueDate?: string;
  dueTime?: string;
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
    const messages: ChatMessage[] = [
      ...this.messagesSubject.value,
      { role: 'user', text }
    ];
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
    const tasks = this.todos.currentTodos
      .map(t => {
        const due = t.dueDate ? this.formatDate(t.dueDate) : '';
        const tags = t.tags?.length ? ` [${t.tags.join(', ')}]` : '';
        return `- (${t.id}) ${t.title}${t.description ? ` - ${t.description}` : ''}${due ? ` due ${due}` : ''}${tags}`;
      })
      .join('\n');

    const system = `You are a task management assistant. You can create, update, delete and categorize tasks. When appropriate, respond in JSON like {"reply":"text","actions":[{"type":"create|update|delete|categorize","id":"optional","title":"","description":"","dueDate":"YYYY-MM-DD","dueTime":"HH:mm","priority":"low|medium|high","tags":[],"completed":false}]}. Always provide dueDate and dueTime if the user specifies them. Current tasks:\n${tasks || 'No tasks.'}`;
    return `${system}\n${conversation}`;
  }

  private formatDate(date: any): string {
    try {
      const d = date.seconds ? new Date(date.seconds * 1000) : new Date(date);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().slice(0, 16).replace('T', ' ');
    } catch {
      return '';
    }
  }


    const system = `You are a task management assistant. Respond concisely and when needed include JSON like {"reply":"text","actions":[{"type":"create|update|delete|categorize","id":"optional","title":"","description":"","dueDate":"YYYY-MM-DD","dueTime":"HH:mm","priority":"low|medium|high","tags":[],"completed":false}]}. Always provide dueDate and dueTime if the user specifies them.`;
    return `${system}\n${conversation}`;
  }

  private combineDateTime(date?: string, time?: string): Date | undefined {
    if (!date && !time) return undefined;
    const base = date ? new Date(date) : new Date();
    if (isNaN(base.getTime())) return undefined;
    if (time) {
      const [h, m] = time.split(':').map(n => parseInt(n, 10));
      if (!isNaN(h) && !isNaN(m)) {
        base.setHours(h, m, 0, 0);
      }
    }
    return base;
  }

  private async applyAction(action: AiAction): Promise<void> {
    switch (action.type) {
      case 'create':
        const dueForCreate = this.combineDateTime(action.dueDate, action.dueTime);
        const existing = this.todos.currentTodos.find(t =>
          t.title === (action.title || 'Untitled') &&
          (t.description || '') === (action.description || '')
        );
        if (existing) {
          await this.todos.updateTodo(existing.id!, {
            dueDate: dueForCreate ?? existing.dueDate,
            priority: action.priority ?? existing.priority,
            tags: action.tags ?? existing.tags
          });
        } else {
          await this.todos.addTodo(
            action.title || 'Untitled',
            action.description,
            dueForCreate,
            action.priority || 'medium',
            action.tags || []
          );
        }

    const system = `You are a task management assistant. When appropriate, respond in JSON like {
      "reply": "text",
      "actions": [{
        "type": "create|update|delete|categorize",
        "id": "optional",
        "title": "",
        "description": "",
        "dueDate": "ISO",
        "priority": "low|medium|high",
        "tags": [],
        "completed": false
      }]}. Minimize other text.`;
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
            dueDate: this.combineDateTime(action.dueDate, action.dueTime),

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
      case 'categorize':
        if (action.id && action.tags) {
          await this.todos.updateTodo(action.id, { tags: action.tags });
        }
        break;
    }
  }
}
