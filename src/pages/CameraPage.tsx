import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { RotateCcw, ArrowLeft, Check } from "lucide-react";
import image from "../assets/images/image.svg";
import { useNavigate } from "react-router-dom";

const CameraPage = () => {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const navigate = useNavigate();

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: facingMode,
  };

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
      }
    }
  }, []);

  const switchCamera = () => {
    setFacingMode(facingMode === "user" ? "environment" : "user");
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const sendToAI = () => {
    if (capturedImage) {
      console.log("AI 분석을 위해 이미지 전송:", capturedImage);
      alert("사진이 AI 분석을 위해 전송되었습니다!");
      setCapturedImage(null);
    }
  };

  const selectFromGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCapturedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
      <div className="w-full max-w-md mx-auto bg-gray-900 text-white min-h-screen relative">
        <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
        />

        {/* 헤더 */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gray-800 bg-opacity-90">
          <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={goBack} />
          <span className="text-lg font-medium text-gray-300">Camera page</span>
          <div className="w-6 h-6"></div>
        </div>

        {/* 전체 화면 카메라 뷰 */}
        <div className="w-full h-screen bg-black">
          {capturedImage ? (
              <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-cover"
              />
          ) : (
              <Webcam
                  audio={false}
                  height="100%"
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width="100%"
                  videoConstraints={videoConstraints}
                  className="w-full h-full object-cover"
              />
          )}
        </div>

        {/* 하단 컨트롤바 - absolute 고정 */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gray-800 bg-opacity-90 p-6">
          <div className="flex items-center justify-between">
            {/* 갤러리 버튼 */}
            <div
                className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={selectFromGallery}
            >
              <img src={image} alt="Gallery" />
            </div>

            {/* 촬영 버튼 */}
            <div className="relative">
              {capturedImage ? (
                  <div className="flex gap-4">
                    <button
                        onClick={retakePhoto}
                        className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors"
                    >
                      <RotateCcw className="w-6 h-6" />
                    </button>
                    <button
                        onClick={sendToAI}
                        className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors"
                    >
                      <Check className="w-6 h-6" />
                    </button>
                  </div>
              ) : (
                  <button
                      onClick={capturePhoto}
                      className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center transition-all bg-transparent hover:bg-white hover:bg-opacity-20"
                  >
                    <div className="w-12 h-12 bg-white rounded-full"></div>
                  </button>
              )}
            </div>

            {/* 카메라 전환 버튼 */}
            <button
                onClick={switchCamera}
                className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
  );
};

export default CameraPage;