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

interface CacheEntry {
  response: Observable<any>;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  private endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent';
  private apiKey = environment.geminiApiKey;
  private cache = new Map<string, CacheEntry>();
  private readonly MAX_MESSAGES = 10; // Limit context window to improve performance
  private readonly CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
  private readonly systemPrompt = `You are a helpful AI assistant that helps users manage their tasks. 
You have access to the user's task list and can help them organize, create, and manage their tasks.
You have permission to create, update, complete, and delete tasks based on user instructions.

You can:
1. Show tasks based on their status (completed/incomplete)
2. Show tasks based on priority (high/medium/low)
3. Create new tasks when users request them
4. Update task priorities, due dates, and completion status
5. Delete tasks when users ask you to
6. Suggest task organization strategies
7. Answer questions about only their tasks
8. Create, update, complete, and delete tasks in bulk based on user instructions
9. Add and remove tags from tasks
10. Work with task categories and subtasks

You can perform bulk operations on tasks, such as:
- Mark all tasks as complete or incomplete
- Delete all tasks or all completed tasks
- Set all tasks to the same priority level
- Set the same due date for multiple tasks
- Add or remove tags from all tasks at once

The system supports various date formats for setting due dates, including:
- Relative dates: "today", "tomorrow", "next week", "next month"
- Days of week: "next Monday", "this Friday"
- Specific dates: "15th of December", "3rd of March"
- Relative days: "in 5 days", "in 1 day"

For bulk task creation, you can use various formats:
- Comma-separated list: "Create tasks: buy milk, call mom, finish report"
- Numbered list: "Create the following tasks: 1. Buy milk 2. Call mom 3. Finish report"
- Bulleted list: "Create tasks: - Buy milk - Call mom - Finish report"

You can work with tags for better task organization:
- Add tags: "Add tags work, urgent to all tasks" or "Add tag project-x to task 'Finish report'"
- Remove tags: "Remove tag urgent from all tasks"
- Query by tags: "Show me all tasks with tag work"

You can work with subtasks to break down complex tasks:
- Add subtasks: "Add subtask 'Write introduction' to task 'Finish report'"
- Complete subtasks: "Mark subtask 'Write introduction' as complete in task 'Finish report'"
- Remove subtasks: "Delete subtask 'Write introduction' from task 'Finish report'"

You can't answer questions not related to task management of any kind, including but not limited to:
- General knowledge questions (weather, capitals, etc.)
- Philosophical questions
- Political questions
- Personal questions unrelated to tasks

When a user asks you to perform an action on a task:
- For creating tasks: Respond confirming the task was created
- For updating tasks: Confirm the change was made
- For completing tasks: Acknowledge the task was marked as complete/incomplete
- For deleting tasks: Confirm the task was removed
- For bulk operations: Confirm how many tasks were affected
- For tag operations: Confirm which tags were added or removed

Pay close attention to task management instructions. Look for keywords like:
- "create", "add", "new task" for creating tasks
- "mark", "set", "complete", "finish", "done" for completion status
- "delete", "remove", "eliminate" for removing tasks
- "change", "update", "priority", "high/medium/low" for priority changes
- "due date", "deadline", "reschedule" for changing due dates
- "all", "every", "all of", "each" for bulk operations
- "tag", "tags", "label", "labels" for tag operations

When the user mentions a specific task by name, assume they want to perform an operation on that task.
When the user mentions "all tasks" or similar, assume they want to perform a bulk operation.

Always be helpful, friendly, and proactive in helping users manage their tasks efficiently.

Other important rules:
- If the user asks for a task that doesn't exist, create it for them by asking them for the task name, description, and due date.
- If user asks a question not related to task management, politely decline and say "I am an AI Assistant only for task management on the MY TASKS app. I can't answer that question." and ask them to ask a question related to task management.
- If user asks your name, say that your name is "MY TASKS AI Assistant". Never mention that you are Google Gemini.

Your name is "MY TASKS AI Assistant".`;

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
    if (!this.apiKey) {
      console.error('Gemini API key is not configured');
      return throwError(() => new Error('AI service is not properly configured'));
    }
    
    // Add system prompt if not present
    let messagesWithSystem = this.ensureSystemPrompt(messages);
    
    // Optimize context window by limiting message history
    const optimizedMessages = this.optimizeMessageHistory(messagesWithSystem);
    const cacheKey = this.generateCacheKey(optimizedMessages);
    
    // Return cached response if available
    if (this.cache.has(cacheKey)) {
      const cacheEntry = this.cache.get(cacheKey)!;
      if (Date.now() - cacheEntry.timestamp < this.CACHE_EXPIRY_MS) {
        return cacheEntry.response;
      } else {
        // Cache expired, remove it
        this.cache.delete(cacheKey);
      }
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
    
    // Map roles correctly for Gemini API
    const body = {
      contents: optimizedMessages.map(m => ({
        role: this.mapRoleToGemini(m.role),
        parts: [{ text: m.content }]
      })),
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };
    
    const url = `${this.endpoint}?key=${this.apiKey}`;
    const request = this.http.post<any>(url, body, { headers }).pipe(
      map(response => this.processResponse(response)),
      catchError(error => this.handleError(error, optimizedMessages)),
      shareReplay(1) // Cache the response
    );
    
    // Store in cache (only cache if not too large)
    if (JSON.stringify(optimizedMessages).length < 10000) {
      this.cache.set(cacheKey, {
        response: request,
        timestamp: Date.now()
      });
    }
    
    return request;
  }
  
  private mapRoleToGemini(role: string): string {
    switch (role) {
      case 'system':
      case 'assistant':
        return 'model';
      case 'user':
      default:
        return 'user';
    }
  }
  
  private ensureSystemPrompt(messages: ChatMessage[]): ChatMessage[] {
    // Check if there's already a system prompt
    const hasSystemPrompt = messages.some(m => m.role === 'system');
    
    if (!hasSystemPrompt) {
      // Add system prompt at the beginning
      return [
        { role: 'system', content: this.systemPrompt },
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
    if (!response || !response.candidates || response.candidates.length === 0) {
      throw new Error('Invalid response format');
    }
    
    // Handle potential content filtering blocks
    if (response.candidates[0].finishReason === 'SAFETY') {
      return {
        choices: [{
          message: {
            content: "I'm sorry, I can't respond to that request. Please ask me about task management instead."
          }
        }]
      };
    }
    
    // Handle empty responses
    if (!response.candidates[0].content || !response.candidates[0].content.parts || 
        response.candidates[0].content.parts.length === 0 || !response.candidates[0].content.parts[0].text) {
      return {
        choices: [{
          message: {
            content: "I apologize, but I couldn't generate a response. Please try rephrasing your question about task management."
          }
        }]
      };
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
    
    let errorMessage = 'Failed to get response from AI service';
    
    // Provide more specific error messages based on HTTP status
    if (error.status === 400) {
      errorMessage = 'Invalid request to AI service';
    } else if (error.status === 401 || error.status === 403) {
      errorMessage = 'Authentication error with AI service';
    } else if (error.status === 429) {
      errorMessage = 'Rate limit exceeded for AI service';
    } else if (error.status >= 500) {
      errorMessage = 'AI service is currently unavailable';
    }
    
    return throwError(() => new Error(errorMessage));
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
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.CACHE_EXPIRY_MS) {
        this.cache.delete(key);
      }
    }
  }
}
