import { useState, useCallback, useEffect } from 'react';
import { 
  AuthTokens, 
  UserInfo, 
  saveAuthTokens, 
  getAuthTokens, 
  removeAuthTokens,
  saveUserInfo,
  getUserInfo,
  removeUserInfo,
  isTokenExpired,
  logout as utilLogout
} from '../utils/auth.utils';

export const useAuth = () => {
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const storedTokens = getAuthTokens();
      const storedUserInfo = getUserInfo();
      
      if (storedTokens && !isTokenExpired(storedTokens)) {
        setTokens(storedTokens);
        setUserInfo(storedUserInfo);
      } else if (storedTokens && isTokenExpired(storedTokens)) {
        removeAuthTokens();
        removeUserInfo();
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (authTokens: AuthTokens, user: UserInfo) => {
    try {
      saveAuthTokens(authTokens);
      saveUserInfo(user);
      setTokens(authTokens);
      setUserInfo(user);
      return true;
    } catch (error) {
      console.error('로그인 실패:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    try {
      utilLogout();
      setTokens(null);
      setUserInfo(null);
      return true;
    } catch (error) {
      console.error('로그아웃 실패:', error);
      return false;
    }
  }, []);

  const updateTokens = useCallback((newTokens: AuthTokens) => {
    try {
      saveAuthTokens(newTokens);
      setTokens(newTokens);
      return true;
    } catch (error) {
      console.error('토큰 업데이트 실패:', error);
      return false;
    }
  }, []);

  const updateUserInfo = useCallback((newUserInfo: UserInfo) => {
    try {
      saveUserInfo(newUserInfo);
      setUserInfo(newUserInfo);
      return true;
    } catch (error) {
      console.error('사용자 정보 업데이트 실패:', error);
      return false;
    }
  }, []);

  const getAccessToken = useCallback((): string | null => {
    if (!tokens) return null;
    
    if (isTokenExpired(tokens)) {
      logout();
      return null;
    }
    
    return tokens.accessToken;
  }, [tokens, logout]);

  const isAuthenticated = Boolean(tokens && userInfo && !isTokenExpired(tokens));

  return {
    tokens,
    userInfo,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateTokens,
    updateUserInfo,
    getAccessToken
  };
};
