const USER_CACHE_KEY = 'ecolife_user_cache';

interface UserCache {
  name: string;
  email?: string;
  profileImageUrl?: string;
  timestamp: number;
}

export const userCache = {
  set: (userData: { name: string; email?: string; profileImageUrl?: string }) => {
    try {
      const cacheData: UserCache = {
        ...userData,
        timestamp: Date.now()
      };
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache user data:', error);
    }
  },

  get: (): UserCache | null => {
    try {
      const cached = localStorage.getItem(USER_CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached) as UserCache;
        // 캐시 유효 시간: 24시간
        const isValid = Date.now() - data.timestamp < 24 * 60 * 60 * 1000;
        return isValid ? data : null;
      }
      return null;
    } catch (error) {
      console.warn('Failed to get cached user data:', error);
      return null;
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(USER_CACHE_KEY);
    } catch (error) {
      console.warn('Failed to clear user cache:', error);
    }
  },

  update: (updates: Partial<{ name: string; email: string; profileImageUrl: string }>) => {
    try {
      const existing = userCache.get();
      if (existing) {
        userCache.set({
          ...existing,
          ...updates
        });
      }
    } catch (error) {
      console.warn('Failed to update user cache:', error);
    }
  }
};