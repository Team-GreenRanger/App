export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  profileImageUrl: string;
  isVerified: boolean;
  createdAt: string;
}

const TOKEN_STORAGE_KEY = 'token';
const USER_INFO_STORAGE_KEY = 'user';

export const saveAuthToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (error) {
    console.error('토큰 저장 실패:', error);
  }
};

export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('토큰 조회 실패:', error);
    return null;
  }
};

export const removeAuthToken = (): void => {
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

export const logout = (): void => {
  removeAuthToken();
  removeUserInfo();
};

export const isLoggedIn = (): boolean => {
  return getAuthToken() !== null;
};

export const saveAuthData = (token: string, user: UserInfo): void => {
  saveAuthToken(token);
  saveUserInfo(user);
};

export const clearAuthData = (): void => {
  logout();
};