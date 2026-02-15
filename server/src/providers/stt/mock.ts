import { SpeechToTextProvider, SttRequest } from '../../types.js';

export const mockSttProvider: SpeechToTextProvider = {
  async transcribeSpeech(_: SttRequest): Promise<string> {
    return 'Mock transcription from demo mode microphone input.';
  }
};
