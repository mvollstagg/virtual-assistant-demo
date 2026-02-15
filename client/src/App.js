import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from 'react';
import { AvatarCanvas } from './components/AvatarCanvas';
import { SettingsPanel } from './components/SettingsPanel';
import { createFallbackBlendData } from './lib/fallbackBlend';
import { generateChatResponse } from './providers/chat';
import { transcribeSpeech } from './providers/speech-to-text';
import { synthesizeSpeech } from './providers/text-to-speech';
import { defaultSettings } from './types';
const STORAGE_KEY = 'va-demo-settings';
export default function App() {
    const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || defaultSettings);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [openSettings, setOpenSettings] = useState(false);
    const [blendData, setBlendData] = useState([]);
    const [playing, setPlaying] = useState(false);
    const chatBottomRef = useRef(null);
    useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)), [settings]);
    useEffect(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, loading]);
    async function submitUserText(text) {
        if (!text.trim() || loading)
            return;
        const userMessage = { id: crypto.randomUUID(), role: 'user', content: text };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        try {
            const responseText = await generateChatResponse([...messages, userMessage], settings.chat, settings.systemPrompt);
            const assistantMessage = { id: crypto.randomUUID(), role: 'assistant', content: responseText };
            setMessages((prev) => [...prev, assistantMessage]);
            await speak(responseText);
        }
        catch (error) {
            setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: `Error: ${error.message}` }]);
        }
        finally {
            setLoading(false);
        }
    }
    async function speak(text) {
        const result = await synthesizeSpeech(text, settings.tts);
        setBlendData(result.blendData?.length ? result.blendData : createFallbackBlendData(text));
        if (settings.tts.type === 'browser' || !result.audioBase64) {
            setPlaying(true);
            await new Promise((resolve) => {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.onend = () => { setPlaying(false); resolve(); };
                speechSynthesis.speak(utterance);
            });
            return;
        }
        setPlaying(true);
        await new Promise((resolve) => {
            const audio = new Audio(`data:${result.mimeType || 'audio/mpeg'};base64,${result.audioBase64}`);
            audio.onended = () => { setPlaying(false); resolve(); };
            audio.play();
        });
    }
    async function handleMic() {
        if (settings.stt.type === 'browser') {
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SR)
                return alert('SpeechRecognition not supported in this browser');
            const recognition = new SR();
            recognition.lang = 'en-US';
            recognition.onresult = (e) => submitUserText(e.results[0][0].transcript);
            recognition.start();
            return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks = [];
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.start();
        setTimeout(() => recorder.stop(), 3000);
        recorder.onstop = async () => {
            stream.getTracks().forEach((t) => t.stop());
            const blob = new Blob(chunks, { type: 'audio/webm' });
            const text = await transcribeSpeech(blob, settings.stt);
            await submitUserText(text);
        };
    }
    const hasMessages = useMemo(() => messages.length > 0, [messages]);
    return (_jsxs("div", { className: "min-h-screen bg-base-200 p-4 md:p-8", children: [_jsx(SettingsPanel, { open: openSettings, settings: settings, onClose: () => setOpenSettings(false), onSave: setSettings }), _jsxs("div", { className: "max-w-6xl mx-auto grid lg:grid-cols-2 gap-4", children: [_jsxs("div", { className: "card bg-base-100 shadow-xl p-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-3", children: [_jsx("h1", { className: "text-xl font-bold", children: "Virtual Assistant Demo" }), _jsx("button", { className: "btn btn-sm", onClick: () => setOpenSettings(true), children: "Settings" })] }), _jsx(AvatarCanvas, { speakingBlendData: blendData, playing: playing })] }), _jsxs("div", { className: "card bg-base-100 shadow-xl p-4 h-[80vh]", children: [_jsxs("div", { className: "flex-1 overflow-y-auto space-y-3", children: [!hasMessages && _jsx("div", { className: "alert", children: "Say hi by typing or using the microphone." }), messages.map((m) => (_jsx("div", { className: `chat ${m.role === 'user' ? 'chat-end' : 'chat-start'}`, children: _jsx("div", { className: `chat-bubble ${m.role === 'user' ? 'chat-bubble-primary' : ''}`, children: m.content }) }, m.id))), loading && _jsx("span", { className: "loading loading-dots loading-lg" }), _jsx("div", { ref: chatBottomRef })] }), _jsxs("div", { className: "mt-3 flex gap-2", children: [_jsx("input", { className: "input input-bordered flex-1", value: input, onChange: (e) => setInput(e.target.value), placeholder: "Type your message", onKeyDown: (e) => e.key === 'Enter' && submitUserText(input) }), _jsx("button", { className: "btn btn-primary", onClick: () => submitUserText(input), disabled: loading, children: "Send" }), _jsx("button", { className: "btn", onClick: handleMic, children: "\uD83C\uDFA4" })] })] })] })] }));
}
