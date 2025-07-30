import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAndroidApi } from "../hooks";
import { HiChevronLeft, HiOutlineSparkles } from "react-icons/hi";

const MyCarbonCreditPage: React.FC = () => {
  const navigate = useNavigate();
  const { vibrate } = useAndroidApi();

  const handleBackClick = () => {
    vibrate({ duration: 100 });
    navigate(-1);
  };

  const handleMenuClick = (menu: string) => {
    vibrate({ duration: 100 });

    switch (menu) {
      case "rewards":
        navigate("/my/credit/my-rewards");
        break;
      case "shop":
        navigate("/my/credit/reward-shop");
        break;
      case "history":
        navigate("/my/credit/usage-history");
        break;
    }
  };

  const menuItems = [
    {
      id: "shop",
      title: "Reward Shop",
      description: "Exchange points for rewards",
    },
    {
      id: "rewards",
      title: "My Rewards",
      description: "Check your earned rewards",
    },
    {
      id: "history",
      title: "Credit Usage History",
      description: "View your credit transaction history",
    },
  ];

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
          <h1 className="text-2xl font-bold text-gray-800">My Carbon Credit</h1>
        </div>

        <div className="mb-8">
          <div className="flex items-center mb-2">
            <HiOutlineSparkles className="w-6 h-6 text-green-500 mr-2" />
            <span className="text-2xl font-bold text-green-600">4,400</span>
          </div>
          <p className="text-gray-600">Available points to use</p>
        </div>
      </div>

      <div className="px-4 pb-20">
        <div className="space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className="w-full bg-white rounded-lg p-4 text-left border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCarbonCreditPage;
