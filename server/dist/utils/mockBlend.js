import { blendshapeNames } from './blendshapeNames.js';
export const createMockBlendData = (text) => {
    const steps = Math.max(45, Math.min(200, text.length * 3));
    return Array.from({ length: steps }).map((_, i) => {
        const t = i / 60;
        const mouth = Math.max(0, Math.sin(i * 0.35)) * 0.65;
        const smile = Math.max(0, Math.sin(i * 0.08)) * 0.4;
        const blendshapes = Object.fromEntries(blendshapeNames.map((name) => [name, 0]));
        blendshapes.jawOpen = mouth;
        blendshapes.mouthFunnel = mouth * 0.35;
        blendshapes.mouthSmileLeft = smile;
        blendshapes.mouthSmileRight = smile;
        return { time: t, blendshapes };
    });
};
