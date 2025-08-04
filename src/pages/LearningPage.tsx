import React from "react";
import EducationHeader from "../components/EducationHeader";
import climate_change from "../assets/images/climate change.svg";

const LearningPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center pt-6 sm:pt-8 lg:pt-10 gap-4 sm:gap-5 lg:gap-6">
      <EducationHeader title="What is climate change" />

      <div className="w-full max-w-4xl flex flex-col gap-6 sm:gap-7 md:gap-8 items-center px-4 sm:px-5 md:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          <img
            src={climate_change}
            className="w-full h-auto rounded-lg shadow-sm"
            alt="Climate change illustration"
          />
        </div>

        <div className="w-full max-w-3xl">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-normal leading-relaxed text-gray-800 text-center sm:text-left">
            Climate change is a long-term shift in global temperatures and
            weather patterns. It is mainly caused by human activities, like
            burning fossil fuels, which increase greenhouse gases in the
            atmosphere.
          </p>
        </div>
      </div>

      {/* Bottom spacing for mobile navigation */}
      <div className="pb-20 sm:pb-16 lg:pb-8"></div>
    </div>
  );
};

export default LearningPage;
