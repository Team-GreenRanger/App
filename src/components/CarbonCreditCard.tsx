import React from "react";
import CarbonCreditBackgroundImage from "../assets/images/CARBON_CREDIT_BANNER_BACKGROUND.png";

interface CarbonCreditCardProps {
  points: number;
  showArrow?: boolean;
  onClick?: () => void;
}

const CarbonCreditCard: React.FC<CarbonCreditCardProps> = ({
  points,
  showArrow = true,
  onClick,
}) => {
  return (
    <div
      className="relative bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white cursor-pointer transition-transform hover:scale-105"
      onClick={onClick}
      style={{
        backgroundImage: `url(${CarbonCreditBackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm opacity-90 mb-1">Your Carbon Credit</p>
          <p className="text-3xl font-bold">{points.toLocaleString()} Points</p>
          <p className="text-xs opacity-80 mt-2">
            Exchange it with discount coupons!
          </p>
        </div>
        {showArrow && (
          <div className="ml-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarbonCreditCard;
