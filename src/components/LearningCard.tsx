import React from "react";
import { useNavigate } from "react-router-dom";

interface Prop {
  title: string;
}

const LearningCard = ({ title }: Prop) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/education/learnig-page");
  };

  return (
    <div className="w-44 h-44 bg-green-500 rounded-xl flex flex-col justify-center items-center gap-4">
      <h1 className="text-white text-xl font-semibold text-center">{title}</h1>
      <button
        onClick={handleClick}
        className="w-28.5 h-9.5 bg-white rounded-xl text-base font-semibold"
      >
        Let’s learn
      </button>
    </div>
  );
};

export default LearningCard;
