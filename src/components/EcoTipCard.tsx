import React from 'react';
import { HiLightBulb } from 'react-icons/hi';

interface EcoTipCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const EcoTipCard: React.FC<EcoTipCardProps> = ({ 
  title, 
  description, 
  icon = <HiLightBulb className="w-6 h-6 text-blue-600" /> 
}) => {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-900">
      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 text-blue-800">
        <span className="flex items-center">{icon}</span>
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-blue-700">
        {description}
      </p>
    </div>
  );
};

export default EcoTipCard;