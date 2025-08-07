import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EducationHeader from "../components/EducationHeader";
import LearningCard from "../components/LearningCard";
import { AlertCircle, ArrowLeft } from "lucide-react";
import learningData from "../assets/data/learning-data.json";
import { AndroidApi } from "../api";

// 학습 데이터 타입 정의
interface LearningTopic {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  type: "article" | "guide";
}

interface LearningCategory {
  id: string;
  title: string;
  description: string;
  topics: LearningTopic[];
}

interface LearningData {
  categories: {
    [key: string]: LearningCategory;
  };
}

interface LearningPageViewerProps {
  categoryId?: string; // props로 카테고리 ID 받기
}

const LearningPageViewer: React.FC<LearningPageViewerProps> = ({
  categoryId: propCategoryId,
}) => {
  const { categoryId: urlCategoryId, topicId } = useParams<{
    categoryId: string;
    topicId?: string;
  }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // 에러 상태
  if (error || !learningData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5" />
          <p>{error || "Learning data not found."}</p>
        </div>
      </div>
    );
  }

  // URL에서 categoryId 확인, 없으면 props나 기본값 사용
  let actualCategoryId = urlCategoryId || propCategoryId;
  if (!actualCategoryId) {
    // URL 경로에 따라 기본 카테고리 설정
    const pathname = window.location.pathname;
    console.log("Current pathname:", pathname); // 디버깅용
    if (pathname.includes("climate-change")) {
      actualCategoryId = "climate-change";
    } else if (pathname.includes("extreme-weather")) {
      actualCategoryId = "extreme-weather";
    }
  }

  console.log("Actual category ID:", actualCategoryId); // 디버깅용
  console.log("Topic ID:", topicId); // 디버깅용

  const category = actualCategoryId
    ? learningData.categories[actualCategoryId]
    : null;

  // 카테고리가 존재하지 않는 경우
  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Category not found
          </h2>
          <button
            onClick={() => navigate("/education")}
            className="text-green-600 hover:text-green-700 underline"
          >
            Back to Education
          </button>
        </div>
      </div>
    );
  }

  // 특정 토픽 상세 페이지
  if (topicId) {
    const topic = category.topics.find((t) => t.id === topicId);

    if (!topic) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Topic not found
            </h2>
            <button
              onClick={() => navigate(`/education/${actualCategoryId}`)}
              className="text-green-600 hover:text-green-700 underline"
            >
              Back to Category
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <button
            onClick={() => {
              AndroidApi.vibrate({ duration: 100 });
              navigate(-1);
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        {/* 토픽 상세 내용 */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {topic.title}
              </h1>
              <p className="text-gray-600">{topic.description}</p>
            </div>

            {/* 이미지 (있는 경우) */}
            {topic.imageUrl && (
              <div className="mb-6">
                <img
                  src={topic.imageUrl}
                  alt={topic.title}
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    // 이미지 로드 실패시 숨김
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}

            {/* 내용 */}
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed text-gray-800">
                {topic.content}
              </p>
            </div>

            {/* 타입 뱃지 */}
            <div className="mt-6 flex justify-between items-center">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  topic.type === "guide"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {topic.type === "guide" ? "Guide" : "Article"}
              </span>
            </div>
          </div>
        </div>

        {/* 하단 여백 */}
        <div className="pb-20"></div>
      </div>
    );
  }

  // 카테고리 토픽 목록 페이지
  return (
    <div className="min-h-screen flex flex-col items-center pt-6 sm:pt-8 lg:pt-10 gap-4 sm:gap-5 lg:gap-6">
      <EducationHeader title={category.title} />

      {/* 카테고리 설명 */}
      <div className="w-full max-w-4xl px-4 sm:px-6 md:px-8">
        <p className="text-gray-600 text-center mb-4">{category.description}</p>
      </div>

      {/* 토픽 카드 그리드 - 항상 2열 고정, 반응형 개선 */}
      <div className="w-full max-w-4xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {category.topics.map((topic) => (
            <div key={topic.id} className="w-full">
              <LearningCard
                title={topic.title}
                description={topic.description}
                onClick={() => {
                  AndroidApi.vibrate({ duration: 100 });
                  navigate(`/education/${actualCategoryId}/${topic.id}`);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 토픽이 없는 경우 */}
      {category.topics.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No learning materials available yet.</p>
        </div>
      )}

      {/* 하단 여백 */}
      <div className="pb-20 sm:pb-16 lg:pb-8"></div>
    </div>
  );
};

export default LearningPageViewer;
