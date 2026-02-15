export type ProviderType = 'openai' | 'gemini' | 'deepgram' | 'azure' | 'local' | 'mock' | 'browser';

export interface ProviderConfig {
  type: ProviderType;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

export interface AppSettings {
  chat: ProviderConfig;
  stt: ProviderConfig;
  tts: ProviderConfig;
  systemPrompt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const defaultSettings: AppSettings = {
  chat: { type: 'mock', model: 'gpt-4o-mini' },
  stt: { type: 'browser' },
  tts: { type: 'browser' },
  systemPrompt: 'You are a helpful virtual assistant in a product demo.'
};
