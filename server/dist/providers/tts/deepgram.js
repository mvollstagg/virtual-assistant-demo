export const deepgramTtsProvider = {
    async synthesizeSpeech(input) {
        if (!input.provider.apiKey)
            throw new Error('Deepgram TTS requires apiKey');
        const endpoint = input.provider.baseUrl || 'https://api.deepgram.com/v1/speak';
        const model = input.provider.model || 'aura-2-thalia-en';
        const url = new URL(endpoint);
        if (!url.searchParams.has('model'))
            url.searchParams.set('model', model);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Token ${input.provider.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: input.text })
        });
        if (!response.ok)
            throw new Error(`Deepgram TTS failed ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();
        const mimeType = response.headers.get('content-type') || 'audio/wav';
        return { audioBase64: Buffer.from(arrayBuffer).toString('base64'), mimeType };
    }
};
