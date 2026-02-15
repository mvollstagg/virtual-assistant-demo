import { useEffect, useMemo, useRef, useState } from 'react';
import { AvatarCanvas } from './components/AvatarCanvas';
import { SettingsPanel } from './components/SettingsPanel';
import { createFallbackBlendData } from './lib/fallbackBlend';
import { generateChatResponse } from './providers/chat';
import { transcribeSpeech } from './providers/speech-to-text';
import { synthesizeSpeech } from './providers/text-to-speech';
import { AppSettings, defaultSettings, Message } from './types';

const STORAGE_KEY = 'va-demo-settings';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(() => JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || defaultSettings);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [blendData, setBlendData] = useState<Array<{ time: number; blendshapes: Record<string, number> }>>([]);
  const [playing, setPlaying] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)), [settings]);
  useEffect(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, loading]);

  async function submitUserText(text: string) {
    if (!text.trim() || loading) return;
    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await generateChatResponse([...messages, userMessage], settings.chat, settings.systemPrompt);
      const assistantMessage: Message = { id: crypto.randomUUID(), role: 'assistant', content: responseText };
      setMessages((prev) => [...prev, assistantMessage]);
      await speak(responseText);
    } catch (error) {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: `Error: ${(error as Error).message}` }]);
    } finally {
      setLoading(false);
    }
  }

  async function speak(text: string) {
    const result = await synthesizeSpeech(text, settings.tts);

    if (settings.tts.type === 'browser' || !result.audioBase64) {
      setBlendData(result.blendData?.length ? result.blendData : createFallbackBlendData(text));
      await new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setPlaying(true);
        utterance.onend = () => { setPlaying(false); resolve(); };
        speechSynthesis.speak(utterance);
      });
      return;
    }

    await new Promise<void>((resolve) => {
      const audio = new Audio(`data:${result.mimeType || 'audio/mpeg'};base64,${result.audioBase64}`);
      audio.onloadedmetadata = () => {
        if (result.blendData?.length) {
          setBlendData(result.blendData);
        } else {
          const duration = Number.isFinite(audio.duration) ? audio.duration : undefined;
          setBlendData(createFallbackBlendData(text, duration));
        }
      };
      audio.onplay = () => setPlaying(true);
      audio.onended = () => { setPlaying(false); resolve(); };
      audio.play().catch(() => {
        setPlaying(false);
        resolve();
      });
    });
  }

  async function handleMic() {
    if (settings.stt.type === 'browser') {
      const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SR) return alert('SpeechRecognition not supported in this browser');
      const recognition = new SR();
      recognition.lang = 'en-US';
      recognition.onresult = (e: any) => submitUserText(e.results[0][0].transcript);
      recognition.start();
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];
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

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <SettingsPanel open={openSettings} settings={settings} onClose={() => setOpenSettings(false)} onSave={setSettings} />
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-4">
        <div className="card bg-base-100 shadow-xl p-4">
          <div className="flex justify-between items-center mb-3"><h1 className="text-xl font-bold">Virtual Assistant Demo</h1><button className="btn btn-sm" onClick={() => setOpenSettings(true)}>Settings</button></div>
          <AvatarCanvas speakingBlendData={blendData} playing={playing} />
        </div>

        <div className="card bg-base-100 shadow-xl p-4 h-[80vh]">
          <div className="flex-1 overflow-y-auto space-y-3">
            {!hasMessages && <div className="alert">Say hi by typing or using the microphone.</div>}
            {messages.map((m) => (
              <div key={m.id} className={`chat ${m.role === 'user' ? 'chat-end' : 'chat-start'}`}>
                <div className={`chat-bubble ${m.role === 'user' ? 'chat-bubble-primary' : ''}`}>{m.content}</div>
              </div>
            ))}
            {loading && <span className="loading loading-dots loading-lg" />}
            <div ref={chatBottomRef} />
          </div>
          <div className="mt-3 flex gap-2">
            <input className="input input-bordered flex-1" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message" onKeyDown={(e) => e.key === 'Enter' && submitUserText(input)} />
            <button className="btn btn-primary" onClick={() => submitUserText(input)} disabled={loading}>Send</button>
            <button className="btn" onClick={handleMic}>🎤</button>
          </div>
        </div>
      </div>
    </div>
  );
}
