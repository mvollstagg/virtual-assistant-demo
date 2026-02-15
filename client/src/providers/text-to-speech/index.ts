import axios from 'axios';
import { ProviderConfig } from '../../types';

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

export interface TtsResult {
  audioBase64?: string;
  mimeType?: string;
  blendData?: Array<{ time: number; blendshapes: Record<string, number> }>;
  text?: string;
}

export async function synthesizeSpeech(text: string, provider: ProviderConfig): Promise<TtsResult> {
  if (provider.type === 'browser') return { text };
  const response = await axios.post(`${serverUrl}/api/tts`, { provider, text });
  return response.data;
}
