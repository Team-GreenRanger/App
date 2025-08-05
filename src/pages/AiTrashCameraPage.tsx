import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { RotateCcw, ArrowLeft, Check, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {privateApi} from "../api";

const AiTrashCameraPage = () => {
    const webcamRef = useRef<Webcam>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                setError(null);
            }
        }
    }, []);

    const switchCamera = () => {
        setFacingMode(facingMode === "user" ? "environment" : "user");
    };

    const retakePhoto = () => {
        setCapturedImage(null);
        setError(null);
    };

    // 이미지 압축 함수
    const compressImage = (dataURL: string, quality: number = 0.7): Promise<string> => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // 최대 크기 제한 (1024px)
                const maxSize = 1024;
                let { width, height } = img;

                if (width > height && width > maxSize) {
                    height = (height * maxSize) / width;
                    width = maxSize;
                } else if (height > maxSize) {
                    width = (width * maxSize) / height;
                    height = maxSize;
                }

                canvas.width = width;
                canvas.height = height;

                ctx?.drawImage(img, 0, 0, width, height);

                const compressedDataURL = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedDataURL);
            };

            img.src = dataURL;
        });
    };

    // 이미지를 서버로 업로드하고 분석 요청
    const analyzeTrash = async () => {
        if (!capturedImage) {
            setError("사진을 촬영해주세요.");
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        try {
            // 이미지 압축
            const compressedImage = await compressImage(capturedImage, 0.7);

            // Base64 데이터를 Blob으로 변환
            const response = await fetch(compressedImage);
            const blob = await response.blob();

            // FormData로 이미지 업로드 - 올바른 엔드포인트 사용
            const formData = new FormData();
            formData.append('file', blob, 'trash-image.jpg');

            const uploadResponse = await privateApi.post('/upload/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const uploadResult = uploadResponse.data;
            const imageUrl = uploadResult.url;

            // AI 분석 요청 - 올바른 엔드포인트 사용
            const analysisResponse = await privateApi.post('/ai/how-to-trash', {
                imageUrl: imageUrl
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const analysisResult = analysisResponse.data;

            // 결과 페이지로 이동
            navigate("/ai-trash-result", {
                state: {
                    capturedImage: compressedImage,
                    analysisResult: analysisResult
                }
            });

        } catch (error) {
            console.error('Trash analysis error:', error);
            setError(error instanceof Error ? error.message : "분석 중 오류가 발생했습니다.");
        } finally {
            setIsAnalyzing(false);
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
          쓰레기 분리수거 가이드
        </span>
                <div className="w-6 h-6"></div>
            </div>

            {/* 전체 화면 카메라 뷰 */}
            <div className="w-full h-screen bg-black">
                {capturedImage ? (
                    <img
                        src={capturedImage}
                        alt="Captured trash"
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

            {/* 하단 컨트롤바 */}
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-gray-800 bg-opacity-90">
                {/* 에러 메시지 */}
                {error && (
                    <div className="p-4 bg-red-900 bg-opacity-50">
                        <div className="flex items-center gap-2 text-red-300">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* 안내 메시지 */}
                {!capturedImage && !isAnalyzing && (
                    <div className="p-4 bg-blue-900 bg-opacity-50">
                        <p className="text-blue-200 text-sm text-center">
                            쓰레기를 카메라에 맞춰 촬영해주세요
                        </p>
                    </div>
                )}

                <div className="p-6">
                    <div className="flex items-center justify-center">
                        {/* 촬영/분석 버튼 */}
                        <div className="relative">
                            {capturedImage ? (
                                <div className="flex gap-4">
                                    <button
                                        onClick={retakePhoto}
                                        disabled={isAnalyzing}
                                        className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <RotateCcw className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={analyzeTrash}
                                        disabled={isAnalyzing}
                                        className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isAnalyzing ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            <Check className="w-6 h-6" />
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={capturePhoto}
                                    disabled={isAnalyzing}
                                    className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center transition-all bg-transparent hover:bg-white hover:bg-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="w-12 h-12 bg-white rounded-full"></div>
                                </button>
                            )}
                        </div>

                        {/* 카메라 전환 버튼 */}
                        <button
                            onClick={switchCamera}
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

export default AiTrashCameraPage;