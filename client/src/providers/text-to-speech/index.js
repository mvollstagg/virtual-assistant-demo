import axios from 'axios';
const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
export async function synthesizeSpeech(text, provider) {
    if (provider.type === 'browser')
        return { text };
    const response = await axios.post(`${serverUrl}/api/tts`, { provider, text });
    return response.data;
}
