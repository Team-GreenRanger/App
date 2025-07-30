import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAndroidApi } from '../hooks';
import { HiChevronLeft, HiClock, HiCheckCircle } from 'react-icons/hi';

interface RewardItem {
  id: number;
  title: string;
  brand: string;
  discount: string;
  points: number;
  status: 'active' | 'used' | 'expired';
  redeemedDate: string;
  expiryDate: string;
  code?: string;
}

const MyRewardsPage: React.FC = () => {
  const navigate = useNavigate();
  const { vibrate, showToast } = useAndroidApi();

  const myRewards: RewardItem[] = [
    {
      id: 1,
      title: '30% discount code for Temu',
      brand: 'Temu',
      discount: '30%',
      points: 500,
      status: 'active',
      redeemedDate: '2024-07-20',
      expiryDate: '2024-08-20',
      code: 'TEMU30OFF'
    },
    {
      id: 2,
      title: 'Free Coffee Voucher',
      brand: 'Starbucks',
      discount: 'Free',
      points: 800,
      status: 'used',
      redeemedDate: '2024-07-15',
      expiryDate: '2024-07-30',
      code: 'SBX789123'
    },
    {
      id: 3,
      title: '$5 off coupon',
      brand: 'Aliexpress',
      discount: '$5',
      points: 600,
      status: 'expired',
      redeemedDate: '2024-06-20',
      expiryDate: '2024-07-20',
      code: 'ALI5OFF'
    }
  ];

  const handleBackClick = () => {
    vibrate({ duration: 100 });
    navigate(-1);
  };

  const handleCopyCode = (code: string) => {
    vibrate({ duration: 100 });
    navigator.clipboard.writeText(code);
    showToast({ message: 'Coupon code copied to clipboard!' });
  };

  const handleRedeemReward = (rewardId: number) => {
    vibrate({ duration: 100 });
    const reward = myRewards.find(r => r.id === rewardId);
    if (reward && reward.status === 'active') {
      showToast({ message: `Successfully redeemed ${reward.title}!` });
      // Here you would typically update the reward status to 'used'
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <HiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'used':
        return <HiCheckCircle className="w-5 h-5 text-gray-400" />;
      case 'expired':
        return <HiClock className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'used':
        return 'Used';
      case 'expired':
        return 'Expired';
      default:
        return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'used':
        return 'text-gray-600 bg-gray-50';
      case 'expired':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-6">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBackClick}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors mr-2"
          >
            <HiChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">My Rewards</h1>
        </div>
      </div>

      <div className="px-4 pb-20">
        <div className="space-y-3">
          {myRewards.map((reward) => (
            <div
              key={reward.id}
              className="bg-white rounded-lg p-4 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {reward.brand}
                    </span>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(reward.status)}`}>
                      {getStatusIcon(reward.status)}
                      {getStatusText(reward.status)}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {reward.title}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Redeemed: {reward.redeemedDate}</p>
                    <p>Expires: {reward.expiryDate}</p>
                    <p>Points used: {reward.points}</p>
                  </div>
                </div>
              </div>

              {reward.code && reward.status === 'active' && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Coupon Code:</p>
                      <p className="font-mono text-sm bg-gray-100 px-3 py-2 rounded">
                        {reward.code}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleCopyCode(reward.code!)}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Copy Code
                      </button>
                      <button
                        onClick={() => handleRedeemReward(reward.id)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Redeem
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {myRewards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No rewards redeemed yet</p>
            <button 
              onClick={() => navigate('/my/credit/reward-shop')}
              className="mt-4 text-green-600 font-medium hover:text-green-700 transition-colors"
            >
              Go to Reward Shop
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRewardsPage;