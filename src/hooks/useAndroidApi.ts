import { useState, useEffect, useCallback } from 'react';
import AndroidApi from '../api/AndroidApi';
import {
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

export const useAndroidApi = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAvailability = () => {
      setIsAvailable(AndroidApi.isAvailable());
    };

    checkAvailability();
    
    const interval = setInterval(checkAvailability, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const executeWithLoading = useCallback(async <T>(operation: () => Promise<T>): Promise<T> => {
    setIsLoading(true);
    try {
      return await operation();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const vibrate = useCallback(async (options: VibrationOptions) => {
    return executeWithLoading(() => AndroidApi.vibrate(options));
  }, [executeWithLoading]);

  const showToast = useCallback(async (options: ToastOptions) => {
    return executeWithLoading(() => AndroidApi.showToast(options));
  }, [executeWithLoading]);

  const showNotification = useCallback(async (data: NotificationData) => {
    return executeWithLoading(() => AndroidApi.showNotification(data));
  }, [executeWithLoading]);

  const copyToClipboard = useCallback(async (text: string) => {
    return executeWithLoading(() => AndroidApi.copyToClipboard(text));
  }, [executeWithLoading]);

  const getFromClipboard = useCallback(async (): Promise<ClipboardData | null> => {
    return executeWithLoading(() => AndroidApi.getFromClipboard());
  }, [executeWithLoading]);

  const share = useCallback(async (data: ShareData) => {
    return executeWithLoading(() => AndroidApi.share(data));
  }, [executeWithLoading]);

  const getSystemInfo = useCallback(async (): Promise<SystemInfo | null> => {
    return executeWithLoading(() => AndroidApi.getSystemInfo());
  }, [executeWithLoading]);

  const setBrightness = useCallback(async (config: BrightnessConfig) => {
    return executeWithLoading(() => AndroidApi.setBrightness(config));
  }, [executeWithLoading]);

  const saveToStorage = useCallback(async <T>(key: string, value: T): Promise<StorageResult> => {
    return executeWithLoading(() => AndroidApi.saveToStorage(key, value));
  }, [executeWithLoading]);

  const getFromStorage = useCallback(async <T>(key: string, defaultValue?: T): Promise<StorageResult<T>> => {
    return executeWithLoading(() => AndroidApi.getFromStorage(key, defaultValue));
  }, [executeWithLoading]);

  const removeFromStorage = useCallback(async (key: string): Promise<StorageResult> => {
    return executeWithLoading(() => AndroidApi.removeFromStorage(key));
  }, [executeWithLoading]);

  const clearStorage = useCallback(async (): Promise<StorageResult> => {
    return executeWithLoading(() => AndroidApi.clearStorage());
  }, [executeWithLoading]);

  const updateBottomNavigation = useCallback(async (pageId: NavigationPageId) => {
    return executeWithLoading(() => AndroidApi.updateBottomNavigation(pageId));
  }, [executeWithLoading]);

  const resetFab = useCallback(async () => {
    return executeWithLoading(() => AndroidApi.resetFab());
  }, [executeWithLoading]);

  const finishApp = useCallback(async () => {
    return executeWithLoading(() => AndroidApi.finishApp());
  }, [executeWithLoading]);

  const restartApp = useCallback(async () => {
    return executeWithLoading(() => AndroidApi.restartApp());
  }, [executeWithLoading]);

  const log = useCallback((message: string) => {
    AndroidApi.log(message);
  }, []);

  return {
    isAvailable,
    isLoading,
    vibrate,
    showToast,
    showNotification,
    copyToClipboard,
    getFromClipboard,
    share,
    getSystemInfo,
    setBrightness,
    saveToStorage,
    getFromStorage,
    removeFromStorage,
    clearStorage,
    updateBottomNavigation,
    resetFab,
    finishApp,
    restartApp,
    log
  };
};