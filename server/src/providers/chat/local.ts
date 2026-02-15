import { ChatMessage, ChatProvider, ProviderConfig } from '../../types.js';

export const localChatProvider: ChatProvider = {
  async generateChatResponse(messages: ChatMessage[], config: ProviderConfig): Promise<string> {
    if (!config.baseUrl) throw new Error('Local chat provider requires baseUrl');
    const response = await fetch(config.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}) },
      body: JSON.stringify({ messages, model: config.model })
    });
    if (!response.ok) throw new Error(`Local chat failed: ${response.status}`);
    const data = await response.json() as any;
    return data.text || data.output || data.message || JSON.stringify(data);
  }
};
