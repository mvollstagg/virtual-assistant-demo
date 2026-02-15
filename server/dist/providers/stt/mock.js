export const mockSttProvider = {
    async transcribeSpeech(_) {
        return 'Mock transcription from demo mode microphone input.';
    }
};
