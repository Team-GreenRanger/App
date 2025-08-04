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
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 키보드 높이 감지 및 처리
  useEffect(() => {
    const handleResize = () => {
      // viewport 높이와 화면 높이의 차이로 키보드 높이 계산
      const viewportHeight =
        window.visualViewport?.height || window.innerHeight;
      const windowHeight = window.screen.height;
      const keyboardHeight = Math.max(0, window.innerHeight - viewportHeight);

      setKeyboardHeight(keyboardHeight);
    };

    const handleVisualViewportChange = () => {
      if (window.visualViewport) {
        const keyboardHeight = Math.max(
          0,
          window.innerHeight - window.visualViewport.height
        );
        setKeyboardHeight(keyboardHeight);
      }
    };

    // iOS Safari 대응
    if (window.visualViewport) {
      window.visualViewport.addEventListener(
        "resize",
        handleVisualViewportChange
      );
    }

    // Android 및 기타 브라우저 대응
    window.addEventListener("resize", handleResize);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          handleVisualViewportChange
        );
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 입력창 포커스 시 키보드가 올라오면 스크롤 조정
  useEffect(() => {
    if (keyboardHeight > 0 && inputRef.current === document.activeElement) {
      // 키보드가 올라왔을 때 약간의 딜레이 후 스크롤
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    }
  }, [keyboardHeight]);

  // 메시지가 추가될 때마다 스크롤을 맨 아래로
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
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

  const handleInputFocus = () => {
    // 입력창 포커스 시 키보드가 올라올 때까지 약간 대기 후 스크롤
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);
  };

  return (
    <div
      className="bg-white flex flex-col"
      style={{
        height: "100vh",
        paddingBottom: keyboardHeight > 0 ? `${keyboardHeight}px` : "0px",
      }}
    >
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
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto"
        style={{
          paddingBottom: keyboardHeight > 80 ? "80px" : "0px", // 입력창을 위한 여유 공간
        }}
      >
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

      {/* Input Area - 키보드 높이에 따라 위치 조정 */}
      <div
        className="p-4 border-t border-gray-100 flex-shrink-0 bg-white"
        style={{
          position: keyboardHeight > 0 ? "fixed" : "relative",
          bottom: keyboardHeight > 0 ? `${keyboardHeight}px` : "auto",
          left: keyboardHeight > 0 ? "0" : "auto",
          right: keyboardHeight > 0 ? "0" : "auto",
          zIndex: keyboardHeight > 0 ? 1000 : "auto",
        }}
      >
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            onFocus={handleInputFocus}
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
