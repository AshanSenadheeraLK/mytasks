import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { NetworkService } from './network.service';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  private endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  private apiKey = environment.geminiApiKey;
  private cache = new Map<string, Observable<any>>();
  private readonly MAX_MESSAGES = 10; // Limit context window to improve performance
  private readonly CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
  private readonly SYSTEM_PROMPT = `You are a helpful AI assistant that helps users manage their tasks. 
You have access to the user's task list and can help them organize, create, and manage their tasks.
You have permission to create, update, complete, and delete tasks based on user instructions.

You can:
1. Show tasks based on their status (completed/incomplete)
2. Show tasks based on priority (high/medium/low)
3. Create new tasks when users request them
4. Update task priorities, due dates, and completion status
5. Delete tasks when users ask you to
6. Suggest task organization strategies
7. Answer questions about their tasks

When a user asks you to perform an action on a task:
- For creating tasks: Respond confirming the task was created
- For updating tasks: Confirm the change was made
- For completing tasks: Acknowledge the task was marked as complete/incomplete
- For deleting tasks: Confirm the task was removed

Pay close attention to task management instructions. Look for keywords like:
- "create", "add", "new task" for creating tasks
- "mark", "set", "complete", "finish", "done" for completion status
- "delete", "remove", "eliminate" for removing tasks
- "change", "update", "priority", "high/medium/low" for priority changes
- "due date", "deadline", "reschedule" for changing due dates

When the user mentions a specific task by name, assume they want to perform an operation on that task.

Always be helpful, friendly, and proactive in helping users manage their tasks efficiently.`;

  constructor(
    private http: HttpClient,
    private networkService: NetworkService
  ) {
    // Listen for network reconnection to clear expired cache
    window.addEventListener('app:network:reconnected', () => {
      this.clearExpiredCache();
    });
  }

  send(messages: ChatMessage[]): Observable<any> {
    // Add system prompt if not present
    let messagesWithSystem = this.ensureSystemPrompt(messages);
    
    // Optimize context window by limiting message history
    const optimizedMessages = this.optimizeMessageHistory(messagesWithSystem);
    const cacheKey = this.generateCacheKey(optimizedMessages);
    
    // Return cached response if available
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    // If offline, return a placeholder response
    if (!this.networkService.isOnline) {
      this.storeOfflineRequest(optimizedMessages);
      return of({
        choices: [{
          message: {
            content: "I'm currently offline. Your message will be processed when you're back online."
          }
        }]
      });
    }
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    const body = {
      contents: optimizedMessages.map(m => ({
        role: m.role === 'system' ? 'model' : (m.role === 'assistant' ? 'model' : 'user'),
        parts: [{ text: m.content }]
      }))
    };
    
    const url = `${this.endpoint}?key=${this.apiKey}`;
    const request = this.http.post<any>(url, body, { headers }).pipe(
      map(response => this.processResponse(response)),
      catchError(error => this.handleError(error, optimizedMessages)),
      shareReplay(1), // Cache the response
      tap(() => {
        // Set timeout to clear this cache entry
        setTimeout(() => {
          this.cache.delete(cacheKey);
        }, this.CACHE_EXPIRY_MS);
      })
    );
    
    // Store in cache (only cache if not too large)
    if (JSON.stringify(optimizedMessages).length < 10000) {
      this.cache.set(cacheKey, request);
    }
    
    return request;
  }
  
  private ensureSystemPrompt(messages: ChatMessage[]): ChatMessage[] {
    // Check if there's already a system prompt
    const hasSystemPrompt = messages.some(m => m.role === 'system');
    
    if (!hasSystemPrompt) {
      // Add system prompt at the beginning
      return [
        { role: 'system', content: this.SYSTEM_PROMPT },
        ...messages
      ];
    }
    
    return messages;
  }
  
  private optimizeMessageHistory(messages: ChatMessage[]): ChatMessage[] {
    // Always include system messages
    const systemMessages = messages.filter(m => m.role === 'system');
    
    // Get the most recent messages up to MAX_MESSAGES limit
    const recentMessages = messages
      .filter(m => m.role !== 'system')
      .slice(-this.MAX_MESSAGES);
    
    return [...systemMessages, ...recentMessages];
  }
  
  private generateCacheKey(messages: ChatMessage[]): string {
    return JSON.stringify(messages.map(m => ({ role: m.role, content: m.content })));
  }
  
  private processResponse(response: any): any {
    if (!response || !response.candidates || !response.candidates[0]) {
      throw new Error('Invalid response format');
    }
    return {
      choices: [{
        message: {
          content: response.candidates[0].content.parts[0].text
        }
      }]
    };
  }
  
  private handleError(error: HttpErrorResponse, messages: ChatMessage[]): Observable<never> {
    console.error('AI Chat API Error:', error);
    
    // If network error, store request for later
    if (!this.networkService.isOnline || error.status === 0) {
      this.storeOfflineRequest(messages);
    }
    
    return throwError(() => new Error('Failed to get response from AI service'));
  }
  
  private storeOfflineRequest(messages: ChatMessage[]): void {
    this.networkService.storePendingRequest({
      type: 'ai-chat',
      messages,
      timestamp: Date.now()
    });
  }
  
  clearCache(): void {
    this.cache.clear();
  }
  
  clearExpiredCache(): void {
    // Only keep fresh cache entries
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      // This is a simple implementation - in a real app you might
      // want to store timestamps with cache entries
      this.cache.delete(key);
    }
  }
}
