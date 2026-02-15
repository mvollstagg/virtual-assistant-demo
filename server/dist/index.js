import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { getChatProvider } from './providers/chat/index.js';
import { getSttProvider } from './providers/stt/index.js';
import { getTtsProvider } from './providers/tts/index.js';
const app = express();
const port = Number(process.env.SERVER_PORT || 5000);
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.get('/api/health', (_, res) => res.json({ ok: true }));
app.post('/api/chat', async (req, res) => {
    try {
        const body = req.body;
        const provider = getChatProvider(body.provider);
        const text = await provider.generateChatResponse(body.messages, body.provider);
        res.json({ text });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/api/stt', async (req, res) => {
    try {
        const body = req.body;
        const provider = getSttProvider(body.provider);
        const text = await provider.transcribeSpeech(body);
        res.json({ text });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/api/tts', async (req, res) => {
    try {
        const body = req.body;
        const provider = getTtsProvider(body.provider);
        const result = await provider.synthesizeSpeech(body);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
