import { privateApi, publicApi } from './index';
import {
  ChatWithAIRequest,
  ChatWithAIResponse,
  ConversationListResponse,
  ConversationMessagesResponse,
  EcoTipResponse,
  ImageVerificationRequest,
  ImageVerificationResponse,
  EcoEducationContentRequest,
  EcoEducationContentResponse,
} from '../types';

class AiApiService {
  async chatWithAI(request: ChatWithAIRequest): Promise<ChatWithAIResponse> {
    const response = await privateApi.post<ChatWithAIResponse>('/ai/chat', request);
    return response.data;
  }

  async getConversations(): Promise<ConversationListResponse> {
    const response = await privateApi.get<ConversationListResponse>('/ai/conversations');
    return response.data;
  }

  async getConversationMessages(
    conversationId: string,
    limit?: number,
    offset?: number
  ): Promise<ConversationMessagesResponse> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    const response = await privateApi.get<ConversationMessagesResponse>(
      `/ai/conversations/${conversationId}/messages?${params.toString()}`
    );
    return response.data;
  }

  async generateEcoTip(): Promise<EcoTipResponse> {
    const response = await publicApi.get<EcoTipResponse>('/ai/eco-tip');
    return response.data;
  }

  async verifyImage(request: ImageVerificationRequest): Promise<ImageVerificationResponse> {
    const response = await privateApi.post<ImageVerificationResponse>('/ai/verify-image', request);
    return response.data;
  }

  async generateEducationContent(request: EcoEducationContentRequest): Promise<EcoEducationContentResponse> {
    const response = await publicApi.post<EcoEducationContentResponse>('/ai/education-content', request);
    return response.data;
  }
}

export const aiApi = new AiApiService();
export default aiApi;
