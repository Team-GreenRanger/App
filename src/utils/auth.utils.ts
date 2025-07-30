export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
}

const TOKEN_STORAGE_KEY = 'ecolife_auth_tokens';
const USER_INFO_STORAGE_KEY = 'ecolife_user_info';

export const saveAuthTokens = (tokens: AuthTokens): void => {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  } catch (error) {
    console.error('토큰 저장 실패:', error);
  }
};

export const getAuthTokens = (): AuthTokens | null => {
  try {
    const tokens = localStorage.getItem(TOKEN_STORAGE_KEY);
    return tokens ? JSON.parse(tokens) : null;
  } catch (error) {
    console.error('토큰 조회 실패:', error);
    return null;
  }
};

export const removeAuthTokens = (): void => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('토큰 삭제 실패:', error);
  }
};

export const saveUserInfo = (userInfo: UserInfo): void => {
  try {
    localStorage.setItem(USER_INFO_STORAGE_KEY, JSON.stringify(userInfo));
  } catch (error) {
    console.error('사용자 정보 저장 실패:', error);
  }
};

export const getUserInfo = (): UserInfo | null => {
  try {
    const userInfo = localStorage.getItem(USER_INFO_STORAGE_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    return null;
  }
};

export const removeUserInfo = (): void => {
  try {
    localStorage.removeItem(USER_INFO_STORAGE_KEY);
  } catch (error) {
    console.error('사용자 정보 삭제 실패:', error);
  }
};

export const isTokenExpired = (tokens: AuthTokens): boolean => {
  if (!tokens.expiresAt) return false;
  return Date.now() >= tokens.expiresAt;
};

export const getValidAccessToken = (): string | null => {
  const tokens = getAuthTokens();
  if (!tokens) return null;
  
  if (isTokenExpired(tokens)) {
    removeAuthTokens();
    return null;
  }
  
  return tokens.accessToken;
};

export const logout = (): void => {
  removeAuthTokens();
  removeUserInfo();
};

export const isLoggedIn = (): boolean => {
  return getValidAccessToken() !== null;
};
