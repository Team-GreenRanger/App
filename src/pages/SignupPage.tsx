import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import logo from "../assets/images/EcoLifeLogo.svg";
import { useNavigate } from "react-router-dom";
import { publicApi } from "../api";
import { ToastModal } from "../components";
import { saveAuthData } from "../utils/auth.utils";

interface FormData {
  email: string;
  name: string;
  password: string;
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

const DEFAULT_PROFILE_IMAGE = "https://donghyuncc-cloudfront-aws.ncloud.sbs/69263a0c-3f29-4314-b672-c23df922659a.png";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
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
    if (!formData.name.trim()) {
      showModal('warning', '입력 오류', '이름을 입력해주세요.');
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
    if (formData.password.length < 6) {
      showModal('warning', '입력 오류', '비밀번호는 6자 이상이어야 합니다.');
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

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await publicApi.post<SignupResponse>('/auth/register', {
        email: formData.email,
        name: formData.name,
        password: formData.password,
        profileImageUrl: DEFAULT_PROFILE_IMAGE,
      });

      const { accessToken, user } = response.data;
      
      saveAuthData(accessToken, user);
      
      showModal('info', '회원가입 성공', '환영합니다! 로그인되었습니다.');
      
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.response?.status === 409) {
        showModal('error', '회원가입 실패', '이미 가입된 이메일입니다.');
      } else if (error.response?.status === 400) {
        showModal('error', '회원가입 실패', '입력 정보를 확인해주세요.');
      } else {
        showModal('error', '회원가입 실패', '네트워크 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginLink = () => {
    navigate("/login");
  };

  return (
    <div className="w-[393px] min-h-screen bg-gray-50 flex flex-col mx-auto">
      <div className="flex-1 flex flex-col items-center justify-center px-8 space-y-8">
        <div className="flex items-center space-x-2 mb-4">
          <img src={logo} alt="EcoLife Logo" />
        </div>

        <h1 className="text-2xl text-green-500 font-light mb-8">
          Let's get started
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
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
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
            onClick={handleSignUp}
            disabled={isLoading}
            className="w-full bg-green-500 text-white py-4 rounded-full text-lg font-medium hover:bg-green-600 transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Sign up'}
          </button>

          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <button
              onClick={handleLoginLink}
              className="text-green-500 hover:underline"
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