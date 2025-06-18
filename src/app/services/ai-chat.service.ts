import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  private endpoint = 'https://api.deepseek.com/chat/completions';
  private apiKey = environment.deepSeekApiKey;

  constructor(private http: HttpClient) {}

  send(messages: ChatMessage[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });
    const body = { model: 'deepseek-chat', messages };
    return this.http.post<any>(this.endpoint, body, { headers });
  }
}
