import {
  AndroidBridge,
  NavigationPageId,
  NotificationData,
  ShareData,
  StorageResult,
  BrightnessConfig,
  SystemInfo,
  ClipboardData,
  ToastOptions,
  VibrationOptions
} from '../types/android-bridge.types';

class AndroidApiService {
  private bridge: AndroidBridge | null = null;
  private isReady = false;

  constructor() {
    this.initBridge();
  }

  private initBridge(): void {
    if (typeof window !== 'undefined') {
      // window.Android 또는 window.EcoLifeApp.AndroidBridge 지원
      if (window.Android) {
        this.bridge = window.Android;
        this.isReady = true;
      } else if (window.EcoLifeApp?.AndroidBridge) {
        this.bridge = window.EcoLifeApp.AndroidBridge;
        this.isReady = true;
      }
    }
  }

  private ensureBridge(): AndroidBridge {
    if (!this.isReady || !this.bridge) {
      this.initBridge();
      if (!this.bridge) {
        throw new Error('Android Bridge가 초기화되지 않았습니다.');
      }
    }
    return this.bridge;
  }

  public async vibrate(options: VibrationOptions): Promise<boolean> {
    try {
      const bridge = this.ensureBridge();
      if (options.pattern && options.pattern.length > 0) {
        const patternString = options.pattern.join(',');
        bridge.vibratePattern(patternString);
      } else {
        const duration = options.duration || 200;
        bridge.vibrate(duration);
      }
      return true;
    } catch (error) {
      console.error('진동 실행 실패:', error);
      return false;
    }
  }

  public async showToast(options: ToastOptions): Promise<boolean> {
    try {
      const bridge = this.ensureBridge();
      if (options.duration === 'long') {
        bridge.showLongToast(options.message);
      } else {
        bridge.showToast(options.message);
      }
      return true;
    } catch (error) {
      console.error('토스트 표시 실패:', error);
      return false;
    }
  }

  public async showNotification(data: NotificationData): Promise<boolean> {
    try {
      const bridge = this.ensureBridge();
      bridge.showNotification(data.title, data.message);
      return true;
    } catch (error) {
      console.error('알림 표시 실패:', error);
      return false;
    }
  }

  public async copyToClipboard(text: string): Promise<boolean> {
    try {
      const bridge = this.ensureBridge();
      bridge.copyToClipboard(text);
      return true;
    } catch (error) {
      console.error('클립보드 복사 실패:', error);
      return false;
    }
  }

  public async getFromClipboard(): Promise<ClipboardData | null> {
    try {
      const bridge = this.ensureBridge();
      const text = bridge.getFromClipboard();
      return {
        text,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('클립보드 읽기 실패:', error);
      return null;
    }
  }

  public async share(data: ShareData): Promise<boolean> {
    try {
      const bridge = this.ensureBridge();
      bridge.share(data.text, data.title || '공유하기');
      return true;
    } catch (error) {
      console.error('공유 실패:', error);
      return false;
    }
  }

  public async getSystemInfo(): Promise<SystemInfo | null> {
    try {
      const bridge = this.ensureBridge();
      return {
        brightness: bridge.getScreenBrightness(),
        locationEnabled: bridge.isLocationEnabled()
      };
    } catch (error) {
      console.error('시스템 정보 조회 실패:', error);
      return null;
    }
  }

  public async setBrightness(config: BrightnessConfig): Promise<boolean> {
    try {
      const bridge = this.ensureBridge();
      const clampedLevel = Math.max(0, Math.min(255, config.level));
      bridge.setScreenBrightness(clampedLevel);
      return true;
    } catch (error) {
      console.error('화면 밝기 설정 실패:', error);
      return false;
    }
  }

  public async saveToStorage<T>(key: string, value: T): Promise<StorageResult> {
    try {
      const bridge = this.ensureBridge();
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      bridge.saveToStorage(key, serializedValue);
      return { success: true };
    } catch (error) {
      console.error('저장소 저장 실패:', error);
      return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' };
    }
  }

  public async getFromStorage<T>(key: string, defaultValue?: T): Promise<StorageResult<T>> {
    try {
      const bridge = this.ensureBridge();
      const value = bridge.getFromStorage(key);
      
      if (!value) {
        return { success: true, data: defaultValue };
      }

      try {
        const parsedValue = JSON.parse(value) as T;
        return { success: true, data: parsedValue };
      } catch {
        return { success: true, data: value as T };
      }
    } catch (error) {
      console.error('저장소 조회 실패:', error);
      return { 
        success: false, 
        data: defaultValue, 
        error: error instanceof Error ? error.message : '알 수 없는 오류' 
      };
    }
  }

  public async removeFromStorage(key: string): Promise<StorageResult> {
    try {
      const bridge = this.ensureBridge();
      bridge.removeFromStorage(key);
      return { success: true };
    } catch (error) {
      console.error('저장소 삭제 실패:', error);
      return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' };
    }
  }

  public async clearStorage(): Promise<StorageResult> {
    try {
      const bridge = this.ensureBridge();
      bridge.clearStorage();
      return { success: true };
    } catch (error) {
      console.error('저장소 초기화 실패:', error);
      return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' };
    }
  }

  public async updateBottomNavigation(pageId: NavigationPageId): Promise<boolean> {
    try {
      const bridge = this.ensureBridge();
      bridge.updateBottomNavigation(pageId);
      return true;
    } catch (error) {
      console.error('하단 네비게이션 업데이트 실패:', error);
      return false;
    }
  }

  public async resetFab(): Promise<boolean> {
    try {
      const bridge = this.ensureBridge();
      bridge.resetFabFromBridge();
      return true;
    } catch (error) {
      console.error('FAB 리셋 실패:', error);
      return false;
    }
  }

  public async hideBottomNavigation(): Promise<boolean> {
    try {
      const bridge = this.ensureBridge();
      bridge.hideBottomNavigation();
      return true;
    } catch (error) {
      console.error('하단 네비게이션 숨기기 실패:', error);
      return false;
    }
  }

  public async showBottomNavigation(): Promise<boolean> {
    try {
      const bridge = this.ensureBridge();
      bridge.showBottomNavigation();
      return true;
    } catch (error) {
      console.error('하단 네비게이션 표시 실패:', error);
      return false;
    }
  }

  public async finishApp(): Promise<void> {
    try {
      const bridge = this.ensureBridge();
      bridge.finishApp();
    } catch (error) {
      console.error('앱 종료 실패:', error);
    }
  }

  public async restartApp(): Promise<boolean> {
    try {
      const bridge = this.ensureBridge();
      bridge.restartApp();
      return true;
    } catch (error) {
      console.error('앱 재시작 실패:', error);
      return false;
    }
  }

  public log(message: string): void {
    try {
      const bridge = this.ensureBridge();
      bridge.log(message);
    } catch (error) {
      console.error('로그 전송 실패:', error);
    }
  }

  public isAvailable(): boolean {
    return this.isReady && this.bridge !== null;
  }
}

export const AndroidApi = new AndroidApiService();
export default AndroidApi;