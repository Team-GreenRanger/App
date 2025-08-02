import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { RotateCcw, ArrowLeft, Check } from "lucide-react";
import image from "../assets/images/image.svg";
import { useNavigate } from "react-router-dom";

const CameraPage = () => {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [mode, setMode] = useState<"photo" | "video">("photo");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const navigate = useNavigate();

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: facingMode,
  };

  // 사진 촬영
  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
      }
    }
  }, []);

  // 비디오 녹화 시작
  const startRecording = useCallback(() => {
    if (!webcamRef.current) return;

    const stream = (webcamRef.current as any).stream as MediaStream;
    if (!stream) return;

    setIsRecording(true);
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "video/webm",
    });

    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      (event: BlobEvent) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      }
    );

    mediaRecorderRef.current.start();
  }, []);

  // 비디오 녹화 중지
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  // 녹화된 비디오 처리
  React.useEffect(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      setRecordedVideo(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  // 카메라 전환
  const switchCamera = () => {
    setFacingMode(facingMode === "user" ? "environment" : "user");
  };

  // 다시 촬영
  const retakePhoto = () => {
    setCapturedImage(null);
    setRecordedVideo(null);
  };

  // AI 분석을 위한 전송 (API 연동 예정)
  const sendToAI = () => {
    if (capturedImage) {
      // TODO: AI API 연동
      console.log("AI 분석을 위해 이미지 전송:", capturedImage);
      // 임시로 알림 표시
      alert("사진이 AI 분석을 위해 전송되었습니다!");
      // 전송 후 초기 상태로 돌아가기
      setCapturedImage(null);
    } else if (recordedVideo) {
      // TODO: 비디오 AI 분석 API 연동
      console.log("AI 분석을 위해 비디오 전송:", recordedVideo);
      alert("비디오가 AI 분석을 위해 전송되었습니다!");
      setRecordedVideo(null);
    }
  };

  // 갤러리에서 사진 선택
  const selectFromGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 파일 선택 처리
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
    // input 값 초기화 (같은 파일을 다시 선택할 수 있도록)
    event.target.value = "";
  };

  // 뒤로가기
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900 text-white min-h-screen flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 bg-gray-800">
        <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={goBack} />
        <span className="text-lg font-medium text-gray-300">Camera page</span>
        <div className="w-6 h-6"></div>
      </div>

      {/* 카메라 뷰 또는 미리보기 */}
      <div className="flex-1 relative bg-black">
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        ) : recordedVideo ? (
          <video
            src={recordedVideo}
            controls
            className="w-full h-full object-cover"
          />
        ) : (
          <Webcam
            audio={mode === "video"}
            height="100%"
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            videoConstraints={videoConstraints}
            className="w-full h-full object-cover"
          />
        )}

        {/* 모드 전환 버튼 */}
        {!capturedImage && !recordedVideo && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex bg-black bg-opacity-50 rounded-full gap-4">
            <button
              onClick={() => setMode("photo")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                mode === "photo"
                  ? "bg-white text-black"
                  : "text-white hover:bg-white hover:bg-opacity-20"
              }`}
            >
              photo
            </button>
            <button
              onClick={() => setMode("video")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                mode === "video"
                  ? "bg-white text-black"
                  : "text-white hover:bg-white hover:bg-opacity-20"
              }`}
            >
              video
            </button>
          </div>
        )}
      </div>

      {/* 하단 컨트롤 */}
      <div className="bg-gray-800 p-6">
        <div className="flex items-center justify-between">
          {/* 갤러리 버튼 */}
          <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors">
            <img src={image} />
          </div>

          {/* 촬영/녹화 버튼 */}
          <div className="relative">
            {capturedImage || recordedVideo ? (
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
                onClick={
                  mode === "photo"
                    ? capturePhoto
                    : isRecording
                    ? stopRecording
                    : startRecording
                }
                className={`w-16 h-16 rounded-full border-4 border-white flex items-center justify-center transition-all ${
                  isRecording
                    ? "bg-red-600 animate-pulse"
                    : "bg-transparent hover:bg-white hover:bg-opacity-20"
                }`}
              >
                {mode === "photo" ? (
                  <div className="w-12 h-12 bg-white rounded-full"></div>
                ) : isRecording ? (
                  <div className="w-6 h-6 bg-white rounded"></div>
                ) : (
                  <div className="w-12 h-12 bg-red-600 rounded-full"></div>
                )}
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

        {/* 녹화 시간 표시 */}
        {isRecording && (
          <div className="text-center mt-4">
            <span className="text-red-500 font-mono">● REC</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraPage;
