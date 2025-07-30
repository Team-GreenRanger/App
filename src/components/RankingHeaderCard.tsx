import React from 'react';
import RankingBannerImage from '../assets/images/RANKING_BANNER.png';

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
      className="relative bg-green-600 rounded-lg p-6 text-white mb-4 overflow-hidden"
      style={{
        backgroundImage: `url(${RankingBannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="relative z-10">
        <p className="text-xl font-bold mb-1">Rank #{rank}</p>
        <p className="text-sm opacity-90 mb-1">Your Carbon Credit</p>
        <p className="text-2xl font-bold">{points.toLocaleString()} Points</p>
      </div>
    </div>
  );
};

export default RankingHeaderCard;