import React from 'react';

interface LearnMoreCardProps {
  title: string;
  description: string;
  buttonText: string;
  icon?: string;
  onButtonClick?: () => void;
}

const LearnMoreCard: React.FC<LearnMoreCardProps> = ({ 
  title, 
  description, 
  buttonText,
  icon = "📚",
  onButtonClick 
}) => {
  return (
    <div className="bg-green-500 rounded-xl p-4 text-white">
      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h3>
      <p className="text-sm leading-relaxed opacity-95 mb-4">
        {description}
      </p>
      <button 
        onClick={onButtonClick}
        className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default LearnMoreCard;