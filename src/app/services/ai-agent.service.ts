import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AiAgentService {
  private apiUrl = environment.aiApiUrl;
  private apiKey = environment.aiApiKey;

  async sendPrompt(prompt: string): Promise<any> {
    if (!this.apiUrl || !this.apiKey) {
      console.warn('AI API not configured');
      return null;
    }

    try {
      const url = `${this.apiUrl}?key=${this.apiKey}`;
      const body = {
        contents: [{ parts: [{ text: prompt }] }]
      };
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        console.error('AI request failed', response.statusText);
        return null;
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return text ? JSON.parse(text) : data;
    } catch (err) {
      console.error('AI request error', err);
      return null;
    }
  }
}
