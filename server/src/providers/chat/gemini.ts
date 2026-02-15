import { ChatMessage, ChatProvider, ProviderConfig } from '../../types.js';

export const geminiChatProvider: ChatProvider = {
  async generateChatResponse(messages: ChatMessage[], config: ProviderConfig): Promise<string> {
    const endpoint = config.baseUrl || 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model || 'gemini-1.5-flash',
        messages
      })
    });
    if (!response.ok) throw new Error(`Gemini chat failed: ${response.status}`);
    const data = await response.json() as any;
    return data.choices?.[0]?.message?.content || 'No response';
  }
};
