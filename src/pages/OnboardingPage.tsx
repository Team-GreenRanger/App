import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import logo from "../assets/images/EcoLifeLogo.svg";
import leaf from "../assets/images/leaf.svg";
import credit from "../assets/images/credit.svg";
import image from "../assets/images/image_icon.svg";
import check from "../assets/images/check.svg";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      icon: (
        <img
          src={check}
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-26 lg:h-26"
          alt="Check icon"
        />
      ),
      title: "Take simple missions.\nMake real impact.",
      description: "Everyday actions turn into rewards.",
      buttonText: "Next",
    },
    {
      icon: (
        <img
          src={image}
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-26 lg:h-26"
          alt="Image icon"
        />
      ),
      title: "Complete eco-missions\nand upload proof.",
      description: "AI verifies your green actions.",
      buttonText: "Next",
    },
    {
      icon: (
        <img
          src={credit}
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-26 lg:h-26"
          alt="Credit icon"
        />
      ),
      title: "Get carbon credits\nfor every mission.",
      description: "Exchange them for discount coupons.",
      buttonText: "Next",
    },
    {
      icon: (
        <img
          src={leaf}
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-26 lg:h-26"
          alt="Leaf icon"
        />
      ),
      title: "You're all set\nstart your eco journey.",
      description: "Small steps, big change.",
      buttonText: "Start",
    },
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      navigate("/login");
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const PageIndicator = () => (
    <div className="flex justify-center space-x-2 mt-6 sm:mt-8">
      {pages.map((_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full ${
            index === currentPage ? "bg-green-500" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen w-full max-w-md mx-auto flex flex-col items-center bg-white">
      {/* Header */}
      <div className="text-center pt-8 sm:pt-12 pb-6 sm:pb-8 px-4">
        <img
          src={logo}
          alt="EcoLife Logo"
          className="h-8 sm:h-10 md:h-12 mx-auto"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-8 text-center">
        <div className="mb-6 sm:mb-8">{pages[currentPage].icon}</div>

        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight whitespace-pre-line">
          {pages[currentPage].title}
        </h2>

        <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-sm">
          {pages[currentPage].description}
        </p>

        <PageIndicator />
      </div>

      {/* Navigation */}
      <div className="w-full flex justify-between items-center p-4 sm:p-6 pb-8 sm:pb-12 md:pb-16 lg:pb-24">
        <button
          onClick={handleBack}
          className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-colors ${
            currentPage === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          disabled={currentPage === 0}
        >
          Back
        </button>

        <button
          onClick={handleNext}
          className="bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base hover:bg-green-600 transition-colors flex items-center space-x-2"
        >
          <span>{pages[currentPage].buttonText}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default OnboardingPage;
