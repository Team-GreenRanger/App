import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserProfileHeader,
  CarbonCreditCard,
  EcoTipCard,
  LearnMoreCard,
  NotificationCenter,
} from "../components";
import { useAndroidApi } from "../hooks";
import { HiSparkles, HiGlobeAlt } from "react-icons/hi";
import sparkle from "../assets/images/sparkles.svg";

const HomePage: React.FC = () => {
  const { updateBottomNavigation, showToast } = useAndroidApi();
  const navigate = useNavigate();
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  useEffect(() => {
    updateBottomNavigation("home");
  }, [updateBottomNavigation]);

  const handleCarbonCreditClick = () => {
    navigate("/my/credit");
  };

  const handleStartLearning = () => {
    showToast({ message: "학습 프로그램을 시작합니다!" });
  };

  const handleNotificationClick = () => {
    setIsNotificationVisible(true);
  };

  const handleCloseNotification = () => {
    setIsNotificationVisible(false);
  };

  const handleAiButton = () => {
    navigate("/ai-chat");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserProfileHeader
        name="ttohee Kim"
        onNotificationClick={handleNotificationClick}
      />

      <NotificationCenter
        isVisible={isNotificationVisible}
        onClose={handleCloseNotification}
      />

      <div className="px-4 pb-20">
        <div className="mb-6">
          <CarbonCreditCard points={4400} onClick={handleCarbonCreditClick} />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Welcome ttohee Kim!
          </h2>
          <p className="text-gray-600">You planted 2 Trees this week</p>
        </div>

        <div className="space-y-4">
          <EcoTipCard
            title="Today's Eco Tips"
            description="Unplug Electronic devices when not in use. Unplugging unused electronics can save about 50 kg of CO₂ annually and reduced your energy bill!"
            icon={<HiSparkles className="w-6 h-6 text-blue-600" />}
          />

          <LearnMoreCard
            title="Let's learn more!"
            description="Learn how to prevent climate change and stay prepared for extreme weather conditions."
            buttonText="Start Learning"
            icon={<HiGlobeAlt className="w-6 h-6 text-green-600" />}
            onButtonClick={handleStartLearning}
          />
        </div>
      </div>

      <button
        onClick={handleAiButton}
        className="w-18 h-18 bg-gradient-to-br from-cyan-400 to-green-400 rounded-full flex justify-center items-center absolute right-4 bottom-29"
      >
        <img src={sparkle} />
      </button>
    </div>
  );
};

export default HomePage;
