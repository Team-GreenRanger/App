import React from "react";
import { Hash } from "lucide-react";

interface WelcomeSectionProps {
  onSubmit: (message: string) => void;
}

const AiWelcomeSection = ({ onSubmit }: WelcomeSectionProps) => {
  const handleTagClick = (message: string) => {
    onSubmit(message);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center px-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome!</h2>
        <p className="text-gray-600 text-base">
          AI chat will answer your questions about...
        </p>
      </div>

      {/* Suggestion Tags */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() =>
            handleTagClick("Tell me about eco-friendly lifestyle tips")
          }
          className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <Hash className="w-4 h-4" />
          <span>Eco-friendly life style</span>
        </button>
        <button
          onClick={() => handleTagClick("How can I deal with climate changes?")}
          className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <Hash className="w-4 h-4" />
          <span>Dealing with climate changes</span>
        </button>
      </div>
    </div>
  );
};

export default AiWelcomeSection;
