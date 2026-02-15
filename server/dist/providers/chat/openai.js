import OpenAI from 'openai';
export const openAiChatProvider = {
    async generateChatResponse(messages, config) {
        const client = new OpenAI({ apiKey: config.apiKey, baseURL: config.baseUrl || undefined });
        const completion = await client.chat.completions.create({
            model: config.model || 'gpt-4o-mini',
            messages: messages.map((m) => ({ role: m.role, content: m.content }))
        });
        return completion.choices[0]?.message?.content || 'No response';
    }
};
