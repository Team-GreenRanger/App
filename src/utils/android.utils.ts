import { NavigationPageId } from '@/types/android-bridge.types';

export const isAndroidWebView = (): boolean => {
  return typeof window !== 'undefined' && 
         !!window.EcoLifeApp?.AndroidBridge;
};

export const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  const isAndroid = /Android/i.test(userAgent);
  const isWebView = isAndroidWebView();
  
  return {
    isAndroid,
    isWebView,
    userAgent,
    platform: navigator.platform
  };
};

export const formatVibrationPattern = (pattern: number[]): string => {
  return pattern.join(',');
};

export const validateNavigationPageId = (pageId: string): pageId is NavigationPageId => {
  const validPageIds: NavigationPageId[] = ['home', 'ranking', 'missions', 'map', 'my'];
  return validPageIds.includes(pageId as NavigationPageId);
};

export const clampBrightness = (value: number): number => {
  return Math.max(0, Math.min(255, value));
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

export const safeJsonParse = <T>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
};

export const safeJsonStringify = (obj: any): string => {
  try {
    return JSON.stringify(obj);
  } catch {
    return '';
  }
};