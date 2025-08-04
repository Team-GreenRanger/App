import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { RotateCcw, ArrowLeft, Check, AlertCircle } from "lucide-react";
import image from "../assets/images/image.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { useImageUpload, useMissions } from "../hooks";

const CameraPage = () => {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { uploadMissionImages, convertDataURLToFile, isUploading, error: uploadError } = useImageUpload();
  const { submitMission, error: missionError } = useMissions();
  
  // 미션 정보를 location state에서 가져오기
  const { missionId, userMissionId, missionTitle } = location.state || {};

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

  const sendToAI = async () => {
    if (!capturedImage || !userMissionId) {
      alert("사진을 촬영하고 미션 정보가 필요합니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 이미지를 File 객체로 변환
      const file = convertDataURLToFile(capturedImage, `mission-${userMissionId}-${Date.now()}.jpg`);
      
      // 이미지 업로드
      const uploadResult = await uploadMissionImages([file]);
      
      if (uploadResult) {
        // 미션 제출
        const missionResult = await submitMission(userMissionId, {
          imageUrls: uploadResult.files.map(f => f.url),
          note: note.trim() || undefined
        });
        
        if (missionResult) {
          // 성공 시 미션 완료 페이지로 이동
          navigate("/mission-complete", {
            state: {
              missionTitle,
              isApproved: missionResult.status === 'APPROVED' || missionResult.status === 'COMPLETED'
            }
          });
        } else {
          alert("미션 제출에 실패했습니다. 다시 시도해주세요.");
        }
      } else {
        alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error('Mission submission error:', error);
      alert("미션 제출 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
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
          
          {/* 사진이 촬영된 경우 노트 입력 필드 */}
          {capturedImage && (
            <div className="p-4 border-b border-gray-700">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note about your mission (optional)"
                className="w-full p-3 bg-gray-700 text-white rounded-lg resize-none"
                rows={2}
                maxLength={200}
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {note.length}/200
              </div>
            </div>
          )}
          
          <div className="p-6">
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
                className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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