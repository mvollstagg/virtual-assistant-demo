import { TextToSpeechProvider, TtsRequest } from '../../types.js';

export const localTtsProvider: TextToSpeechProvider = {
  async synthesizeSpeech(input: TtsRequest) {
    if (!input.provider.baseUrl) throw new Error('Local TTS requires baseUrl');
    const response = await fetch(input.provider.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(input.provider.apiKey ? { Authorization: `Bearer ${input.provider.apiKey}` } : {}) },
      body: JSON.stringify({ text: input.text, voice: input.voice, model: input.provider.model })
    });
    if (!response.ok) throw new Error(`Local TTS failed ${response.status}`);
    return await response.json();
  }
};
