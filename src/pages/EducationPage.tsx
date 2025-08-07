import climate_change from "../assets/images/climate change.svg";
import weather from "../assets/images/weather.png";
import { useNavigate } from "react-router-dom";
import { AndroidApi } from "../api";

const EducationPage = () => {
  const navigate = useNavigate();

  const handleLearnClimateChange = () => {
    AndroidApi.vibrate({ duration: 100 });
    navigate("/education/climate-change");
  };

  const handleLearnExtremeWeather = () => {
    AndroidApi.vibrate({ duration: 100 });
    navigate("/education/extreme-weather");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-start pt-4 sm:pt-6 lg:pt-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
          Education
        </h1>
      </div>

      {/* Content Cards */}
      <div className="w-full max-w-4xl flex flex-col gap-6 sm:gap-8 lg:gap-10">
        {/* Climate Change Card */}
        <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 rounded-xl bg-gray-400 overflow-hidden relative group cursor-pointer transition-transform hover:scale-105">
          <div className="w-full flex flex-col items-center gap-3 sm:gap-4 lg:gap-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 px-4">
            <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-center leading-tight">
              Learn about
              <br /> climate change
            </h1>
            <button
              onClick={handleLearnClimateChange}
              className="px-4 py-2 sm:px-6 sm:py-2.5 lg:px-8 lg:py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white text-sm sm:text-base lg:text-lg font-semibold transition-colors shadow-lg"
            >
              Let's learn
            </button>
          </div>
          <img
            className="w-full h-full object-cover brightness-50 group-hover:brightness-40 transition-all duration-300"
            src={climate_change}
            alt="Climate change illustration"
          />
        </div>

        {/* Extreme Weather Card */}
        <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 rounded-xl bg-gray-400 overflow-hidden relative group cursor-pointer transition-transform hover:scale-105">
          <div className="w-full flex flex-col items-center gap-3 sm:gap-4 lg:gap-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 px-4">
            <h1 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-center leading-tight">
              How to stay prepared for extreme weather
            </h1>
            <button
              onClick={handleLearnExtremeWeather}
              className="px-4 py-2 sm:px-6 sm:py-2.5 lg:px-8 lg:py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white text-sm sm:text-base lg:text-lg font-semibold transition-colors shadow-lg"
            >
              Let's learn
            </button>
          </div>
          <img
            className="w-full h-full object-cover brightness-50 group-hover:brightness-40 transition-all duration-300"
            src={weather}
            alt="Extreme weather illustration"
          />
        </div>
      </div>

      {/* Bottom spacing for mobile navigation */}
      <div className="pb-20 sm:pb-16 lg:pb-8"></div>
    </div>
  );
};

export default EducationPage;
