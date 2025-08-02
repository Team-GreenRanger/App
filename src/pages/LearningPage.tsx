import React from "react";
import EducationHeader from "../components/EducationHeader";
import climate_change from "../assets/images/climate change.svg";

const LearningPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center pt-10 gap-5">
      <EducationHeader title="What is climate change" />

      <div className="w-full flex flex-col gap-8 items-center px-5">
        <img src={climate_change} className="w-full" />
        <p className="text-xl font-normal">
          Climate change is a long-term shift in global temperatures and weather
          patterns. It is mainly caused by human activities, like burning fossil
          fuels, which increase greenhouse gases in the atmosphere.
        </p>
      </div>
    </div>
  );
};

export default LearningPage;
