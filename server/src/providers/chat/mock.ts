import { ChatProvider, ChatMessage, ProviderConfig } from '../../types.js';

export const mockChatProvider: ChatProvider = {
  async generateChatResponse(messages: ChatMessage[]): Promise<string> {
    const last = [...messages].reverse().find((m) => m.role === 'user')?.content ?? 'Hello';
    return `Demo response: I heard \"${last}\". This is a mock provider so the app runs without API keys.`;
  }
};
