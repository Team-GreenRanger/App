import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  Award,
  Shield,
  LogOut,
  Edit3,
  ChevronRight,
  Lock,
  Trash2,
  Share2,
  Copy,
  Sun,
  Heart,
} from "lucide-react";
import { privateApi } from "../api";
import { ToastModal, StatCard, CarbonCreditCard } from "../components";
import { userCache } from "../utils";
import {
  UserProfile,
  UserStatistics,
  UpdateProfileRequest,
  ChangePasswordRequest,
  DeactivateAccountRequest,
} from "../types";
import { clearAuthData } from "../utils/auth.utils";
import { useAndroidApi } from "../hooks";

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    updateBottomNavigation,
    copyToClipboard,
    getFromClipboard,
    share,
    setBrightness,
    getSystemInfo,
    isAvailable,
  } = useAndroidApi();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showAndroidFeatures, setShowAndroidFeatures] = useState(false);

  const [clipboardText, setClipboardText] = useState("");
  const [brightness, setBrightnessLevel] = useState(128);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [deactivateForm, setDeactivateForm] = useState({
    password: "",
    reason: "",
  });

  const [modal, setModal] = useState({
    isVisible: false,
    type: "info" as "info" | "warning" | "error" | "confirm",
    title: "",
    message: "",
  });

  useEffect(() => {
    loadUserData();
    updateBottomNavigation("my");
    if (isAvailable) {
      loadSystemInfo();
    }
  }, [updateBottomNavigation, isAvailable]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const [profileResponse, statsResponse] = await Promise.all([
        privateApi.get<UserProfile>("/users/profile"),
        privateApi.get<UserStatistics>("/users/statistics"),
      ]);

      setProfile(profileResponse.data);
      setStatistics(statsResponse.data);
      setEditedName(profileResponse.data.name);
    } catch (error: any) {
      console.error("Failed to load user data:", error);
      showModal("error", "Error", "Failed to load user information.");
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
      const textToCopy = `Hello! I'm ${profile.name}, Level ${
        statistics.currentLevel || 1
      }. I have ${statistics.currentCarbonCredits || 0} carbon credits!`;
      copyToClipboard(textToCopy);
      showModal(
        "info",
        "Copied",
        "Profile information has been copied to clipboard."
      );
    }
  };

  const handleGetClipboard = async () => {
    const clipboardData = await getFromClipboard();
    if (clipboardData) {
      setClipboardText(clipboardData.text);
      showModal(
        "info",
        "Clipboard",
        `Clipboard content: ${clipboardData.text}`
      );
    }
  };

  const handleShare = () => {
    if (profile && statistics) {
      share({
        text: `I reached Level ${
          statistics.currentLevel || 1
        } on EcoLife app! I earned ${
          statistics.currentCarbonCredits || 0
        } carbon credits.`,
        title: "Share EcoLife Achievement",
      });
    }
  };

  const handleBrightnessChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newBrightness = parseInt(event.target.value);
    setBrightnessLevel(newBrightness);
    setBrightness({ level: newBrightness });
  };

  const handleCarbonCreditClick = () => {
    navigate("/my/credit");
  };

  const showModal = (
    type: "info" | "warning" | "error" | "confirm",
    title: string,
    message: string
  ) => {
    setModal({ isVisible: true, type, title, message });
  };

  const hideModal = () => {
    setModal({ ...modal, isVisible: false });
  };

  const handleProfileUpdate = async () => {
    if (!editedName.trim()) {
      showModal("warning", "Input Error", "Please enter your name.");
      return;
    }

    try {
      setIsUpdating(true);
      const updateData: UpdateProfileRequest = { name: editedName };

      const response = await privateApi.patch<UserProfile>(
        "/users/profile",
        updateData
      );
      setProfile(response.data);
      setEditMode(false);

      // 캐시 업데이트
      userCache.update({ name: response.data.name });

      showModal("info", "Success", "Profile has been updated.");
    } catch (error: any) {
      console.error("Profile update failed:", error);
      showModal("error", "Error", "Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      showModal("warning", "Input Error", "Please fill in all fields.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showModal("warning", "Input Error", "New passwords do not match.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showModal(
        "warning",
        "Input Error",
        "New password must be at least 6 characters."
      );
      return;
    }

    try {
      const changePasswordData: ChangePasswordRequest = {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      };

      await privateApi.patch("/users/change-password", changePasswordData);

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordModal(false);
      showModal("info", "Success", "Password has been changed.");
    } catch (error: any) {
      console.error("Password change failed:", error);
      if (error.response?.status === 400) {
        showModal("error", "Error", "Current password is incorrect.");
      } else {
        showModal("error", "Error", "Failed to change password.");
      }
    }
  };

  const handleAccountDeactivate = async () => {
    if (!deactivateForm.password) {
      showModal("warning", "Input Error", "Please enter your password.");
      return;
    }

    try {
      const deactivateData: DeactivateAccountRequest = {
        password: deactivateForm.password,
        reason: deactivateForm.reason || "User request",
      };

      await privateApi.delete("/users/deactivate", { data: deactivateData });

      clearAuthData();
      showModal(
        "info",
        "Account Deactivated",
        "Your account has been deactivated."
      );

      setTimeout(() => {
        navigate("/welcome");
      }, 1500);
    } catch (error: any) {
      console.error("Account deactivation failed:", error);
      if (error.response?.status === 400) {
        showModal("error", "Error", "Password is incorrect.");
      } else {
        showModal("error", "Error", "Failed to deactivate account.");
      }
    }
  };

  const handleLogout = () => {
    clearAuthData();
    navigate("/welcome");
  };

  const getLevelProgress = () => {
    if (!statistics) return 0;
    const currentLevel = statistics.currentLevel || 1;
    const nextLevelRequirement = currentLevel * 1000;
    const currentProgress = (statistics.totalMissionsCompleted || 0) * 100;
    return Math.min((currentProgress / nextLevelRequirement) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-0">
      <div className="bg-gray-50">
        <div className="px-3 pt-12 pb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center mb-3">
                <div className="relative flex-shrink-0">
                  {isLoading ? (
                    <div className="skeleton w-16 h-16 rounded-full"></div>
                  ) : (
                    <>
                      <img
                        src={
                          profile?.profileImageUrl ||
                          "https://via.placeholder.com/60"
                        }
                        alt="Profile"
                        className="w-16 h-16 rounded-full border-2 border-gray-100"
                      />
                      {profile?.isVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                          <Shield className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="ml-4 flex-1 min-w-0 overflow-hidden">
                  {isLoading ? (
                    <div className="min-w-0">
                      <div className="skeleton h-6 rounded w-32 mb-2"></div>
                      <div className="skeleton h-4 rounded w-48"></div>
                    </div>
                  ) : editMode ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="text-xl font-bold text-gray-900 bg-transparent border-b border-gray-300 focus:border-green-500 focus:outline-none flex-1 min-w-0 max-w-[200px] truncate"
                          disabled={isUpdating}
                          maxLength={20}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleProfileUpdate}
                          disabled={isUpdating}
                          className="text-green-500 font-medium disabled:opacity-50 text-sm px-3 py-1 bg-green-50 rounded-md"
                        >
                          {isUpdating ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => {
                            setEditMode(false);
                            setEditedName(profile?.name || "");
                          }}
                          className="text-gray-500 text-sm px-3 py-1 bg-gray-50 rounded-md"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <h1 className="text-xl font-bold text-gray-900 truncate flex-1 min-w-0">
                          {profile?.name}
                        </h1>
                        <button
                          onClick={() => setEditMode(true)}
                          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-gray-500 text-sm truncate">
                        {profile?.email}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="skeleton h-16 rounded-xl"></div>
                <div className="skeleton h-16 rounded-xl"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="skeleton h-16 rounded-xl"></div>
                <div className="skeleton h-16 rounded-xl"></div>
              </div>
              <div className="mt-6">
                <div className="skeleton h-5 rounded w-24 mb-3"></div>
                <div className="skeleton h-24 rounded-2xl"></div>
              </div>
            </div>
          ) : statistics ? (
            <div className="space-y-6">
              {/* 두 개 카드를 나란히 배치 */}
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  value={`${statistics.totalCo2Reduction || 0}kg`}
                  label="Total CO2 Saved"
                />
                <StatCard
                  value={(statistics.totalMissionsCompleted || 0).toString()}
                  label="Missions Completed"
                />
              </div>

              <div className="mt-0">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Carbon Credit
                </h3>
                <CarbonCreditCard
                  points={statistics.currentCarbonCredits || 0}
                  onClick={handleCarbonCreditClick}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        <div className="overflow-hidden">
          <div className="">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
              Account Settings
            </h2>
          </div>

          <div className="divide-y divide-gray-100">

            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full px-4 py-4 flex items-center justify-between bg-white rounded-2xl transition-colors mb-4"
            >
              <div className="flex items-center">
                <Lock className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-700">Change Password</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => setShowDeactivateModal(true)}
              className="w-full px-4 py-4 flex items-center justify-between bg-white rounded-2xl transition-colors text-red-600 mb-4"
            >
              <div className="flex items-center">
                <Trash2 className="w-5 h-5 mr-3" />
                <span>Deactivate Account</span>
              </div>
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-4 flex items-center justify-between bg-white rounded-2xl transition-colors mb-4"
            >
              <div className="flex items-center">
                <LogOut className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-700">Logout</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="text-center py-6 border-t border-gray-100">
          <div className="flex items-center justify-center gap-1 text-gray-500 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>
              by{" "}
              <span className="font-semibold text-green-600">GreenRangers</span>
            </span>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="flex-1 py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2 text-red-600">
              Deactivate Account
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Are you sure you want to deactivate your account? This action
              cannot be undone.
            </p>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Confirm Password"
                value={deactivateForm.password}
                onChange={(e) =>
                  setDeactivateForm({
                    ...deactivateForm,
                    password: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
              />
              <textarea
                placeholder="Reason for deactivation (optional)"
                value={deactivateForm.reason}
                onChange={(e) =>
                  setDeactivateForm({
                    ...deactivateForm,
                    reason: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none resize-none h-20"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAccountDeactivate}
                className="flex-1 py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Deactivate
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
