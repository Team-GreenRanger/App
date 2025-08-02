export interface UserProfile {
  id: string;
  email: string;
  name: string;
  profileImageUrl: string;
  isVerified: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface UserStatistics {
  totalMissionsCompleted: number;
  currentCarbonCredits: number;
  totalCo2Reduction: number;
  currentLevel: number;
  daysSinceJoined: number;
  globalRanking: number;
}

export interface UpdateProfileRequest {
  name?: string;
  profileImageUrl?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface DeactivateAccountRequest {
  password: string;
  reason?: string;
}
