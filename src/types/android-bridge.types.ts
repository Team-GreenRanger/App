export interface AndroidBridge {
  vibrate(duration: number): void;
  vibratePattern(pattern: string): void;
  showToast(message: string): void;
  showLongToast(message: string): void;
  showNotification(title: string, message: string): void;
  copyToClipboard(text: string): void;
  getFromClipboard(): string;
  share(text: string, title?: string): void;
  getScreenBrightness(): number;
  setScreenBrightness(brightness: number): void;
  isLocationEnabled(): boolean;
  finishApp(): void;
  restartApp(): void;
  log(message: string): void;
  saveToStorage(key: string, value: string): void;
  getFromStorage(key: string): string;
  removeFromStorage(key: string): void;
  clearStorage(): void;
  updateBottomNavigation(pageId: string): void;
  resetFabFromBridge(): void;
  hideBottomNavigation(): void;
  showBottomNavigation(): void;
}

export interface EcoLifeApp {
  AndroidBridge?: AndroidBridge;
}

declare global {
  interface Window {
    EcoLifeApp?: EcoLifeApp;
    Android?: AndroidBridge;
  }
}

export type NavigationPageId = 'home' | 'ranking' | 'missions' | 'map' | 'my';

export interface VibrationOptions {
  duration?: number;
  pattern?: number[];
}

export interface NotificationData {
  title: string;
  message: string;
}

export interface ShareData {
  text: string;
  title?: string;
}

export interface StorageResult<T = string> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface BrightnessConfig {
  level: number;
  min?: number;
  max?: number;
}

export interface SystemInfo {
  brightness: number;
  locationEnabled: boolean;
}

export interface ClipboardData {
  text: string;
  timestamp?: number;
}

export interface ToastOptions {
  message: string;
  duration?: 'short' | 'long';
}