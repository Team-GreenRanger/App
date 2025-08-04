import EducationHeader from "../components/EducationHeader";
import LearningCard from "../components/LearningCard";

const LearnClimateChange = () => {
  return (
    <div className="min-h-screen flex flex-col items-center pt-6 sm:pt-8 lg:pt-10 gap-4 sm:gap-5 lg:gap-6">
      <EducationHeader title="Learn about climate change" />

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 flex flex-wrap gap-3 sm:gap-4 lg:gap-5">
        <div className="w-[calc(50%-0.375rem)] sm:w-[calc(50%-0.5rem)] lg:w-[calc(50%-0.625rem)]">
          <LearningCard title="What is climate change" />
        </div>
        <div className="w-[calc(50%-0.375rem)] sm:w-[calc(50%-0.5rem)] lg:w-[calc(50%-0.625rem)]">
          <LearningCard title="What is climate change" />
        </div>
        <div className="w-[calc(50%-0.375rem)] sm:w-[calc(50%-0.5rem)] lg:w-[calc(50%-0.625rem)]">
          <LearningCard title="What is climate change" />
        </div>
      </div>
    </div>
  );
};

export default LearnClimateChange;
