export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}
export interface StackAIResponse {
    content: string;
    error?: string;
}
export declare class StackAIService {
    private apiKey;
    private apiUrl;
    constructor();
    sendMessage(messages: ChatMessage[]): Promise<StackAIResponse>;
    sendMessageStream(messages: ChatMessage[]): AsyncGenerator<string>;
}
export declare const stackAIService: StackAIService;
//# sourceMappingURL=stackAIService.d.ts.map