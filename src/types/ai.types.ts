export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp?: Date;
  id?: string;
}

export interface ChatWithAIRequest {
  message: string;
  conversationId?: string;
}

export interface ChatWithAIResponse {
  response: string;
  conversationId: string;
  messageId: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
}

export interface ConversationListResponse {
  conversations: Conversation[];
  total: number;
}

export interface ConversationMessagesResponse {
  messages: Message[];
  total: number;
  hasNext: boolean;
}

export interface EcoTipResponse {
  tip: string;
  category: string;
  timestamp: Date;
}

export interface ImageVerificationRequest {
  imageUrl: string;
  missionId: string;
}

export interface ImageVerificationResponse {
  isValid: boolean;
  confidence: number;
  reasoning: string;
  detectedElements: string[];
  suggestions: string[];
  verificationId: string;
  timestamp: Date;
}

export interface EcoEducationContentRequest {
  topic: string;
}

export interface EcoEducationContentResponse {
  content: string;
  topic: string;
  wordCount: number;
  timestamp: Date;
}
