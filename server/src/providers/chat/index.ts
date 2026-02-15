import { ChatProvider, ProviderConfig } from '../../types.js';
import { azureChatProvider } from './azure.js';
import { geminiChatProvider } from './gemini.js';
import { localChatProvider } from './local.js';
import { mockChatProvider } from './mock.js';
import { openAiChatProvider } from './openai.js';

const providerMap: Record<string, ChatProvider> = {
  openai: openAiChatProvider,
  gemini: geminiChatProvider,
  azure: azureChatProvider,
  local: localChatProvider,
  mock: mockChatProvider
};

export const getChatProvider = (config: ProviderConfig): ChatProvider => providerMap[config.type] || mockChatProvider;
