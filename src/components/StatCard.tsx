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
    green: 'text-green-600 bg-green-50 border-green-100',
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    purple: 'text-purple-600 bg-purple-50 border-purple-100'
  };

  const bgClass = colorClasses[color].split(' ')[1];
  const textClass = colorClasses[color].split(' ')[0];
  const borderClass = colorClasses[color].split(' ')[2];

  return (
    <div className={`${bgClass} border ${borderClass} rounded-lg p-4 text-center`}>
      <p className={`text-2xl font-bold ${textClass}`}>
        {value}
      </p>
      <p className="text-sm text-gray-600 mt-1">
        {label}
      </p>
    </div>
  );
};

export default StatCard;