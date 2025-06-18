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
  private endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  private apiKey = environment.geminiApiKey;

  constructor(private http: HttpClient) {}

  send(messages: ChatMessage[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body = {
      contents: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))
    };
    const url = `${this.endpoint}?key=${this.apiKey}`;
    return this.http.post<any>(url, body, { headers });
  }
}
