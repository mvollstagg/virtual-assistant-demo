import { azureTtsProvider } from './azure.js';
import { deepgramTtsProvider } from './deepgram.js';
import { geminiTtsProvider } from './gemini.js';
import { localTtsProvider } from './local.js';
import { mockTtsProvider } from './mock.js';
const map = {
    azure: azureTtsProvider,
    deepgram: deepgramTtsProvider,
    gemini: geminiTtsProvider,
    local: localTtsProvider,
    mock: mockTtsProvider,
    browser: mockTtsProvider
};
export const getTtsProvider = (config) => map[config.type] || mockTtsProvider;
