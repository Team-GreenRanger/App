import React, { useState, useRef, useEffect } from "react";
import sparkle from "../assets/images/sparkles.svg";
import { useNavigate } from "react-router-dom";
import { Bot, Camera, X } from "lucide-react";
import { AndroidApi } from "../api";

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
  const backdropRef = useRef<HTMLDivElement>(null);

  // 메뉴 옵션 정의
  const menuOptions: MenuOption[] = [
    {
      id: "ai-chat",
      label: "AI Chat",
      icon: <Bot className="w-5 h-5" />,
      onClick: () => {
        AndroidApi.vibrate({ duration: 100 });
        navigate("/ai-chat");
        setIsMenuOpen(false);
      },
    },
    {
      id: "recycle-tip",
      label: "Recycle Tip",
      icon: <Camera className="w-5 h-5" />,
      onClick: () => {
        AndroidApi.vibrate({ duration: 100 });
        navigate("/ai-trash-camera");
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

  // 메뉴 상태에 따른 body 스타일 변경
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleButtonClick = () => {
    AndroidApi.vibrate({ duration: 100 });
    setIsMenuOpen(!isMenuOpen);
  };

  const handleBackdropClick = () => {
    setIsMenuOpen(false);
  };

  return (
      <>
        {/* 배경 오버레이 */}
        {isMenuOpen && (
            <div
                ref={backdropRef}
                onClick={handleBackdropClick}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  zIndex: 40,
                  animation: 'fadeIn 0.2s ease-out',
                }}
            />
        )}

        <div ref={menuRef} className="fixed bottom-36 right-4 z-50">
          {/* 드롭업 메뉴 */}
          {isMenuOpen && (
              <div
                  className="absolute bottom-20 right-0 mb-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 min-w-[160px]"
                  style={{ animation: 'slideUp 0.2s ease-out' }}
              >
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
              className={`w-16 h-16 rounded-full flex justify-center items-center shadow-[3px_3px_12px_2px_rgba(0,_0,_0,_0.1)] transition-all duration-200 ${
                  isMenuOpen
                      ? "scale-110 bg-gray-400"
                      : "hover:scale-105 bg-gradient-to-br from-cyan-400 to-green-400"
              }`}
          >
            {isMenuOpen ? (
                <X
                    className="w-6 h-6 text-black"
                    strokeWidth={2.5}
                />
            ) : (
                <img
                    src={sparkle}
                    alt="AI"
                    className=""
                />
            )}
          </button>
        </div>

        <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
      </>
  );
};

export default AiButton;