import { AppSettings, ProviderConfig, ProviderType } from '../types';

const chatProviderOptions: ProviderType[] = ['mock', 'openai', 'gemini', 'azure', 'local'];
const speechProviderOptions: ProviderType[] = ['mock', 'deepgram', 'gemini', 'azure', 'local', 'browser'];

function ProviderEditor({ label, config, onChange, options }: { label: string; config: ProviderConfig; onChange: (next: ProviderConfig) => void; options: ProviderType[] }) {
  return (
    <div className="space-y-2 border border-base-300 rounded-box p-3">
      <h4 className="font-semibold">{label}</h4>
      <select className="select select-bordered w-full" value={config.type} onChange={(e) => onChange({ ...config, type: e.target.value as ProviderType })}>
        {options.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
      <input className="input input-bordered w-full" placeholder="API key" value={config.apiKey || ''} onChange={(e) => onChange({ ...config, apiKey: e.target.value })} />
      <input className="input input-bordered w-full" placeholder="Base URL / region" value={config.baseUrl || ''} onChange={(e) => onChange({ ...config, baseUrl: e.target.value })} />
      <input className="input input-bordered w-full" placeholder="Model" value={config.model || ''} onChange={(e) => onChange({ ...config, model: e.target.value })} />
    </div>
  );
}

export function SettingsPanel({ open, settings, onClose, onSave }: { open: boolean; settings: AppSettings; onClose: () => void; onSave: (next: AppSettings) => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="w-full max-w-md bg-base-100 h-full p-4 overflow-y-auto space-y-4">
        <div className="flex justify-between items-center"><h3 className="text-xl font-bold">Settings</h3><button className="btn btn-sm" onClick={onClose}>Close</button></div>
        <ProviderEditor label="Chat provider" options={chatProviderOptions} config={settings.chat} onChange={(chat) => onSave({ ...settings, chat })} />
        <ProviderEditor label="Speech-to-text provider" options={speechProviderOptions} config={settings.stt} onChange={(stt) => onSave({ ...settings, stt })} />
        <ProviderEditor label="Text-to-speech provider" options={speechProviderOptions} config={settings.tts} onChange={(tts) => onSave({ ...settings, tts })} />
        <textarea className="textarea textarea-bordered w-full" rows={4} value={settings.systemPrompt} onChange={(e) => onSave({ ...settings, systemPrompt: e.target.value })} />
      </div>
    </div>
  );
}
