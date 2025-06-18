import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AiAgentService {
  async sendPrompt(prompt: string): Promise<string> {
    if (!prompt || typeof prompt !== 'string') {
      return "I couldn't process that message. Please try again.";
    }

    // Simple placeholder response that echoes the prompt.
    return `Echo: ${prompt}`;
  }
}
