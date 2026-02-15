export function createFallbackBlendData(text) {
    const words = text.trim().split(/\s+/).filter(Boolean).length || 1;
    const durationSec = Math.max(1.2, words * 0.22);
    const fps = 60;
    const totalFrames = Math.max(12, Math.floor(durationSec * fps));
    const frames = [];
    for (let i = 0; i < totalFrames; i++) {
        const t = i / fps;
        const pulse = (Math.sin(i * 0.7) + 1) / 2;
        const jawOpen = 0.08 + pulse * 0.45;
        const mouthClose = 0.25 - pulse * 0.2;
        const smile = 0.03 + pulse * 0.07;
        const pucker = (Math.sin(i * 0.25 + 1.4) + 1) * 0.06;
        frames.push({
            time: t,
            blendshapes: {
                jawOpen,
                mouthClose: Math.max(0, mouthClose),
                mouthSmileLeft: smile,
                mouthSmileRight: smile,
                mouthFunnel: pucker * 0.7,
                mouthPucker: pucker
            }
        });
    }
    return frames;
}
