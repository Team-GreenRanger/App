import React, { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import AiWelcomeSection from "../components/AiWelcomeSection";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean }>
  >([]);
  const [inputValue, setInputValue] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);

  const handleBackClick = () => {
    if (navigate) {
      navigate(-1);
    } else {
      console.log("Navigate back");
    }
  };

  const handleSubmit = (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (text) {
      // 메시지 추가
      setMessages([
        { text, isUser: true },
        {
          text: "Thanks for your question! This is a sample AI response.",
          isUser: false,
        },
      ]);
      setInputValue("");
      setShowWelcome(false); // Welcome 화면 숨기기
    }
  };

  return (
    <div className=" min-h-screen bg-white flex flex-col justify-between">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
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

      {/* Chat Content */}
      <div className="flex-1">
        {showWelcome ? (
          <AiWelcomeSection onSubmit={handleSubmit} />
        ) : (
          <div className="p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
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
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Enter your question"
            className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            onClick={() => handleSubmit()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
