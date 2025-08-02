import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  Award, 
  TrendingUp, 
  Shield, 
  LogOut, 
  Edit3, 
  Camera,
  ChevronRight,
  Lock,
  Trash2,
  Share2,
  Copy,
  Sun
} from 'lucide-react';
import { privateApi } from '../api';
import { ToastModal, StatCard, CarbonCreditCard } from '../components';
import { UserProfile, UserStatistics, UpdateProfileRequest, ChangePasswordRequest, DeactivateAccountRequest } from '../types';
import { clearAuthData, getUserInfo } from '../utils/auth.utils';
import { useAndroidApi } from '../hooks';

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    updateBottomNavigation, 
    copyToClipboard, 
    getFromClipboard, 
    share,
    setBrightness,
    getSystemInfo,
    isAvailable
  } = useAndroidApi();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showAndroidFeatures, setShowAndroidFeatures] = useState(false);
  
  const [clipboardText, setClipboardText] = useState('');
  const [brightness, setBrightnessLevel] = useState(128);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [deactivateForm, setDeactivateForm] = useState({
    password: '',
    reason: ''
  });
  
  const [modal, setModal] = useState({
    isVisible: false,
    type: 'info' as 'info' | 'warning' | 'error' | 'confirm',
    title: '',
    message: '',
  });

  useEffect(() => {
    loadUserData();
    updateBottomNavigation('my');
    if (isAvailable) {
      loadSystemInfo();
    }
  }, [updateBottomNavigation, isAvailable]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const [profileResponse, statsResponse] = await Promise.all([
        privateApi.get<UserProfile>('/users/profile'),
        privateApi.get<UserStatistics>('/users/statistics')
      ]);
      
      setProfile(profileResponse.data);
      setStatistics(statsResponse.data);
      setEditedName(profileResponse.data.name);
    } catch (error: any) {
      console.error('사용자 데이터 로드 실패:', error);
      showModal('error', '오류', '사용자 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSystemInfo = async () => {
    const systemInfo = await getSystemInfo();
    if (systemInfo) {
      setBrightnessLevel(systemInfo.brightness);
    }
  };

  const handleCopyToClipboard = () => {
    if (profile && statistics) {
      const textToCopy = `안녕하세요! 저는 ${profile.name}이고, 레벨 ${statistics.currentLevel}입니다. 총 ${statistics.currentCarbonCredits}개의 탄소 크레딧을 보유하고 있어요!`;
      copyToClipboard(textToCopy);
      showModal('info', '복사 완료', '프로필 정보가 클립보드에 복사되었습니다.');
    }
  };

  const handleGetClipboard = async () => {
    const clipboardData = await getFromClipboard();
    if (clipboardData) {
      setClipboardText(clipboardData.text);
      showModal('info', '클립보드 확인', `클립보드 내용: ${clipboardData.text}`);
    }
  };

  const handleShare = () => {
    if (profile && statistics) {
      share({
        text: `EcoLife 앱에서 레벨 ${statistics.currentLevel}을 달성했습니다! 총 ${statistics.currentCarbonCredits}개의 탄소 크레딧을 획득했어요.`,
        title: 'EcoLife 성과 공유'
      });
    }
  };

  const handleBrightnessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBrightness = parseInt(event.target.value);
    setBrightnessLevel(newBrightness);
    setBrightness({ level: newBrightness });
  };

  const handleCarbonCreditClick = () => {
    navigate('/my/credit');
  };

  const showModal = (type: 'info' | 'warning' | 'error' | 'confirm', title: string, message: string) => {
    setModal({ isVisible: true, type, title, message });
  };

  const hideModal = () => {
    setModal({ ...modal, isVisible: false });
  };

  const handleProfileUpdate = async () => {
    if (!editedName.trim()) {
      showModal('warning', '입력 오류', '이름을 입력해주세요.');
      return;
    }

    try {
      setIsUpdating(true);
      const updateData: UpdateProfileRequest = { name: editedName };
      
      const response = await privateApi.patch<UserProfile>('/users/profile', updateData);
      setProfile(response.data);
      setEditMode(false);
      showModal('info', '성공', '프로필이 업데이트되었습니다.');
    } catch (error: any) {
      console.error('프로필 업데이트 실패:', error);
      showModal('error', '오류', '프로필 업데이트에 실패했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      showModal('warning', '입력 오류', '모든 필드를 입력해주세요.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showModal('warning', '입력 오류', '새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showModal('warning', '입력 오류', '새 비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    try {
      const changePasswordData: ChangePasswordRequest = {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      };

      await privateApi.patch('/users/change-password', changePasswordData);
      
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordModal(false);
      showModal('info', '성공', '비밀번호가 변경되었습니다.');
    } catch (error: any) {
      console.error('비밀번호 변경 실패:', error);
      if (error.response?.status === 400) {
        showModal('error', '오류', '현재 비밀번호가 올바르지 않습니다.');
      } else {
        showModal('error', '오류', '비밀번호 변경에 실패했습니다.');
      }
    }
  };

  const handleAccountDeactivate = async () => {
    if (!deactivateForm.password) {
      showModal('warning', '입력 오류', '비밀번호를 입력해주세요.');
      return;
    }

    try {
      const deactivateData: DeactivateAccountRequest = {
        password: deactivateForm.password,
        reason: deactivateForm.reason || '사용자 요청'
      };

      await privateApi.delete('/users/deactivate', { data: deactivateData });
      
      clearAuthData();
      showModal('info', '계정 비활성화', '계정이 비활성화되었습니다.');
      
      setTimeout(() => {
        navigate('/welcome');
      }, 1500);
    } catch (error: any) {
      console.error('계정 비활성화 실패:', error);
      if (error.response?.status === 400) {
        showModal('error', '오류', '비밀번호가 올바르지 않습니다.');
      } else {
        showModal('error', '오류', '계정 비활성화에 실패했습니다.');
      }
    }
  };

  const handleLogout = () => {
    clearAuthData();
    navigate('/welcome');
  };

  const getLevelProgress = () => {
    if (!statistics) return 0;
    const currentLevel = statistics.currentLevel;
    const nextLevelRequirement = currentLevel * 1000;
    const currentProgress = statistics.totalMissionsCompleted * 100;
    return Math.min((currentProgress / nextLevelRequirement) * 100, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white">
        <div className="px-6 pt-12 pb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <div className="relative">
                  <img
                    src={profile?.profileImageUrl || 'https://via.placeholder.com/60'}
                    alt="프로필"
                    className="w-16 h-16 rounded-full border-2 border-gray-100"
                  />
                  {profile?.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  {editMode ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="text-xl font-bold text-gray-900 bg-transparent border-b border-gray-300 focus:border-green-500 focus:outline-none flex-1"
                        disabled={isUpdating}
                      />
                      <button
                        onClick={handleProfileUpdate}
                        disabled={isUpdating}
                        className="text-green-500 font-medium disabled:opacity-50"
                      >
                        {isUpdating ? '저장 중...' : '저장'}
                      </button>
                      <button
                        onClick={() => {
                          setEditMode(false);
                          setEditedName(profile?.name || '');
                        }}
                        className="text-gray-500"
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl font-bold text-gray-900">{profile?.name}</h1>
                      <button
                        onClick={() => setEditMode(true)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <p className="text-gray-500 text-sm">{profile?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {statistics && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-green-100 text-sm">현재 레벨</p>
                    <p className="text-2xl font-bold">Level {statistics.currentLevel}</p>
                  </div>
                  <Award className="w-8 h-8 text-green-200" />
                </div>
                <div className="w-full bg-green-400 rounded-full h-2 mb-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-300"
                    style={{ width: `${getLevelProgress()}%` }}
                  ></div>
                </div>
                <p className="text-green-100 text-xs">다음 레벨까지 {100 - getLevelProgress()}%</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <StatCard 
                  value={`${statistics.totalCo2Reduction}kg`}
                  label="Total CO2 Saved"
                  color="green"
                />
                <StatCard 
                  value={statistics.currentCarbonCredits.toLocaleString()}
                  label="Carbon Credits"
                  color="blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <StatCard 
                  value={`${statistics.totalMissionsCompleted}개`}
                  label="완료한 미션"
                  color="purple"
                />
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-600 text-sm">전체 순위</p>
                  <p className="text-xl font-bold text-gray-900">#{statistics.globalRanking}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Carbon Credit</h3>
                <CarbonCreditCard 
                  points={statistics.currentCarbonCredits}
                  onClick={handleCarbonCreditClick}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              계정 설정
            </h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            <button
              onClick={() => setShowAndroidFeatures(!showAndroidFeatures)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <Sun className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-700">안드로이드 기능</span>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showAndroidFeatures ? 'rotate-90' : ''}`} />
            </button>

            {showAndroidFeatures && isAvailable && (
              <div className="px-6 py-4 bg-gray-50 space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyToClipboard}
                    className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center justify-center gap-1"
                  >
                    <Copy className="w-4 h-4" />
                    프로필 복사
                  </button>
                  <button
                    onClick={handleGetClipboard}
                    className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center justify-center gap-1"
                  >
                    <Copy className="w-4 h-4" />
                    클립보드 확인
                  </button>
                </div>
                
                <button
                  onClick={handleShare}
                  className="w-full bg-purple-500 text-white py-2 px-3 rounded-lg hover:bg-purple-600 transition-colors text-sm flex items-center justify-center gap-1"
                >
                  <Share2 className="w-4 h-4" />
                  성과 공유하기
                </button>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">화면 밝기</label>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={brightness}
                    onChange={handleBrightnessChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-gray-600">현재 밝기: {brightness}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <Lock className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-700">비밀번호 변경</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => setShowDeactivateModal(true)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-red-50 transition-colors text-red-600"
            >
              <div className="flex items-center">
                <Trash2 className="w-5 h-5 mr-3" />
                <span>계정 비활성화</span>
              </div>
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={handleLogout}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <LogOut className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-700">로그아웃</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {statistics && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">가입 정보</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">가입일</span>
                <span className="text-gray-900">{statistics.daysSinceJoined}일 전</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">계정 상태</span>
                <span className={`${profile?.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>
                  {profile?.status === 'ACTIVE' ? '활성' : '비활성'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">인증 상태</span>
                <span className={`${profile?.isVerified ? 'text-green-600' : 'text-orange-600'}`}>
                  {profile?.isVerified ? '인증됨' : '미인증'}
                </span>
              </div>
              {isAvailable && (
                <div className="flex justify-between">
                  <span className="text-gray-600">앱 환경</span>
                  <span className="text-blue-600">안드로이드</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">비밀번호 변경</h3>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="현재 비밀번호"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              />
              <input
                type="password"
                placeholder="새 비밀번호"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              />
              <input
                type="password"
                placeholder="새 비밀번호 확인"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handlePasswordChange}
                className="flex-1 py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                변경
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2 text-red-600">계정 비활성화</h3>
            <p className="text-gray-600 text-sm mb-4">계정을 비활성화하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="비밀번호 확인"
                value={deactivateForm.password}
                onChange={(e) => setDeactivateForm({...deactivateForm, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
              />
              <textarea
                placeholder="비활성화 사유 (선택사항)"
                value={deactivateForm.reason}
                onChange={(e) => setDeactivateForm({...deactivateForm, reason: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none resize-none h-20"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleAccountDeactivate}
                className="flex-1 py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                비활성화
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastModal
        isVisible={modal.isVisible}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={hideModal}
      />
    </div>
  );
};

export default MyPage;
