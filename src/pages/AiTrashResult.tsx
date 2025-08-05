import React from "react";
import { ArrowLeft, RefreshCw, CheckCircle, Trash2, Recycle, Lightbulb } from "lucide-react";
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

    const getTrashIcon = () => {
        const trashType = analysisResult.trashType.toLowerCase();
        if (trashType.includes('plastic') || trashType.includes('bottle')) {
            return <Recycle className="w-8 h-8 text-blue-500" />;
        }
        return <Trash2 className="w-8 h-8 text-gray-500" />;
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white text-gray-800 min-h-screen">
            <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
                <ArrowLeft className="w-6 h-6 cursor-pointer text-gray-700" onClick={goBack} />
                <span className="text-lg font-medium text-gray-800">
                    Waste Disposal Guide
                </span>
                <RefreshCw className="w-6 h-6 cursor-pointer text-gray-700" onClick={retakePhoto} />
            </div>

            <div className="p-4 space-y-6">
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <img
                        src={capturedImage}
                        alt="Analyzed trash"
                        className="w-full h-48 object-cover"
                    />
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        {getTrashIcon()}
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-800 capitalize">
                                {analysisResult.trashType}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="bg-white border-l-4 border-green-500 p-4">
                    <h3 className="text-lg font-semibold text-green-600 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Proper Disposal Method
                    </h3>
                    <p className="text-gray-700 text-base leading-relaxed mb-3">
                        {analysisResult.disposalMethod}
                    </p>
                    {analysisResult.countrySpecificGuidelines && (
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {analysisResult.countrySpecificGuidelines}
                        </p>
                    )}
                </div>

                {analysisResult.additionalTips && analysisResult.additionalTips.length > 0 && (
                    <div className="bg-amber-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-amber-700 mb-3 flex items-center gap-2">
                            <Lightbulb className="w-5 h-5" />
                            Additional Tips
                        </h3>
                        <ul className="space-y-2">
                            {analysisResult.additionalTips.map((tip, index) => (
                                <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                                    <span className="text-amber-600 mt-1">•</span>
                                    <span className="leading-relaxed">{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="flex gap-3 pt-4">
                    <button
                        onClick={retakePhoto}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors font-medium border border-gray-300"
                    >
                        Retake Photo
                    </button>
                    <button
                        onClick={goBack}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                    >
                        Done
                    </button>
                </div>

                <div className="text-center text-gray-400 text-xs pt-2">
                    Analysis completed at {new Date(analysisResult.timestamp).toLocaleString('en-US')}
                </div>
            </div>
        </div>
    );
};

export default AiTrashResult;