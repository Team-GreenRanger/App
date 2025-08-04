import React from "react";

interface LearningCardProps {
  title: string;
  description?: string;
  onClick?: () => void;
}

const LearningCard: React.FC<LearningCardProps> = ({ title, description, onClick }) => {
  return (
    <div className="w-full h-44 bg-green-500 rounded-xl flex flex-col justify-center items-center gap-4 cursor-pointer hover:bg-green-600 transition-colors"
         onClick={onClick}>
      <div className="text-center px-4">
        <h1 className="text-white text-lg font-semibold mb-1">{title}</h1>
        {description && (
          <p className="text-green-100 text-sm line-clamp-2">{description}</p>
        )}
      </div>
      <button className="w-28 h-9 bg-white rounded-xl text-base font-semibold hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}>
        Let's learn
      </button>
    </div>
  );
};

export default LearningCard;