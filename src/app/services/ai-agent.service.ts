import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

interface AiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

@Injectable({ providedIn: 'root' })
export class AiAgentService {
  private apiUrl = environment.aiApiUrl;
  private apiKey = environment.aiApiKey;

  async sendPrompt(prompt: string): Promise<any> {
    if (!this.apiUrl || !this.apiKey) {
      console.warn('AI API not configured');
      return null;
    }

    if (!prompt || typeof prompt !== 'string') {
      console.error('Invalid prompt provided');
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
        const errorText = await response.text();
        console.error('AI request failed:', response.status, errorText);
        return null;
      }

      const data: AiResponse = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        console.warn('AI response did not contain expected text format');
        return null;
      }

      try {
        return JSON.parse(text);
      } catch (parseError) {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            return JSON.parse(match[0]);
          } catch {
            /* ignore */
          }
        }
        console.warn('Failed to parse AI response as JSON, returning raw text:', parseError);
        return text;
      }
    } catch (err) {
      console.error('AI request error:', err);
      return null;
    }
  }
}
