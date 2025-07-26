import React from 'react';

interface StatCardProps {
  value: string;
  label: string;
  color?: 'green' | 'blue' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ 
  value, 
  label, 
  color = 'green' 
}) => {
  const colorClasses = {
    green: 'text-green-600 border-green-200',
    blue: 'text-blue-600 border-blue-200',
    purple: 'text-purple-600 border-purple-200'
  };

  return (
    <div className={`border-2 ${colorClasses[color]} rounded-lg p-4 text-center bg-white`}>
      <p className={`text-2xl font-bold ${colorClasses[color].split(' ')[0]}`}>
        {value}
      </p>
      <p className="text-sm text-gray-600 mt-1">
        {label}
      </p>
    </div>
  );
};

export default StatCard;