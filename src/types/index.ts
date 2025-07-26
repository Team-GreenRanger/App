export * from './android-bridge.types';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: number;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AppConfig {
  version: string;
  environment: 'development' | 'production';
  features: {
    vibration: boolean;
    notifications: boolean;
    storage: boolean;
    navigation: boolean;
  };
}

export interface ErrorInfo {
  message: string;
  code?: string | number;
  timestamp: number;
}