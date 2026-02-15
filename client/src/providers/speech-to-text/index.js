import axios from 'axios';
const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
export async function transcribeSpeech(blob, provider) {
    if (provider.type === 'browser') {
        throw new Error('Use browser speech recognition path for browser provider');
    }
    const base64 = await blobToBase64(blob);
    const response = await axios.post(`${serverUrl}/api/stt`, {
        provider,
        audioBase64: base64,
        mimeType: blob.type
    });
    return response.data.text;
}
function blobToBase64(blob) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(String(reader.result).split(',')[1]);
        reader.readAsDataURL(blob);
    });
}
