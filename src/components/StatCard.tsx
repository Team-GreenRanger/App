import React from "react";

interface StatCardProps {
  value: string;
  label: string;
}

const StatCard = ({ value, label }: StatCardProps) => {
  return (
    <div className="bg-green-50 border border-green-300 rounded-lg p-4 text-center">
      <p className={`text-2xl font-bold text-black`}>{value}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
};

export default StatCard;
