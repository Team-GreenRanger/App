import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, AlertCircle } from "lucide-react";
import AiWelcomeSection from "../components/AiWelcomeSection";
import { useNavigate } from "react-router-dom";
import { useAiChat } from "../hooks";
import { formatMessageText } from "../utils/textFormatter";

const ChatPage = () => {
  const navigate = useNavigate();
  const { messages, isLoading, error, sendMessage, clearError } = useAiChat();
  const [inputValue, setInputValue] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 메시지가 추가될 때마다 스크롤을 맨 아래로
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleBackClick = () => {
    if (navigate) {
      navigate(-1);
    } else {
      console.log("Navigate back");
    }
  };

  const handleSubmit = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (text && !isLoading) {
      setInputValue("");
      setShowWelcome(false);
      clearError();
      await sendMessage(text);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header - 고정 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackClick}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium text-gray-900">AI chat</h1>
        </div>
      </div>

      {/* Chat Content - 스크롤 가능 */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto">
        {showWelcome ? (
          <AiWelcomeSection onSubmit={handleSubmit} />
        ) : (
          <div className="p-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={message.id || index}
                  className={`flex ${
                    message.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 max-w-[320px] ${
                      message.isUser
                        ? "bg-gray-100 rounded-tr-md text-gray-900"
                        : "bg-green-500 rounded-tl-md text-white"
                    }`}
                  >
                    {message.isUser ? (
                      <p>{message.text}</p>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="font-semibold">AI Response</span>
                        </div>
                        <div className="text-sm leading-relaxed">
                          {formatMessageText(message.text)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-green-500 rounded-2xl rounded-tl-md px-4 py-3 text-white">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span className="text-sm">AI is responding...</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 스크롤 대상 요소 */}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area - 고정 */}
      <div className="p-4 border-t border-gray-100 flex-shrink-0">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Enter your question"
            disabled={isLoading}
            className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
          />
          <button
            onClick={() => handleSubmit()}
            disabled={isLoading || !inputValue.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
