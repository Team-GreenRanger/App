import React, { useState, useRef, useEffect } from "react";
import sparkle from "../assets/images/sparkles.svg";
import { useNavigate } from "react-router-dom";
import { Bot, Camera } from "lucide-react";

interface MenuOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const AiButton = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 메뉴 옵션 정의
  const menuOptions: MenuOption[] = [
    {
      id: "ai-chat",
      label: "AI Chat",
      icon: <Bot className="w-5 h-5" />,
      onClick: () => {
        navigate("/ai-chat");
        setIsMenuOpen(false);
      },
    },
    {
      id: "recycle-tip",
      label: "Recycle Tip",
      icon: <Camera className="w-5 h-5" />,
      onClick: () => {
        // TODO: 쓰레기 분리수거 AI 분석 페이지로 이동
        console.log("Recycle Tip clicked - AI 분석 기능 예정");
        setIsMenuOpen(false);
      },
    },
  ];

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleButtonClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div ref={menuRef} className="fixed bottom-36 right-4 z-50">
      {/* 드롭업 메뉴 */}
      {isMenuOpen && (
        <div className="absolute bottom-20 right-0 mb-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 min-w-[160px] animate-in slide-in-from-bottom-2 duration-200">
          {menuOptions.map((option, index) => (
            <button
              key={option.id}
              onClick={option.onClick}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="text-gray-600">{option.icon}</div>
              <span className="text-gray-800 font-medium text-sm">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* AI 버튼 */}
      <button
        onClick={handleButtonClick}
        className={`w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-green-400 flex justify-center items-center shadow-[3px_3px_12px_2px_rgba(0,_0,_0,_0.1)] transition-transform ${
          isMenuOpen ? "scale-110" : "hover:scale-105"
        }`}
      >
        <img 
          src={sparkle} 
          alt="AI" 
          className={`transition-transform ${
            isMenuOpen ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
};

export default AiButton;
