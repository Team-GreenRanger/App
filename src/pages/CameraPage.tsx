import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { RotateCcw, ArrowLeft, Check, AlertCircle } from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useImageUpload, useMissions } from "../hooks";
import { MissionSubmissionLoading } from "../components";
import { AndroidApi } from "../api";

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
    AndroidApi.vibrate({ duration: 150 });
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
      }
    }
  }, []);

  const switchCamera = () => {
    AndroidApi.vibrate({ duration: 100 });
    setFacingMode(facingMode === "user" ? "environment" : "user");
  };

  const retakePhoto = () => {
    AndroidApi.vibrate({ duration: 100 });
    setCapturedImage(null);
  };

  const compressImage = (dataURL: string, quality: number = 0.5): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width * 0.5;
        canvas.height = img.height * 0.5;
        
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const compressedDataURL = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataURL);
      };
      
      img.src = dataURL;
    });
  };

  const sendToAI = async () => {
    if (!capturedImage) {
      return;
    }

    AndroidApi.vibrate({ duration: 200 });
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
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    AndroidApi.vibrate({ duration: 100 });
    navigate(-1);
  };

  const currentError = uploadError || missionError;

  return (
      <div className="w-full max-w-md mx-auto bg-gray-900 text-white min-h-screen relative">
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gray-800 bg-opacity-90">
          <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={goBack} />
          <span className="text-lg font-medium text-gray-300">
            {missionTitle || "Mission Camera"}
          </span>
          <div className="w-6 h-6"></div>
        </div>

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

        {currentError && (
            <div className="absolute bottom-32 left-4 right-4 z-20 bg-red-900 bg-opacity-90 rounded-full p-4">
                <div className="flex items-center gap-2 text-red-300">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm">{currentError}</p>
                </div>
            </div>
        )}

        {!capturedImage && !isSubmitting && !isUploading && !currentError && (
            <div className="absolute bottom-32 left-4 right-4 z-20 bg-blue-900 bg-opacity-90 rounded-full p-4">
                <p className="text-blue-200 text-sm text-center">
                    Take a photo to complete your mission
                </p>
            </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gray-800 bg-opacity-90">
          <div className="p-6">
            <div className="flex items-center justify-center">
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
                      disabled={isSubmitting || isUploading}
                      className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center transition-all bg-transparent hover:bg-white hover:bg-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-12 h-12 bg-white rounded-full"></div>
                  </button>
              )}
            </div>

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