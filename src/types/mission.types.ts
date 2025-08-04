export enum MissionType {
  ENERGY_SAVING = 'ENERGY_SAVING',
  TRANSPORTATION = 'TRANSPORTATION',
  WASTE_REDUCTION = 'WASTE_REDUCTION',
  RECYCLING = 'RECYCLING',
  WATER_CONSERVATION = 'WATER_CONSERVATION',
  SUSTAINABLE_CONSUMPTION = 'SUSTAINABLE_CONSUMPTION'
}

export enum DifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export enum MissionStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  INACTIVE = 'INACTIVE'
}

export enum UserMissionStatus {
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED'
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  difficulty: DifficultyLevel;
  co2ReductionAmount: number;
  creditReward: number;
  requiredSubmissions: number;
  imageUrl?: string;
  instructions: string[];
  verificationCriteria: string[];
  status: MissionStatus;
  createdAt: Date;
}

export interface UserMission {
  id: string;
  userId: string;
  missionId: string;
  status: UserMissionStatus;
  currentProgress: number;
  targetProgress: number;
  submissionImageUrls: string[];
  submissionNote?: string;
  verificationNote?: string;
  submittedAt?: Date;
  verifiedAt?: Date;
  completedAt?: Date;
  assignedAt: Date;
  isActive: boolean; // 새로 추가
  isDone: boolean; // 새로 추가
  mission?: Mission; // Mission 정보 포함
}

export interface SubmitMissionResponse extends UserMission {
  isFullyCompleted: boolean;
  remainingSubmissions: number;
  points: number;
  isActive: boolean; // 가독성을 위해 명시적 다시 선언
  isDone: boolean; // 가독성을 위해 명시적 다시 선언
}

export interface MissionWithDetails extends Mission {
  userMission?: UserMission;
}

export interface AssignMissionRequest {
  missionId: string;
  targetProgress?: number;
}

export interface SubmitMissionRequest {
  imageUrls: string[];
  note?: string;
}

export interface VerifyMissionRequest {
  decision: 'approved' | 'rejected';
  verificationNote?: string;
}

export interface MissionListResponse {
  missions: Mission[];
  total: number;
}

export interface UserMissionListResponse {
  userMissions: UserMission[];
  total: number;
}

export interface MissionDetailsResponse {
  mission: Mission;
  userMission?: UserMission;
}

export interface DailyMissionsResponse {
  userMissions: UserMission[];
  total: number;
}
