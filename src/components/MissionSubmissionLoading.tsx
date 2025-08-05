import React from 'react';
import { Upload, Clock, CheckCircle, Sparkles } from 'lucide-react';
import loadingImage from '../assets/images/loading.png';
import loadingGif from '../assets/images/9oNLGsM5ARfPrfZWVvvI.gif';

interface MissionSubmissionLoadingProps {
  stage: 'uploading' | 'submitting' | 'verifying';
  progress?: number;
  message?: string;
  compact?: boolean;
}

const MissionSubmissionLoading: React.FC<MissionSubmissionLoadingProps> = ({ 
  stage, 
  progress = 0, 
  message,
  compact = false 
}) => {
  const getStageInfo = () => {
    switch (stage) {
      case 'uploading':
        return {
          icon: <Upload className="w-8 h-8 text-blue-500" />,
          title: '이미지 업로드 중...',
          description: '미션 증거 사진을 서버에 업로드하고 있습니다.',
          color: 'blue'
        };
      case 'submitting':
        return {
          icon: <Clock className="w-8 h-8 text-orange-500" />,
          title: '미션 제출 중...',
          description: '미션 정보를 서버에 제출하고 있습니다.',
          color: 'orange'
        };
      case 'verifying':
        return {
          icon: <img src={loadingGif} alt="Loading" className="w-48 h-auto max-w-none" />,
          title: 'AI 검증 중...',
          description: 'AI가 미션 완료 여부를 자동으로 검증하고 있습니다.',
          color: 'purple'
        };
      default:
        return {
          icon: <CheckCircle className="w-8 h-8 text-green-500" />,
          title: '처리 중...',
          description: '미션을 처리하고 있습니다.',
          color: 'green'
        };
    }
  };

  const stageInfo = getStageInfo();

  const getProgressBarColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500';
      case 'orange':
        return 'bg-orange-500';
      case 'purple':
        return 'bg-purple-500';
      case 'green':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-6 rounded-2xl" style={{ backgroundColor: '#D7ECFE' }}>
        <div className="mb-6">
          {stageInfo.icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">
          {stageInfo.title}
        </h3>
        <p className="text-gray-600 text-sm text-center leading-relaxed">
          {message || stageInfo.description}
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 mx-4 max-w-sm w-full shadow-2xl">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="flex justify-center mb-4">
              <div className="animate-bounce">
                {stageInfo.icon}
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(stageInfo.color)}`}
                style={{ width: `${Math.max(progress, 20)}%` }}
              />
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {stageInfo.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4">
            {message || stageInfo.description}
          </p>

          <div className="flex justify-center">
            <div className="flex space-x-1">
              <div className={`w-2 h-2 ${getProgressBarColor(stageInfo.color)} rounded-full animate-pulse`}></div>
              <div className={`w-2 h-2 ${getProgressBarColor(stageInfo.color)} rounded-full animate-pulse`} style={{ animationDelay: '0.2s' }}></div>
              <div className={`w-2 h-2 ${getProgressBarColor(stageInfo.color)} rounded-full animate-pulse`} style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionSubmissionLoading;