import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import logo from "../assets/images/EcoLifeLogo.svg";
import { useNavigate } from "react-router-dom";
import { publicApi } from "../api";
import { ToastModal } from "../components";
import { saveAuthData } from "../utils/auth.utils";

interface FormData {
  email: string;
  password: string;
}

interface LoginResponse {
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

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({
    isVisible: false,
    type: 'info' as 'info' | 'warning' | 'error' | 'confirm',
    title: '',
    message: '',
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      showModal('warning', '입력 오류', '이메일을 입력해주세요.');
      return false;
    }
    if (!formData.password.trim()) {
      showModal('warning', '입력 오류', '비밀번호를 입력해주세요.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showModal('warning', '입력 오류', '올바른 이메일 형식을 입력해주세요.');
      return false;
    }
    return true;
  };

  const showModal = (type: 'info' | 'warning' | 'error' | 'confirm', title: string, message: string) => {
    setModal({ isVisible: true, type, title, message });
  };

  const hideModal = () => {
    setModal({ ...modal, isVisible: false });
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await publicApi.post<LoginResponse>('/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      const { accessToken, user } = response.data;
      
      saveAuthData(accessToken, user);
      
      showModal('info', '로그인 성공', '환영합니다!');
      
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.status === 400) {
        showModal('error', '로그인 실패', '이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        showModal('error', '로그인 실패', '네트워크 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupLink = () => {
    navigate("/signup");
  };

  return (
    <div className="w-[393px] min-h-screen bg-gray-50 flex flex-col mx-auto">
      <div className="flex-1 flex flex-col items-center justify-center px-8 space-y-8">
        <div className="flex items-center space-x-2 mb-4">
          <img src={logo} alt="EcoLife Logo" />
        </div>

        <h1 className="text-2xl text-green-500 font-light mb-8">
          Welcome back
        </h1>

        <div className="w-full max-w-sm space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-b border-gray-300 bg-transparent focus:border-green-500 focus:outline-none placeholder-gray-400"
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full pl-12 pr-12 py-4 border-b border-gray-300 bg-transparent focus:border-green-500 focus:outline-none placeholder-gray-400"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-green-500 text-white py-4 rounded-full text-lg font-medium hover:bg-green-600 transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Login'}
          </button>

          <p className="text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <button
              onClick={handleSignupLink}
              className="text-green-500 hover:underline"
              disabled={isLoading}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center mt-8">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>

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

export default LoginPage;