import axios from 'axios';
import { Message, ProviderConfig } from '../../types';

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

export async function generateChatResponse(messages: Message[], provider: ProviderConfig, systemPrompt: string): Promise<string> {
  if (provider.type === 'mock') {
    const latest = messages.at(-1)?.content ?? '';
    return `Mock assistant: you said \"${latest}\".`;
  }

  const payload = {
    provider,
    messages: [{ role: 'system', content: systemPrompt }, ...messages.map((m) => ({ role: m.role, content: m.content }))]
  };

  const response = await axios.post(`${serverUrl}/api/chat`, payload);
  return response.data.text;
}
