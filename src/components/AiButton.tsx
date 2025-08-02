import React from "react";
import sparkle from "../assets/images/sparkles.svg";
import { useNavigate } from "react-router-dom";

const AiButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/ai-chat");
  };

  return (
    <button
      onClick={handleClick}
      className="w-18 h-18 rounded-full bg-gradient-to-br from-cyan-400 to-green-400 flex justify-center items-center absolute bottom-36 right-4 shadow-[3px_3px_12px_2px_rgba(0,_0,_0,_0.1)]"
    >
      <img src={sparkle} />
    </button>
  );
};

export default AiButton;
