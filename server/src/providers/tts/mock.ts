import { TextToSpeechProvider, TtsRequest } from '../../types.js';
import { createMockBlendData } from '../../utils/mockBlend.js';

export const mockTtsProvider: TextToSpeechProvider = {
  async synthesizeSpeech(input: TtsRequest) {
    return { text: input.text, blendData: createMockBlendData(input.text) };
  }
};
