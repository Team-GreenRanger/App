import React from "react";
import climate_change from "../assets/images/climate change.svg";
import weather from "../assets/images/weather.png";
import { useNavigate } from "react-router-dom";

const EducationPage = () => {
  const navigate = useNavigate();

  const handleLearnClimateChange = () => {
    navigate("/education/climate-change");
  };

  const handleLearnExtremeWeather = () => {
    navigate("/education/extreme-weather");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4">
      <div className="w-full flex justify-start pt-6 pb-20">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Education</h1>
      </div>

      <div className="w-full flex flex-col gap-10">
        <div className="w-full h-66 rounded-xl bg-gray-400 overflow-hidden relative">
          <div className="w-full flex flex-col items-center gap-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1">
            <h1 className="text-white text-4xl font-bold text-center">
              Learn about
              <br /> climate change
            </h1>
            <button
              onClick={handleLearnClimateChange}
              className="w-28 h-9.5 bg-green-500 rounded-xl text-white text-base font-semibold"
            >
              Let’s learn
            </button>
          </div>
          <img
            className="w-full h-full object-cover brightness-50"
            src={climate_change}
          />
        </div>

        <div className="w-full h-66 rounded-xl bg-gray-400 overflow-hidden relative">
          <div className="w-full flex flex-col items-center gap-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1">
            <h1 className="text-white text-4xl font-bold text-center">
              How to stay prepared for extreme weather
            </h1>
            <button
              onClick={handleLearnExtremeWeather}
              className="w-28 h-9.5 bg-green-500 rounded-xl text-white text-base font-semibold"
            >
              Let’s learn
            </button>
          </div>
          <img
            className="w-full h-full object-cover brightness-50"
            src={weather}
          />
        </div>
      </div>
    </div>
  );
};

export default EducationPage;
