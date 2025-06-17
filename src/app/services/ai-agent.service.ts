import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

interface AiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
    finishReason?: string;
  }>;
}

@Injectable({ providedIn: 'root' })
export class AiAgentService {
  private apiUrl = environment.aiApiUrl;
  private apiKey = environment.aiApiKey;

  async sendPrompt(prompt: string): Promise<any> {
    if (!this.apiUrl || !this.apiKey) {
      console.error('AI API not configured. Check environment variables.');
      return "I'm sorry, I'm not configured properly. Please contact support.";
    }

    if (!prompt || typeof prompt !== 'string') {
      console.error('Invalid prompt provided');
      return "I couldn't process that message. Please try again.";
    }

    try {
      const url = `${this.apiUrl}?key=${this.apiKey}`;
      const body = {
        contents: [{ 
          parts: [{ text: prompt }] 
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024
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
      
      console.log('Sending request to AI API...', this.apiUrl);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('AI request failed:', response.status, errorData);
        return `Sorry, I couldn't process your request (${errorData?.error?.message || `Error ${response.status}`}).`;
      }

      const data: AiResponse = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        console.warn('AI response did not contain any candidates');
        return "I received an empty response. Please try again.";
      }
      
      const text = data.candidates[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        console.warn('AI response did not contain expected text format');
        return "I received a response but couldn't find any text. Please try again.";
      }

      // First try to parse as JSON
      try {
        return JSON.parse(text);
      } catch (parseError) {
        // If not valid JSON, just return the text response
        return text;
      }
    } catch (err) {
      console.error('AI request error:', err);
      return "Sorry, there was an error processing your request. Please try again later.";
    }
  }
}
