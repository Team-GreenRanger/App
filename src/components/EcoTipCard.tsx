import React from 'react';

interface EcoTipCardProps {
  title: string;
  description: string;
  icon?: string;
}

const EcoTipCard: React.FC<EcoTipCardProps> = ({ 
  title, 
  description, 
  icon = "💡" 
}) => {
  return (
    <div className="bg-green-500 rounded-xl p-4 text-white">
      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h3>
      <p className="text-sm leading-relaxed opacity-95">
        {description}
      </p>
    </div>
  );
};

export default EcoTipCard;