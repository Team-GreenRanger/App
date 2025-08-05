import React from 'react';
import { Brain, Sparkles, Search } from 'lucide-react';

interface AiTrashLoadingProps {
  stage: 'analyzing' | 'processing' | 'generating';
  progress?: number;
  message?: string;
  compact?: boolean;
}

const AiTrashLoading: React.FC<AiTrashLoadingProps> = ({ 
  stage, 
  progress = 0, 
  message,
  compact = false 
}) => {
  const getStageInfo = () => {
    switch (stage) {
      case 'analyzing':
        return {
          icon: <Search className="w-8 h-8 text-blue-500" />,
          title: 'Analyzing Image...',
          description: 'AI is analyzing the trash image to identify the type.',
          color: 'blue'
        };
      case 'processing':
        return {
          icon: <Brain className="w-8 h-8 text-purple-500" />,
          title: 'Processing Data...',
          description: 'Processing the analysis data and preparing results.',
          color: 'purple'
        };
      case 'generating':
        return {
          icon: <Sparkles className="w-8 h-8 text-green-500" />,
          title: 'Generating Guide...',
          description: 'Creating personalized disposal instructions.',
          color: 'green'
        };
      default:
        return {
          icon: <Brain className="w-8 h-8 text-gray-500" />,
          title: 'Processing...',
          description: 'AI is working on your request.',
          color: 'gray'
        };
    }
  };

  const stageInfo = getStageInfo();

  const getProgressBarColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500';
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
      <div className="flex flex-col items-center justify-center py-8 px-6 rounded-2xl bg-white">
        <div className="mb-6">
          <div className="animate-bounce">
            {stageInfo.icon}
          </div>
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

export default AiTrashLoading;