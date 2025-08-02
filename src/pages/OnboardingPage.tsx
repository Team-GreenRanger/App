import React, { useState } from "react";
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
      icon: <img src={check} className="w-25 h-52" />,
      title: "Take simple missions.\nMake real impact.",
      description: "Everyday actions turn into rewards.",
      buttonText: "Next",
    },
    {
      icon: <img src={image} className="w-25 h-52" />,
      title: "Complete eco-missions\nand upload proof.",
      description: "AI verifies your green actions.",
      buttonText: "Next",
    },
    {
      icon: <img src={credit} className="w-25 h-52" />,
      title: "Get carbon credits\nfor every mission.",
      description: "Exchange them for discount coupons.",
      buttonText: "Next",
    },
    {
      icon: <img src={leaf} className="w-25 h-52" />,
      title: "You're all set\nstart your eco journey.",
      description: "Small steps, big change.",
      buttonText: "Start",
    },
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      navigate('/login');
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const PageIndicator = () => (
    <div className="flex justify-center space-x-2 mt-8">
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
    <div className="w-[393px] h-screen mx-auto flex flex-col items-center">
      {/* Header */}
      <div className="text-center pt-12 pb-8">
        <img src={logo} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="mb-8">{pages[currentPage].icon}</div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
          {pages[currentPage].title}
        </h2>

        <p className="text-gray-600 text-lg">
          {pages[currentPage].description}
        </p>

        <PageIndicator />
      </div>

      {/* Navigation */}
      <div className="w-full flex justify-between items-center p-6 pb-36">
        <button
          onClick={handleBack}
          className={`px-6 py-3 rounded-lg font-medium ${
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
          className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 flex items-center space-x-2"
        >
          <span>{pages[currentPage].buttonText}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default OnboardingPage;
