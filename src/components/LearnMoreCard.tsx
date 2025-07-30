import React from 'react';
import { HiAcademicCap } from 'react-icons/hi';

interface LearnMoreCardProps {
  title: string;
  description: string;
  buttonText: string;
  icon?: React.ReactNode;
  onButtonClick?: () => void;
}

const LearnMoreCard: React.FC<LearnMoreCardProps> = ({ 
  title, 
  description, 
  buttonText,
  icon = <HiAcademicCap className="w-6 h-6 text-green-600" />,
  onButtonClick 
}) => {
  return (
    <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-green-900">
      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 text-green-800">
        <span className="flex items-center">{icon}</span>
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-green-700 mb-4">
        {description}
      </p>
      <button 
        onClick={onButtonClick}
        className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium text-base transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default LearnMoreCard;