import React from 'react';

interface RankingHeaderCardProps {
  rank: number;
  points: number;
}

const RankingHeaderCard: React.FC<RankingHeaderCardProps> = ({ 
  rank, 
  points 
}) => {
  return (
    <div 
      className="relative bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white mb-4"
      style={{
        backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3Cpattern id=\"leaves\" patternUnits=\"userSpaceOnUse\" width=\"20\" height=\"20\"%3E%3Ccircle cx=\"10\" cy=\"10\" r=\"8\" fill=\"%23ffffff\" opacity=\"0.1\"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\"100\" height=\"100\" fill=\"url(%23leaves)\"/%3E%3C/svg%3E')"
      }}
    >
      <div>
        <p className="text-2xl font-bold mb-1">Rank #{rank}</p>
        <p className="text-sm opacity-90 mb-1">Your Carbon Credit</p>
        <p className="text-3xl font-bold">{points.toLocaleString()} Points</p>
      </div>
    </div>
  );
};

export default RankingHeaderCard;