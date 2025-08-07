import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Globe,
  Calendar,
  ChevronDown,
  Search,
} from "lucide-react";
import logo from "../assets/images/EcoLifeLogo.svg";
import { useNavigate } from "react-router-dom";
import { publicApi } from "../api";
import { ToastModal } from "../components";
import { saveAuthData } from "../utils/auth.utils";
import { AndroidApi } from "../api";
import countryData from "../assets/data/country.json";

interface FormData {
  email: string;
  name: string;
  password: string;
  nationality: string;
  age: string;
}

interface SignupResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    profileImageUrl: string;
    isVerified: boolean;
    createdAt: string;
  };
}

interface CountryData {
  countries: string[];
}

const DEFAULT_PROFILE_IMAGE =
  "https://skrr.zerotravel.kr/uploads/4271731b-715e-4067-8276-58b2d69ab6c4-ecolife image.png";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    password: "",
    nationality: "",
    age: "",
  });
  const [countries, setCountries] = useState<string[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({
    isVisible: false,
    type: "info" as "info" | "warning" | "error" | "confirm",
    title: "",
    message: "",
  });

  // Load countries from JSON file
  useEffect(() => {
    try {
      setCountries(countryData.countries);
      setFilteredCountries(countryData.countries);
    } catch (error) {
      console.error("Failed to load countries:", error);
      // Fallback to a basic list if JSON loading fails
      const fallbackCountries = [
        "South Korea",
        "United States",
        "Japan",
        "China",
        "Germany",
        "France",
        "United Kingdom",
        "Canada",
        "Australia",
        "Brazil",
      ];
      setCountries(fallbackCountries);
      setFilteredCountries(fallbackCountries);
    }
  }, []);

  // Filter countries based on search term
  useEffect(() => {
    if (countrySearchTerm.trim() === "") {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter((country) =>
        country.toLowerCase().includes(countrySearchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [countrySearchTerm, countries]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCountrySelect = (country: string) => {
    AndroidApi.vibrate({ duration: 100 });
    setFormData((prev) => ({ ...prev, nationality: country }));
    setShowCountryDropdown(false);
    setCountrySearchTerm("");
  };

  const handleCountryDropdownToggle = () => {
    AndroidApi.vibrate({ duration: 100 });
    setShowCountryDropdown(!showCountryDropdown);
    if (!showCountryDropdown) {
      setCountrySearchTerm("");
      setFilteredCountries(countries);
    }
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      showModal("warning", "Input Error", "Please enter your email.");
      return false;
    }
    if (!formData.name.trim()) {
      showModal("warning", "Input Error", "Please enter your name.");
      return false;
    }
    if (!formData.password.trim()) {
      showModal("warning", "Input Error", "Please enter your password.");
      return false;
    }
    if (!formData.nationality.trim()) {
      showModal("warning", "Input Error", "Please select your nationality.");
      return false;
    }
    if (!formData.age.trim()) {
      showModal("warning", "Input Error", "Please enter your age.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showModal("warning", "Input Error", "Please enter a valid email format.");
      return false;
    }
    if (formData.password.length < 8) {
      showModal(
        "warning",
        "Input Error",
        "Password must be at least 8 characters."
      );
      return false;
    }

    const age = parseInt(formData.age);
    if (isNaN(age) || age < 0 || age > 120) {
      showModal("warning", "Input Error", "Please enter a valid age (0-120).");
      return false;
    }

    return true;
  };

  const showModal = (
    type: "info" | "warning" | "error" | "confirm",
    title: string,
    message: string
  ) => {
    setModal({ isVisible: true, type, title, message });
  };

  const hideModal = () => {
    setModal({ ...modal, isVisible: false });
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    AndroidApi.vibrate({ duration: 150 });
    setIsLoading(true);
    try {
      const response = await publicApi.post<SignupResponse>("/auth/register", {
        email: formData.email,
        name: formData.name,
        password: formData.password,
        nationality: formData.nationality,
        age: parseInt(formData.age),
        profileImageUrl: DEFAULT_PROFILE_IMAGE,
      });

      const { accessToken, user } = response.data;

      saveAuthData(accessToken, user);

      showModal(
        "info",
        "Sign Up Successful",
        "Welcome! You are now logged in."
      );

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error: any) {
      console.error("Signup error:", error);
      if (error.response?.status === 409) {
        showModal(
          "error",
          "Sign Up Failed",
          "This email is already registered."
        );
      } else if (error.response?.status === 400) {
        showModal(
          "error",
          "Sign Up Failed",
          "Please check your input information."
        );
      } else {
        showModal(
          "error",
          "Sign Up Failed",
          "A network error occurred. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginLink = () => {
    AndroidApi.vibrate({ duration: 100 });
    navigate("/login");
  };

  return (
    <div className="w-[393px] min-h-screen bg-gray-50 flex flex-col mx-auto relative">
      <div className="flex-1 flex flex-col items-center justify-center px-8 space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <img src={logo} alt="EcoLife Logo" />
        </div>

        <h1 className="text-2xl text-green-500 font-light mb-6">
          Let's get started
        </h1>

        <div className="w-full max-w-sm space-y-6">
          {/* Email */}
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-b-2 border-gray-200 bg-transparent focus:border-green-500 focus:outline-none placeholder-gray-400 transition-all duration-300 text-gray-800"
              disabled={isLoading}
            />
          </div>

          {/* Name */}
          <div className="relative group">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-b-2 border-gray-200 bg-transparent focus:border-green-500 focus:outline-none placeholder-gray-400 transition-all duration-300 text-gray-800"
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password (8+ characters)"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full pl-12 pr-12 py-4 border-b-2 border-gray-200 bg-transparent focus:border-green-500 focus:outline-none placeholder-gray-400 transition-all duration-300 text-gray-800"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Nationality */}
          <div className="relative group">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors z-10" />
            <div className="relative">
              <button
                type="button"
                onClick={handleCountryDropdownToggle}
                className="w-full pl-12 pr-12 py-4 border-b-2 border-gray-200 bg-transparent focus:border-green-500 focus:outline-none text-left transition-all duration-300 disabled:opacity-50"
                disabled={isLoading}
              >
                <span
                  className={
                    formData.nationality ? "text-gray-800" : "text-gray-400"
                  }
                >
                  {formData.nationality || "Select Nationality"}
                </span>
              </button>
              <ChevronDown
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  showCountryDropdown ? "rotate-180" : ""
                }`}
              />

              {showCountryDropdown && (
                <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg">
                  {/* Search Input */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search countries..."
                        value={countrySearchTerm}
                        onChange={(e) => setCountrySearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none text-sm"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Countries List */}
                  <div className="max-h-48 overflow-y-auto">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <button
                          key={country}
                          onClick={() => handleCountrySelect(country)}
                          className="w-full px-4 py-3 text-left hover:bg-green-50 transition-colors text-gray-800 first:rounded-t-2xl last:rounded-b-2xl text-sm"
                        >
                          {country}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500 text-sm text-center">
                        No countries found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Age */}
          <div className="relative group">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
            <input
              type="number"
              placeholder="Age"
              value={formData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-b-2 border-gray-200 bg-transparent focus:border-green-500 focus:outline-none placeholder-gray-400 transition-all duration-300 text-gray-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              disabled={isLoading}
              min="13"
              max="120"
            />
          </div>

          <button
            onClick={handleSignUp}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-full text-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 mt-8 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              "Sign up"
            )}
          </button>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <button
              onClick={handleLoginLink}
              className="text-green-500 hover:text-green-600 font-medium hover:underline transition-colors"
              disabled={isLoading}
            >
              Login
            </button>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center mt-8">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>

      {/* Overlay when dropdown is open */}
      {showCountryDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowCountryDropdown(false)}
        />
      )}

      <ToastModal
        isVisible={modal.isVisible}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={hideModal}
      />
    </div>
  );
};

export default SignupPage;
