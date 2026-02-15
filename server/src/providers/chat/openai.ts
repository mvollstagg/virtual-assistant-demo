import OpenAI from 'openai';
import { ChatMessage, ChatProvider, ProviderConfig } from '../../types.js';

export const openAiChatProvider: ChatProvider = {
  async generateChatResponse(messages: ChatMessage[], config: ProviderConfig): Promise<string> {
    const client = new OpenAI({ apiKey: config.apiKey, baseURL: config.baseUrl || undefined });
    const completion = await client.chat.completions.create({
      model: config.model || 'gpt-4o-mini',
      messages: messages.map((m) => ({ role: m.role, content: m.content }))
    });
    return completion.choices[0]?.message?.content || 'No response';
  }
};
