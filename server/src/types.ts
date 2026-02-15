export type ProviderKind = 'openai' | 'gemini' | 'deepgram' | 'azure' | 'local' | 'mock' | 'browser';

export interface ProviderConfig {
  type: ProviderKind;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  provider: ProviderConfig;
}

export interface TtsRequest {
  text: string;
  provider: ProviderConfig;
  voice?: string;
}

export interface SttRequest {
  audioBase64: string;
  mimeType?: string;
  provider: ProviderConfig;
}

export interface ChatProvider {
  generateChatResponse(messages: ChatMessage[], config: ProviderConfig): Promise<string>;
}

export interface SpeechToTextProvider {
  transcribeSpeech(input: SttRequest): Promise<string>;
}

export interface TextToSpeechResult {
  audioBase64?: string;
  mimeType?: string;
  blendData?: Array<{ time: number; blendshapes: Record<string, number> }>;
  text?: string;
}

export interface TextToSpeechProvider {
  synthesizeSpeech(input: TtsRequest): Promise<TextToSpeechResult>;
}
