import { SpeechToTextProvider, SttRequest } from '../../types.js';

export const deepgramSttProvider: SpeechToTextProvider = {
  async transcribeSpeech(input: SttRequest): Promise<string> {
    if (!input.provider.apiKey) throw new Error('Deepgram STT requires apiKey');

    const endpoint = input.provider.baseUrl || 'https://api.deepgram.com/v1/listen';
    const model = input.provider.model || 'nova-3';
    const url = new URL(endpoint);
    if (!url.searchParams.has('model')) url.searchParams.set('model', model);
    if (!url.searchParams.has('smart_format')) url.searchParams.set('smart_format', 'true');

    const audioBuffer = Buffer.from(input.audioBase64, 'base64');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Token ${input.provider.apiKey}`,
        'Content-Type': input.mimeType || 'audio/webm'
      },
      body: audioBuffer
    });

    if (!response.ok) throw new Error(`Deepgram STT failed ${response.status}`);
    const data = await response.json() as any;
    return data?.results?.channels?.[0]?.alternatives?.[0]?.transcript || 'No transcript';
  }
};
