import { createMockBlendData } from '../../utils/mockBlend.js';
export const mockTtsProvider = {
    async synthesizeSpeech(input) {
        return { text: input.text, blendData: createMockBlendData(input.text) };
    }
};
