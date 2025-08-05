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

    const compressImage = (dataURL: string, quality: number = 0.7): Promise<string> => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
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

    const analyzeTrash = async () => {
        if (!capturedImage) {
            setError("Please take a photo.");
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        try {
            const compressedImage = await compressImage(capturedImage, 0.7);

            const response = await fetch(compressedImage);
            const blob = await response.blob();

            const formData = new FormData();
            formData.append('file', blob, 'trash-image.jpg');

            const uploadResponse = await privateApi.post('/upload/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const uploadResult = uploadResponse.data;
            const imageUrl = uploadResult.url;

            const analysisResponse = await privateApi.post('/ai/how-to-trash', {
                imageUrl: imageUrl
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const analysisResult = analysisResponse.data;

            navigate("/ai-trash-result", {
                state: {
                    capturedImage: compressedImage,
                    analysisResult: analysisResult
                }
            });

        } catch (error) {
            console.error('Trash analysis error:', error);
            setError(error instanceof Error ? error.message : "An error occurred during analysis.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="w-full max-w-md mx-auto bg-gray-900 text-white min-h-screen relative">
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gray-800 bg-opacity-90">
                <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={goBack} />
                <span className="text-lg font-medium text-gray-300">
                    Waste Disposal Guide
                </span>
                <div className="w-6 h-6"></div>
            </div>

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

            {/* 알림 모달 - 컨트롤바와 분리 */}
            {error && (
                <div className="absolute bottom-32 left-4 right-4 z-20 bg-red-900 bg-opacity-90 rounded-full p-4">
                    <div className="flex items-center gap-2 text-red-300">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            )}

            {!capturedImage && !isAnalyzing && !error && (
                <div className="absolute bottom-32 left-4 right-4 z-20 bg-blue-900 bg-opacity-90 rounded-full p-4">
                    <p className="text-blue-200 text-sm text-center">
                        Please align the waste with the camera and take a photo
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