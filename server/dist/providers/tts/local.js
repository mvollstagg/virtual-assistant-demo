export const localTtsProvider = {
    async synthesizeSpeech(input) {
        if (!input.provider.baseUrl)
            throw new Error('Local TTS requires baseUrl');
        const response = await fetch(input.provider.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(input.provider.apiKey ? { Authorization: `Bearer ${input.provider.apiKey}` } : {}) },
            body: JSON.stringify({ text: input.text, voice: input.voice, model: input.provider.model })
        });
        if (!response.ok)
            throw new Error(`Local TTS failed ${response.status}`);
        return await response.json();
    }
};
