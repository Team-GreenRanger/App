import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAndroidApi } from '../hooks';
import { HiChevronLeft, HiPlus, HiMinus } from 'react-icons/hi';

interface Transaction {
  id: number;
  type: 'earned' | 'spent';
  amount: number;
  description: string;
  date: string;
  category: string;
}

const CreditUsageHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { vibrate } = useAndroidApi();
  const [filter, setFilter] = useState<'all' | 'earned' | 'spent'>('all');

  const transactions: Transaction[] = [
    {
      id: 1,
      type: 'earned',
      amount: 100,
      description: 'Mission completed: Turn off unused lights',
      date: '2024-07-27',
      category: 'Mission'
    },
    {
      id: 2,
      type: 'spent',
      amount: 500,
      description: 'Redeemed: 30% discount code for Temu',
      date: '2024-07-26',
      category: 'Reward'
    },
    {
      id: 3,
      type: 'earned',
      amount: 150,
      description: 'Daily check-in bonus',
      date: '2024-07-26',
      category: 'Bonus'
    },
    {
      id: 4,
      type: 'spent',
      amount: 800,
      description: 'Redeemed: Free Coffee Voucher (Starbucks)',
      date: '2024-07-25',
      category: 'Reward'
    },
    {
      id: 5,
      type: 'earned',
      amount: 200,
      description: 'Mission completed: Use public transportation',
      date: '2024-07-24',
      category: 'Mission'
    },
    {
      id: 6,
      type: 'earned',
      amount: 75,
      description: 'Mission completed: Recycle plastic bottles',
      date: '2024-07-23',
      category: 'Mission'
    }
  ];

  const handleBackClick = () => {
    vibrate({ duration: 100 });
    navigate(-1);
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const totalEarned = transactions
    .filter(t => t.type === 'earned')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transactions
    .filter(t => t.type === 'spent')
    .reduce((sum, t) => sum + t.amount, 0);

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
          <h1 className="text-2xl font-bold text-gray-800">Credit Usage History</h1>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{totalEarned.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Earned</p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{totalSpent.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Spent</p>
          </div>
        </div>

        <div className="flex space-x-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'earned', label: 'Earned' },
            { id: 'spent', label: 'Spent' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab.id
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-20">
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white rounded-lg p-4 border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      transaction.type === 'earned' 
                        ? 'bg-green-100' 
                        : 'bg-red-100'
                    }`}>
                      {transaction.type === 'earned' ? (
                        <HiPlus className={`w-4 h-4 ${
                          transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                        }`} />
                      ) : (
                        <HiMinus className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {transaction.description}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {transaction.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {transaction.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-bold text-lg ${
                    transaction.type === 'earned' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {transaction.type === 'earned' ? '+' : '-'}{transaction.amount}
                  </span>
                  <p className="text-xs text-gray-500">points</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditUsageHistoryPage;