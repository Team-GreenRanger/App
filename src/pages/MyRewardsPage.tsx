import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAndroidApi } from "../hooks";
import { UserReward, UserRewardStatus } from "../types";
import {
  HiChevronLeft,
  HiClock,
  HiCheckCircle,
  HiXCircle,
} from "react-icons/hi";
import { getUserRewards } from "../utils";

const MyRewardsPage = () => {
  const navigate = useNavigate();
  const { vibrate, showToast } = useAndroidApi();
  const [myRewards, setMyRewards] = useState<UserReward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMyRewards();
  }, []);

  const loadMyRewards = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getUserRewards();
      setMyRewards(response.userRewards);
    } catch (err) {
      console.error("Failed to load user rewards:", err);
      setError("Failed to load rewards.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    vibrate({ duration: 100 });
    navigate(-1);
  };

  const handleCopyCode = (code: string) => {
    vibrate({ duration: 100 });
    navigator.clipboard.writeText(code);
    showToast({ message: "Coupon code copied to clipboard!" });
  };

  const handleRedeemReward = (reward: UserReward) => {
    vibrate({ duration: 100 });
    if (reward.status === "PENDING" || reward.status === "CONFIRMED") {
      showToast({
        message: `${reward.reward.name} has been successfully redeemed!`,
      });
      // In practice, this should update the status via API call
    }
  };

  const getStatusIcon = (status: UserRewardStatus) => {
    switch (status) {
      case "CONFIRMED":
        return <HiCheckCircle className="w-5 h-5 text-green-500" />;
      case "PENDING":
        return <HiClock className="w-5 h-5 text-yellow-500" />;
      case "DELIVERED":
        return <HiCheckCircle className="w-5 h-5 text-blue-500" />;
      case "EXPIRED":
        return <HiXCircle className="w-5 h-5 text-red-500" />;
      case "CANCELLED":
        return <HiXCircle className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: UserRewardStatus) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "CONFIRMED":
        return "Active";
      case "DELIVERED":
        return "Delivered";
      case "EXPIRED":
        return "Expired";
      case "CANCELLED":
        return "Cancelled";
      default:
        return "";
    }
  };

  const getStatusColor = (status: UserRewardStatus) => {
    switch (status) {
      case "CONFIRMED":
        return "text-green-600 bg-green-50";
      case "PENDING":
        return "text-yellow-600 bg-yellow-50";
      case "DELIVERED":
        return "text-blue-600 bg-blue-50";
      case "EXPIRED":
        return "text-red-600 bg-red-50";
      case "CANCELLED":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US");
  };

  const isRewardActive = (status: UserRewardStatus) => {
    return status === "CONFIRMED" || status === "DELIVERED";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your rewards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadMyRewards}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-6">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBackClick}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors mr-2"
          >
            <HiChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">My Rewards</h1>
        </div>
      </div>

      <div className="px-4 pb-20">
        <div className="space-y-3">
          {myRewards.map((userReward, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {userReward.reward.type}
                    </span>
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        userReward.status
                      )}`}
                    >
                      {getStatusIcon(userReward.status)}
                      {getStatusText(userReward.status)}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {userReward.reward.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {userReward.reward.description}
                  </p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Redeemed: {formatDate(userReward.redeemedAt)}</p>
                    <p>Expires: {formatDate(userReward.expiresAt)}</p>
                    <p>Credits used: {userReward.creditCost}</p>
                    {userReward.deliveryAddress && (
                      <p>Delivery address: {userReward.deliveryAddress}</p>
                    )}
                    {userReward.trackingNumber && (
                      <p>Tracking number: {userReward.trackingNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {userReward.redemptionCode &&
                isRewardActive(userReward.status) && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Coupon Code:
                        </p>
                        <p className="font-mono text-sm bg-gray-100 px-3 py-2 rounded">
                          {userReward.redemptionCode}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleCopyCode(userReward.redemptionCode)
                          }
                          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Copy Code
                        </button>
                        <button
                          onClick={() => handleRedeemReward(userReward)}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Use Now
                        </button>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>

        {myRewards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No rewards redeemed yet</p>
            <button
              onClick={() => navigate("/my/credit/reward-shop")}
              className="mt-4 text-green-600 font-medium hover:text-green-700 transition-colors"
            >
              Go to Reward Shop
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRewardsPage;
