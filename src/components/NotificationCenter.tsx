import React, { useEffect, useState } from 'react';
import { HiX, HiCheckCircle, HiInformationCircle, HiExclamation } from 'react-icons/hi';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'info' | 'warning';
  app: string;
  unread: boolean;
}

interface NotificationCenterProps {
  isVisible: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isVisible, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Mission Completed!',
      message: 'You successfully completed "Turn off unused lights" mission. +100 points earned!',
      time: '2 minutes ago',
      type: 'success',
      app: 'EcoLife',
      unread: true
    },
    {
      id: 2,
      title: 'Daily Check-in Bonus',
      message: 'Welcome back! You earned 50 bonus points for your daily check-in.',
      time: '1 hour ago',
      type: 'info',
      app: 'EcoLife',
      unread: true
    },
    {
      id: 3,
      title: 'Reward Available',
      message: 'New discount coupon is available in the Reward Shop. Check it out!',
      time: '3 hours ago',
      type: 'info',
      app: 'EcoLife',
      unread: false
    },
    {
      id: 4,
      title: 'Weekly Goal Reminder',
      message: 'You are 2 missions away from completing your weekly eco goal.',
      time: '1 day ago',
      type: 'warning',
      app: 'EcoLife',
      unread: false
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <HiCheckCircle className="w-6 h-6 text-green-500" />;
      case 'info':
        return <HiInformationCircle className="w-6 h-6 text-blue-500" />;
      case 'warning':
        return <HiExclamation className="w-6 h-6 text-orange-500" />;
      default:
        return <HiInformationCircle className="w-6 h-6 text-blue-500" />;
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <>
      {/* Backdrop */}
      {isVisible && (
        <div 
          className="fixed inset-0 z-40"
          onClick={onClose}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        />
      )}

      {/* Notification Panel */}
      <div 
        className={`fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white z-50 transition-all duration-300 ease-out ${
          isVisible 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-full opacity-0'
        }`}
        style={{
          maxHeight: '80vh',
          borderBottomLeftRadius: '20px',
          borderBottomRightRadius: '20px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <HiX className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 80px)' }}>
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiInformationCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    notification.unread ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-sm font-medium ${
                          notification.unread ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </p>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {notification.app}
                        </span>
                        <span className="text-xs text-gray-500">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationCenter;