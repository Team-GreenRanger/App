import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { RotateCcw, ArrowLeft, Check, AlertCircle } from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useImageUpload, useMissions } from "../hooks";
import { MissionSubmissionLoading } from "../components";

const CameraPage = () => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { missionId } = useParams<{ missionId: string }>();
  const { uploadMissionImages, convertDataURLToFile, isUploading, error: uploadError } = useImageUpload();
  const { submitMission, assignMission, error: missionError } = useMissions();
  
  // URL 파라미터에서 missionId를 받아오고, location.state에서 추가 정보 받아오기
  const { userMissionId, missionTitle } = location.state || {};
  
  if (!missionId) {
    navigate('/missions');
    return null;
  }

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

  // 이미지 압축 함수 (화질 50% 감소)
  const compressImage = (dataURL: string, quality: number = 0.5): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // 원본 크기의 50%로 리사이징
        canvas.width = img.width * 0.5;
        canvas.height = img.height * 0.5;
        
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // JPEG 형식으로 quality 적용하여 압축
        const compressedDataURL = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataURL);
      };
      
      img.src = dataURL;
    });
  };

  const sendToAI = async () => {
    if (!capturedImage) {
      alert("사진을 촬영해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const compressedImage = await compressImage(capturedImage, 0.5);
      const file = convertDataURLToFile(compressedImage, `mission-${missionId}-${Date.now()}.jpg`);
      
      navigate("/mission-complete", {
        state: {
          missionTitle,
          isProcessing: true,
          imageFile: file,
          missionId,
          userMissionId
        }
      });
    } catch (error) {
      console.error('Mission submission error:', error);
      alert(error instanceof Error ? error.message : "미션 제출 중 오류가 발생했습니다.");
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
      <div className="w-full max-w-md mx-auto bg-gray-900 text-white min-h-screen relative">


        {/* 헤더 */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gray-800 bg-opacity-90">
          <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={goBack} />
          <span className="text-lg font-medium text-gray-300">
            {missionTitle || "Camera page"}
          </span>
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
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gray-800 bg-opacity-90">
          {/* 에러 메시지 */}
          {(uploadError || missionError) && (
            <div className="p-4 bg-red-900 bg-opacity-50">
              <div className="flex items-center gap-2 text-red-300">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p className="text-sm">{uploadError || missionError}</p>
              </div>
            </div>
          )}
          
          <div className="p-6">
            <div className="flex items-center justify-center">
            {/* 촬영 버튼 */}
            <div className="relative">
              {capturedImage ? (
                  <div className="flex gap-4">
                    <button
                        onClick={retakePhoto}
                        disabled={isSubmitting || isUploading}
                        className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RotateCcw className="w-6 h-6" />
                    </button>
                    <button
                        onClick={sendToAI}
                        disabled={isSubmitting || isUploading}
                        className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting || isUploading ? (
                        <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <Check className="w-6 h-6" />
                      )}
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
                disabled={capturedImage || isSubmitting || isUploading}
                className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed absolute bottom-6 right-6"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraPage;