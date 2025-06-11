import { Injectable } from '@angular/core';
import { Todo } from './todo.service';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  getCompletionRate(todos: Todo[]): number {
    if (!todos.length) return 0;
    const completed = todos.filter(t => t.completed).length;
    return (completed / todos.length) * 100;
  }
}
