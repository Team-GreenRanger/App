import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAndroidApi } from '../hooks';
import { HiChevronLeft, HiOutlineSparkles } from 'react-icons/hi';
import { Tabs } from '../components';

interface Reward {
  id: number;
  title: string;
  points: number;
  discount: string;
  canRedeem: boolean;
}

const RewardShopPage: React.FC = () => {
  const navigate = useNavigate();
  const { vibrate, showToast } = useAndroidApi();
  const [activeTab, setActiveTab] = useState('temu');

  const userPoints = 4400;

  const tabs = [
    { id: 'temu', label: 'Temu' },
    { id: 'starbucks', label: 'Starbucks' },
    { id: 'aliexpress', label: 'Aliexpress' }
  ];

  const rewards: Record<string, Reward[]> = {
    temu: [
      {
        id: 1,
        title: '30% discount code for Temu',
        points: 500,
        discount: '30%',
        canRedeem: true
      },
      {
        id: 2,
        title: '90% discount code for Temu',
        points: 5000,
        discount: '90%',
        canRedeem: false
      }
    ],
    starbucks: [
      {
        id: 3,
        title: 'Free Coffee Voucher',
        points: 800,
        discount: 'Free',
        canRedeem: true
      },
      {
        id: 4,
        title: '50% off any drink',
        points: 1200,
        discount: '50%',
        canRedeem: true
      }
    ],
    aliexpress: [
      {
        id: 5,
        title: '$5 off coupon',
        points: 600,
        discount: '$5',
        canRedeem: true
      },
      {
        id: 6,
        title: '$20 off coupon',
        points: 2000,
        discount: '$20',
        canRedeem: true
      }
    ]
  };

  const handleBackClick = () => {
    vibrate({ duration: 100 });
    navigate(-1);
  };

  const handlePurchase = (reward: Reward) => {
    vibrate({ duration: 100 });
    if (reward.canRedeem && userPoints >= reward.points) {
      showToast({ message: `Successfully purchased ${reward.title}! Check My Rewards to use it.` });
    } else if (userPoints < reward.points) {
      showToast({ message: 'Not enough points to purchase this reward' });
    } else {
      showToast({ message: 'This reward is currently unavailable' });
    }
  };

  const currentRewards = rewards[activeTab] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={handleBackClick}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors mr-2"
            >
              <HiChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Reward Shop</h1>
          </div>
          <div className="flex items-center">
            <HiOutlineSparkles className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-lg font-bold text-green-600">{userPoints.toLocaleString()}</span>
          </div>
        </div>

        <Tabs 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <div className="px-4 pb-20 pt-4">
        <div className="space-y-3">
          {currentRewards.map((reward) => (
            <div
              key={reward.id}
              className="bg-white rounded-lg p-4 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 flex-1">
                  {reward.title}
                </h3>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-600">
                  {reward.points} point
                </span>
                
                <button
                  onClick={() => handlePurchase(reward)}
                  disabled={!reward.canRedeem || userPoints < reward.points}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    reward.canRedeem && userPoints >= reward.points
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {!reward.canRedeem ? 'Unavailable' : 
                   userPoints < reward.points ? 'Not enough points' : 
                   'Purchase'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {currentRewards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No rewards available for {activeTab}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardShopPage;