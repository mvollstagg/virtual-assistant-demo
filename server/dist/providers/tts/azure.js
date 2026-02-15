import sdk from 'microsoft-cognitiveservices-speech-sdk';
import { blendshapeNames } from '../../utils/blendshapeNames.js';
const SSML = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-US"><voice name="en-US-JennyNeural"><mstts:viseme type="FacialExpression"/>__TEXT__</voice></speak>`;
export const azureTtsProvider = {
    async synthesizeSpeech(input) {
        const key = input.provider.apiKey || process.env.AZURE_KEY;
        const region = input.provider.baseUrl || process.env.AZURE_REGION;
        if (!key || !region)
            throw new Error('Azure TTS requires key and region (use baseUrl as region in settings)');
        return await new Promise((resolve, reject) => {
            const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
            speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;
            if (input.voice)
                speechConfig.speechSynthesisVoiceName = input.voice;
            const blendData = [];
            const chunks = [];
            let timeStamp = 0;
            const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
            synthesizer.synthesizing = (_, event) => {
                chunks.push(event.result.audioData);
            };
            synthesizer.visemeReceived = (_, e) => {
                if (!e.animation)
                    return;
                const animation = JSON.parse(e.animation);
                for (const blendArray of animation.BlendShapes || []) {
                    const blendshapes = {};
                    blendshapeNames.forEach((shape, i) => (blendshapes[shape] = blendArray[i] || 0));
                    blendData.push({ time: timeStamp, blendshapes });
                    timeStamp += 1 / 60;
                }
            };
            synthesizer.speakSsmlAsync(SSML.replace('__TEXT__', input.text), () => {
                synthesizer.close();
                const merged = Buffer.concat(chunks.map((a) => Buffer.from(a)));
                resolve({ audioBase64: merged.toString('base64'), mimeType: 'audio/mpeg', blendData });
            }, (error) => {
                synthesizer.close();
                reject(error);
            });
        });
    }
};
