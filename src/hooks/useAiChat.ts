import { useState, useCallback } from 'react';
import { aiApi } from '../api';
import { ChatMessage, ChatWithAIRequest, Conversation } from '../types';

interface UseAiChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  currentConversationId: string | null;
  conversations: Conversation[];
  sendMessage: (message: string) => Promise<void>;
  loadConversations: () => Promise<void>;
  loadConversationMessages: (conversationId: string) => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
}

export const useAiChat = (): UseAiChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const request: ChatWithAIRequest = {
        message,
        conversationId: currentConversationId || undefined,
      };

      const response = await aiApi.chatWithAI(request);

      const aiMessage: ChatMessage = {
        text: response.response,
        isUser: false,
        timestamp: response.timestamp,
        id: response.messageId,
      };

      setMessages(prev => [...prev, aiMessage]);
      setCurrentConversationId(response.conversationId);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'AI 응답을 받는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId]);

  const loadConversations = useCallback(async () => {
    try {
      setError(null);
      const response = await aiApi.getConversations();
      setConversations(response.conversations);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || '대화 목록을 불러오는 중 오류가 발생했습니다.');
    }
  }, []);

  const loadConversationMessages = useCallback(async (conversationId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await aiApi.getConversationMessages(conversationId);
      
      const chatMessages: ChatMessage[] = response.messages.map(msg => ({
        text: msg.content,
        isUser: msg.role === 'user',
        timestamp: msg.createdAt,
        id: msg.id,
      }));

      setMessages(chatMessages);
      setCurrentConversationId(conversationId);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || '대화 내용을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentConversationId(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    currentConversationId,
    conversations,
    sendMessage,
    loadConversations,
    loadConversationMessages,
    clearMessages,
    clearError,
  };
};
