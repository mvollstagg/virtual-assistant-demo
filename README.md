# Virtual Assistant Demo (Talking Avatar + Chat)

Monorepo with:
- `client`: React + Vite + Tailwind + DaisyUI + Three.js avatar
- `server`: Express provider router for chat/stt/tts
- `demo-assets`: original avatar client/backend assets retained and integrated

## Quick start
1. `cp .env.example .env`
2. `npm install`
3. `npm run dev`
4. Open `http://localhost:5173`

Default settings use `mock` chat and browser STT/TTS so no API keys are required.

## Provider configuration
Use **Settings** in the UI to configure chat, speech-to-text, and text-to-speech providers independently.

Supported provider types:
- `mock`: local demo responses, no keys needed
- `openai`: OpenAI-compatible chat
- `gemini`: Gemini-compatible endpoints
- `azure`: Azure OpenAI (chat) and Azure Speech (tts)
- `local`: any custom local endpoint
- `browser`: browser-native speech APIs (stt/tts)

## API routes
- `POST /api/chat`
- `POST /api/stt`
- `POST /api/tts`
- `GET /api/health`

## Add a new provider
1. Add a file under `server/src/providers/{chat|stt|tts}` implementing shared interface.
2. Register it in the corresponding `index.ts` map.
3. Add provider option in `client/src/components/SettingsPanel.tsx`.
