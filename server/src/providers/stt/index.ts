import { ProviderConfig, SpeechToTextProvider } from '../../types.js';
import { deepgramSttProvider } from './deepgram.js';
import { geminiSttProvider } from './gemini.js';
import { localSttProvider } from './local.js';
import { mockSttProvider } from './mock.js';

const map: Record<string, SpeechToTextProvider> = {
  deepgram: deepgramSttProvider,
  gemini: geminiSttProvider,
  local: localSttProvider,
  mock: mockSttProvider,
  browser: mockSttProvider
};

export const getSttProvider = (config: ProviderConfig): SpeechToTextProvider => map[config.type] || mockSttProvider;
