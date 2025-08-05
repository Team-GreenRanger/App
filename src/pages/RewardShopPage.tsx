import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAndroidApi } from "../hooks";
import { HiChevronLeft, HiOutlineSparkles } from "react-icons/hi";
import { getCarbonCreditBalance } from "../utils/carbon-credit.utils";
import { Reward } from "../types";
import { getRewards } from "../utils";

const RewardShopPage = () => {
  const navigate = useNavigate();
  const { vibrate, showToast } = useAndroidApi();
  const [activeTab, setActiveTab] = useState("all");
  const [balance, setBalance] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [creditData, rewardData] = await Promise.all([
          getCarbonCreditBalance(),
          getRewards(),
        ]);
        setBalance(creditData.balance);
        setRewards(rewardData.rewards);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        showToast({ message: "데이터를 불러오는데 실패했습니다." });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [showToast]);

  const tabs = [
    { id: "all", label: "All" },
    { id: "DISCOUNT_COUPON", label: "Coupons" },
    { id: "GIFT_CARD", label: "Gift Cards" },
    { id: "ECO_PRODUCT", label: "Eco Products" },
  ];

  const handleBackClick = () => {
    vibrate({ duration: 100 });
    navigate(-1);
  };

  const handlePurchase = (reward: Reward) => {
    vibrate({ duration: 100 });

    if (reward.status !== "AVAILABLE") {
      showToast({ message: "This reward is currently unavailable" });
      return;
    }

    if (balance < reward.cost) {
      showToast({ message: "Not enough points to purchase this reward" });
      return;
    }

    if (reward.availableQuantity <= 0) {
      showToast({ message: "This reward is out of stock" });
      return;
    }

    showToast({
      message: `Successfully purchased ${reward.name}! Check My Rewards to use it.`,
    });
  };

  // 탭에 따른 리워드 필터링
  const filteredRewards = rewards.filter((reward) => {
    if (activeTab === "all") return true;
    return reward.type === activeTab;
  });

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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={handleBackClick}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors mr-2"
            >
              <HiChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Reward Shop</h1>
          </div>
          <div className="flex items-center">
            <HiOutlineSparkles className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-lg font-bold text-green-600">
              {balance.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-20 pt-4">
        <div className="space-y-3">
          {filteredRewards.map((reward) => (
            <div
              key={reward.id}
              className="bg-white rounded-lg p-4 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {reward.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {reward.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        reward.status === "AVAILABLE"
                          ? "bg-green-100 text-green-800"
                          : reward.status === "OUT_OF_STOCK"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {reward.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {reward.availableQuantity} available
                    </span>
                  </div>
                </div>
                {reward.imageUrl && (
                  <img
                    src={reward.imageUrl}
                    alt={reward.name}
                    className="w-16 h-16 object-cover rounded-lg ml-4"
                  />
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-600">
                  {reward.cost} points
                </span>

                <button
                  onClick={() => handlePurchase(reward)}
                  disabled={
                    reward.status !== "AVAILABLE" ||
                    balance < reward.cost ||
                    reward.availableQuantity <= 0
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    reward.status === "AVAILABLE" &&
                    balance >= reward.cost &&
                    reward.availableQuantity > 0
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {reward.status !== "AVAILABLE"
                    ? "Unavailable"
                    : reward.availableQuantity <= 0
                    ? "Out of Stock"
                    : balance < reward.cost
                    ? "Not enough points"
                    : "Purchase"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredRewards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No rewards available
              {activeTab !== "all" ? ` for ${activeTab}` : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardShopPage;
