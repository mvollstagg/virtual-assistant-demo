export const geminiTtsProvider = {
    async synthesizeSpeech(input) {
        if (!input.provider.baseUrl)
            throw new Error('Gemini TTS requires baseUrl in this demo');
        const response = await fetch(input.provider.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${input.provider.apiKey}` },
            body: JSON.stringify({ text: input.text, voice: input.voice, model: input.provider.model })
        });
        if (!response.ok)
            throw new Error(`Gemini TTS failed ${response.status}`);
        return await response.json();
    }
};
