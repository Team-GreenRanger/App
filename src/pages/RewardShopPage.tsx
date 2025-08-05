import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAndroidApi } from "../hooks";
import { HiChevronLeft, HiOutlineSparkles } from "react-icons/hi";
import { getCarbonCreditBalance } from "../utils/carbon-credit.utils";
import { Reward } from "../types";
import { getRewards, redeemReward } from "../utils";
import ToastModal, { ToastModalProps } from "../components/ToastModal";

interface ModalState {
  isVisible: boolean;
  type: "info" | "warning" | "error" | "confirm";
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

const RewardShopPage = () => {
  const navigate = useNavigate();
  const { vibrate, showToast } = useAndroidApi();
  const [activeTab, setActiveTab] = useState("all");
  const [balance, setBalance] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [purchasingRewards, setPurchasingRewards] = useState<Set<string>>(
    new Set()
  );

  // 모달 상태 관리
  const [modalState, setModalState] = useState<ModalState>({
    isVisible: false,
    type: "info",
    title: "",
    message: "",
    showCancel: false,
  });

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
        setModalState({
          isVisible: true,
          type: "error",
          title: "Error",
          message: "Failed to load data. Please try again.",
          showCancel: false,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

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

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isVisible: false }));
  };

  const showModal = (config: Partial<ModalState>) => {
    setModalState({
      isVisible: true,
      type: "info",
      title: "",
      showCancel: false,
      ...config,
    });
  };

  const handlePurchaseClick = (reward: Reward) => {
    vibrate({ duration: 100 });

    // 구매 가능성 검증
    if (reward.status !== "AVAILABLE") {
      showModal({
        type: "warning",
        title: "Unavailable",
        message: "This reward is currently unavailable.",
      });
      return;
    }

    if (balance < reward.cost) {
      showModal({
        type: "warning",
        title: "Insufficient Points",
        message: `You need ${
          reward.cost - balance
        } more points to purchase this reward.`,
      });
      return;
    }

    if (reward.availableQuantity <= 0) {
      showModal({
        type: "warning",
        title: "Out of Stock",
        message: "This reward is currently out of stock.",
      });
      return;
    }

    if (purchasingRewards.has(reward.id)) {
      return;
    }

    // 구매 확인 모달 표시
    showModal({
      type: "confirm",
      title: "Confirm Purchase",
      message: `Are you sure you want to purchase "${reward.name}" for ${reward.cost} points?`,
      confirmText: "Purchase",
      cancelText: "Cancel",
      showCancel: true,
      onConfirm: () => handlePurchase(reward),
    });
  };

  const handlePurchase = async (reward: Reward) => {
    try {
      // 구매 중 상태로 설정
      setPurchasingRewards((prev) => new Set([...prev, reward.id]));

      // 물리적 상품의 경우 배송 주소가 필요할 수 있음
      let deliveryAddress: string | undefined;
      if (reward.type === "PHYSICAL_ITEM" || reward.type === "ECO_PRODUCT") {
        deliveryAddress = undefined;
      }

      const result = await redeemReward(reward.id, deliveryAddress);

      // 성공 모달 표시
      showModal({
        type: "info",
        title: "Purchase Successful!",
        message: `You have successfully purchased "${reward.name}". Check My Rewards to use it.`,
        confirmText: "Great!",
        onConfirm: () => {
          navigate("/my/credit/my-rewards");
        },
      });

      // 잔액 업데이트
      setBalance((prev) => prev - reward.cost);

      // 리워드 수량 업데이트
      setRewards((prev) =>
        prev.map((r) =>
          r.id === reward.id
            ? { ...r, availableQuantity: r.availableQuantity - 1 }
            : r
        )
      );

      // 진동 피드백
      vibrate({ duration: 200 });
    } catch (error) {
      console.error("리워드 구매 실패:", error);

      // 에러 모달 표시
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to purchase reward. Please try again.";

      showModal({
        type: "error",
        title: "Purchase Failed",
        message: errorMessage,
        confirmText: "OK",
      });
    } finally {
      // 구매 중 상태 해제
      setPurchasingRewards((prev) => {
        const newSet = new Set(prev);
        newSet.delete(reward.id);
        return newSet;
      });
    }
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
          {filteredRewards.map((reward) => {
            const isPurchasing = purchasingRewards.has(reward.id);
            const isDisabled =
              reward.status !== "AVAILABLE" ||
              balance < reward.cost ||
              reward.availableQuantity <= 0 ||
              isPurchasing;

            return (
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
                    onClick={() => handlePurchaseClick(reward)}
                    disabled={isDisabled}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      !isDisabled
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isPurchasing && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    )}
                    {isPurchasing
                      ? "Purchasing..."
                      : reward.status !== "AVAILABLE"
                      ? "Unavailable"
                      : reward.availableQuantity <= 0
                      ? "Out of Stock"
                      : balance < reward.cost
                      ? "Not enough points"
                      : "Purchase"}
                  </button>
                </div>
              </div>
            );
          })}
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

      {/* ToastModal 컴포넌트 */}
      <ToastModal
        isVisible={modalState.isVisible}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        onConfirm={modalState.onConfirm}
        onCancel={modalState.onCancel}
        onClose={closeModal}
        showCancel={modalState.showCancel}
      />
    </div>
  );
};

export default RewardShopPage;
