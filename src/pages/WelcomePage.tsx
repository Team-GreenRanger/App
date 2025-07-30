import logo from "../assets/images/EcoLifeLogo.svg";

const WelcomePage = () => {
  return (
    <div className="w-[393px] min-h-screen bg-gray-50 flex flex-col items-center justify-center mx-auto px-8 space-y-8">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img src={logo} />
      </div>

      {/* Description */}
      <div className="text-center">
        <p className="text-green-500 text-lg leading-relaxed">
          Take small steps toward
          <br />
          sustainability with missions.
        </p>
      </div>

      {/* Get Started Button */}
      <button className="bg-green-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-green-600 transition-colors">
        Get Started
      </button>
    </div>
  );
};

export default WelcomePage;
