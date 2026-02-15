import OpenAI from 'openai';
export const azureChatProvider = {
    async generateChatResponse(messages, config) {
        const client = new OpenAI({
            apiKey: config.apiKey,
            baseURL: config.baseUrl
        });
        const completion = await client.chat.completions.create({
            model: config.model || 'gpt-4o-mini',
            messages
        });
        return completion.choices[0]?.message?.content || 'No response';
    }
};
