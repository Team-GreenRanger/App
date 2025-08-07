import climate_change from "../assets/images/climate change.svg";
import weather from "../assets/images/weather.png";
import { useNavigate } from "react-router-dom";

const EducationPage = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: "climate-change",
      title: "Climate Change & Global Warming",
      subtitle: "Understand the science and impacts of climate change",
      image: climate_change,
      path: "/education/climate-change"
    },
    {
      id: "extreme-weather", 
      title: "Extreme Weather Preparedness",
      subtitle: "Stay safe during dangerous weather events",
      image: weather,
      path: "/education/extreme-weather"
    },
    {
      id: "waste-management",
      title: "Smart Waste Management", 
      subtitle: "Learn proper disposal and recycling methods",
      image: climate_change,
      path: "/education/waste-management"
    },
    {
      id: "sustainable-living",
      title: "Sustainable Daily Living",
      subtitle: "Eco-friendly choices for everyday life", 
      image: weather,
      path: "/education/sustainable-living"
    },
    {
      id: "green-transportation",
      title: "Sustainable Transportation",
      subtitle: "Electric vehicles and eco-friendly mobility",
      image: climate_change,
      path: "/education/green-transportation"
    }
  ];

  const handleCategoryClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-50 px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Education</h1>
        <p className="text-sm text-gray-500 mb-4">Learn about environmental topics and sustainable living practices</p>
      </div>

      <div className="px-6 pb-20">
        <div className="space-y-4">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              onClick={() => handleCategoryClick(category.path)}
            >
              <div className="relative h-48">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/90 to-green-600/90 z-10 flex flex-col justify-center items-center p-6">
                  <h2 className="text-white text-xl font-bold text-center mb-2 leading-tight">
                    {category.title}
                  </h2>
                  <p className="text-white/90 text-sm text-center mb-4 leading-relaxed">
                    {category.subtitle}
                  </p>
                  <button className="px-6 py-2 bg-white hover:bg-gray-100 rounded-lg text-green-600 font-semibold transition-colors">
                    Start Learning
                  </button>
                </div>
                <img
                  className="w-full h-full object-cover"
                  src={category.image}
                  alt={category.title}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationPage;