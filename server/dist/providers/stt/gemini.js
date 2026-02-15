export const geminiSttProvider = {
    async transcribeSpeech(input) {
        if (!input.provider.baseUrl) {
            throw new Error('Gemini STT requires baseUrl to a speech endpoint in this demo');
        }
        const response = await fetch(input.provider.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${input.provider.apiKey}` },
            body: JSON.stringify({ audioBase64: input.audioBase64, mimeType: input.mimeType, model: input.provider.model })
        });
        if (!response.ok)
            throw new Error(`Gemini STT failed ${response.status}`);
        const data = await response.json();
        return data.text || data.transcript || 'No transcript';
    }
};
