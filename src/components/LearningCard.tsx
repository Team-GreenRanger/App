import React from "react";

interface LearningCardProps {
  title: string;
  description?: string;
  onClick?: () => void;
}

const LearningCard: React.FC<LearningCardProps> = ({ title, description, onClick }) => {
  return (
    <div className="w-full h-44 sm:h-48 bg-green-500 rounded-xl flex flex-col justify-center items-center gap-3 sm:gap-4 cursor-pointer hover:bg-green-600 transition-colors p-3 sm:p-4"
         onClick={onClick}>
      <div className="text-center flex-1 flex flex-col justify-center">
        <h1 className="text-white text-sm sm:text-base font-semibold mb-1 sm:mb-2 leading-tight">{title}</h1>
        {description && (
          <p className="text-green-100 text-xs sm:text-sm line-clamp-2 leading-relaxed">{description}</p>
        )}
      </div>
      <button className="w-24 sm:w-28 h-8 sm:h-9 bg-white rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-gray-100 transition-colors flex-shrink-0"
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