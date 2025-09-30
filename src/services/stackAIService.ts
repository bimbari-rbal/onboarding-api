import { config } from '../config/env';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface StackAIResponse {
  content: string;
  error?: string;
}

export class StackAIService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = config.stackAI.apiKey;
    this.apiUrl = config.stackAI.apiUrl;
  }

  async sendMessage(messages: ChatMessage[]): Promise<StackAIResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          messages,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as any;
        throw new Error(errorData.error || `Stack AI API error: ${response.status}`);
      }

      const data = await response.json() as any;
      return {
        content: data.content || data.message || ''
      };
    } catch (error) {
      console.error('Stack AI service error:', error);
      return {
        content: '',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async *sendMessageStream(messages: ChatMessage[]): AsyncGenerator<string> {
    try {
      const response = await fetch(`${this.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          messages,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`Stack AI API error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            if (data === '[DONE]') {
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content || parsed.delta) {
                yield parsed.content || parsed.delta;
              }
            } catch (e) {
              yield data;
            }
          }
        }
      }
    } catch (error) {
      console.error('Stack AI streaming error:', error);
      throw error;
    }
  }
}

export const stackAIService = new StackAIService();