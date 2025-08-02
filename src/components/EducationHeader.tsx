import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Prop {
  title: string;
}

const EducationHeader = ({ title }: Prop) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-full py-1.5 flex items-center justify-center text-xl font-semibold relative border-b-2 border-b-gray-300">
      <ArrowLeft onClick={handleBack} className="w-5 h-5 absolute left-4" />
      <div className="w-65 text-center">{title}</div>
    </div>
  );
};

export default EducationHeader;
