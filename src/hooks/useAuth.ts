import { useState, useCallback, useEffect } from 'react';
import { 
  UserInfo, 
  saveAuthData,
  getAuthToken, 
  getUserInfo,
  clearAuthData,
  isLoggedIn
} from '../utils/auth.utils';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const storedToken = getAuthToken();
      const storedUserInfo = getUserInfo();
      
      if (storedToken && storedUserInfo) {
        setToken(storedToken);
        setUserInfo(storedUserInfo);
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (authToken: string, user: UserInfo) => {
    try {
      saveAuthData(authToken, user);
      setToken(authToken);
      setUserInfo(user);
      return true;
    } catch (error) {
      console.error('로그인 실패:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    try {
      clearAuthData();
      setToken(null);
      setUserInfo(null);
      return true;
    } catch (error) {
      console.error('로그아웃 실패:', error);
      return false;
    }
  }, []);

  const updateUserInfo = useCallback((newUserInfo: UserInfo) => {
    try {
      if (token) {
        saveAuthData(token, newUserInfo);
        setUserInfo(newUserInfo);
      }
      return true;
    } catch (error) {
      console.error('사용자 정보 업데이트 실패:', error);
      return false;
    }
  }, [token]);

  const getAccessToken = useCallback((): string | null => {
    return getAuthToken();
  }, []);

  const isAuthenticated = isLoggedIn() && Boolean(token && userInfo);

  return {
    token,
    userInfo,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUserInfo,
    getAccessToken
  };
};