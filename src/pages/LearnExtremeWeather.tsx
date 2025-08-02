import React from "react";
import EducationHeader from "../components/EducationHeader";
import LearningCard from "../components/LearningCard";

const LearnExtremeWeather = () => {
  return (
    <div className="min-h-screen flex flex-col items-center pt-10 gap-5">
      <EducationHeader title="How to stay prepared for extreme weather" />

      <div className="w-full px-10 flex flex-wrap gap-4">
        <LearningCard title="Heat wave" />
      </div>
    </div>
  );
};

export default LearnExtremeWeather;
