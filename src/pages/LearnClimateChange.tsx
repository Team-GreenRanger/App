import EducationHeader from "../components/EducationHeader";
import LearningCard from "../components/LearningCard";

const LearnClimateChange = () => {
  return (
    <div className="min-h-screen flex flex-col items-center pt-10 gap-5">
      <EducationHeader title="Learn about climate change" />

      <div className="w-full px-10 flex flex-wrap gap-4">
        <LearningCard title="What is climate change" />
        <LearningCard title="What is climate change" />
        <LearningCard title="What is climate change" />
      </div>
    </div>
  );
};

export default LearnClimateChange;
