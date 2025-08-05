import React from "react";
import { ArrowLeft, RefreshCw, CheckCircle, AlertTriangle, Trash2, Recycle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface TrashAnalysisResult {
    trashType: string;
    disposalMethod: string;
    countrySpecificGuidelines: string;
    userCountry: string;
    confidence: number;
    additionalTips: string[];
    timestamp: string;
}

interface LocationState {
    capturedImage: string;
    analysisResult: TrashAnalysisResult;
}

const AiTrashResult = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { capturedImage, analysisResult } = location.state as LocationState || {};

    // 데이터가 없으면 카메라 페이지로 리다이렉트
    if (!capturedImage || !analysisResult) {
        navigate('/ai-trash-camera');
        return null;
    }

    const goBack = () => {
        navigate(-1);
    };

    const retakePhoto = () => {
        navigate('/ai-trash-camera');
    };

    // 신뢰도에 따른 색상 결정
    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 80) return "text-green-400";
        if (confidence >= 60) return "text-yellow-400";
        return "text-red-400";
    };

    // 신뢰도에 따른 아이콘 결정
    const getConfidenceIcon = (confidence: number) => {
        if (confidence >= 80) return <CheckCircle className="w-5 h-5 text-green-400" />;
        if (confidence >= 60) return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
    };

    // 쓰레기 타입에 따른 아이콘
    const getTrashIcon = () => {
        const trashType = analysisResult.trashType.toLowerCase();
        if (trashType.includes('plastic') || trashType.includes('bottle')) {
            return <Recycle className="w-8 h-8 text-blue-400" />;
        }
        return <Trash2 className="w-8 h-8 text-gray-400" />;
    };

    return (
        <div className="w-full max-w-md mx-auto bg-gray-900 text-white min-h-screen">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 bg-gray-800">
                <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={goBack} />
                <span className="text-lg font-medium text-gray-300">
          분리수거 가이드
        </span>
                <RefreshCw className="w-6 h-6 cursor-pointer" onClick={retakePhoto} />
            </div>

            <div className="p-4 space-y-6">
                {/* 촬영된 이미지 */}
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <img
                        src={capturedImage}
                        alt="Analyzed trash"
                        className="w-full h-48 object-cover"
                    />
                </div>

                {/* 분석 결과 헤더 */}
                <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                        {getTrashIcon()}
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-white capitalize">
                                {analysisResult.trashType}
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                {getConfidenceIcon(analysisResult.confidence)}
                                <span className={`text-sm ${getConfidenceColor(analysisResult.confidence)}`}>
                  신뢰도: {analysisResult.confidence}%
                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 처리 방법 */}
                <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        올바른 처리 방법
                    </h3>
                    <p className="text-gray-200 text-base leading-relaxed">
                        {analysisResult.disposalMethod}
                    </p>
                </div>

                {/* 국가별 가이드라인 */}
                {analysisResult.countrySpecificGuidelines && (
                    <div className="bg-gray-800 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-blue-400 mb-3">
                            {analysisResult.userCountry === 'KR' ? '한국' : analysisResult.userCountry} 가이드라인
                        </h3>
                        <p className="text-gray-200 text-sm leading-relaxed">
                            {analysisResult.countrySpecificGuidelines}
                        </p>
                    </div>
                )}

                {/* 추가 팁 */}
                {analysisResult.additionalTips && analysisResult.additionalTips.length > 0 && (
                    <div className="bg-gray-800 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                            추가 팁
                        </h3>
                        <ul className="space-y-2">
                            {analysisResult.additionalTips.map((tip, index) => (
                                <li key={index} className="text-gray-200 text-sm flex items-start gap-2">
                                    <span className="text-yellow-400 mt-1">•</span>
                                    <span className="leading-relaxed">{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 신뢰도가 낮을 때 경고 메시지 */}
                {analysisResult.confidence < 60 && (
                    <div className="bg-red-900 bg-opacity-50 border border-red-600 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-red-300 font-semibold mb-1">분석 신뢰도 낮음</h4>
                                <p className="text-gray-300 text-sm">
                                    분석 결과의 신뢰도가 낮습니다. 더 명확한 사진을 촬영하거나
                                    지역 분리수거 가이드라인을 확인해보세요.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 액션 버튼들 */}
                <div className="flex gap-3 pt-4">
                    <button
                        onClick={retakePhoto}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                    >
                        다시 촬영하기
                    </button>
                    <button
                        onClick={goBack}
                        className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                    >
                        완료
                    </button>
                </div>

                {/* 타임스탬프 */}
                <div className="text-center text-gray-500 text-xs pt-2">
                    분석 시간: {new Date(analysisResult.timestamp).toLocaleString('ko-KR')}
                </div>
            </div>
        </div>
    );
};

export default AiTrashResult;