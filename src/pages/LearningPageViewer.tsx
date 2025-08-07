import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EducationHeader from "../components/EducationHeader";
import LearningCard from "../components/LearningCard";
import { AlertCircle, ArrowLeft } from "lucide-react";
import learningData from "../assets/data/learning-data.json";

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
  categoryId?: string;
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

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

  let actualCategoryId = urlCategoryId || propCategoryId;
  if (!actualCategoryId) {
    const pathname = window.location.pathname;
    if (pathname.includes("climate-change")) {
      actualCategoryId = "climate-change";
    } else if (pathname.includes("extreme-weather")) {
      actualCategoryId = "extreme-weather";
    } else if (pathname.includes("waste-management")) {
      actualCategoryId = "waste-management";
    } else if (pathname.includes("sustainable-living")) {
      actualCategoryId = "sustainable-living";
    } else if (pathname.includes("green-transportation")) {
      actualCategoryId = "green-transportation";
    }
  }

  const category = actualCategoryId
    ? learningData.categories[actualCategoryId]
    : null;

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

    const formatContent = (content: string) => {
      return content.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < content.split('\n').length - 1 && <br />}
        </React.Fragment>
      ));
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {topic.title}
              </h1>
              <p className="text-gray-600">{topic.description}</p>
            </div>

            <div className="prose max-w-none">
              <div className="text-base leading-relaxed text-gray-800">
                {formatContent(topic.content)}
              </div>
            </div>

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

        <div className="pb-20"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-6 sm:pt-8 lg:pt-10 gap-4 sm:gap-5 lg:gap-6">
      <EducationHeader title={category.title} />

      <div className="w-full max-w-4xl px-4 sm:px-6 md:px-8">
        <p className="text-gray-600 text-center mb-4">{category.description}</p>
      </div>

      <div className="w-full max-w-4xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {category.topics.map((topic) => (
            <div key={topic.id} className="w-full">
              <LearningCard
                title={topic.title}
                description={topic.description}
                onClick={() => {
                  navigate(`/education/${actualCategoryId}/${topic.id}`);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {category.topics.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No learning materials available yet.</p>
        </div>
      )}

      <div className="pb-20 sm:pb-16 lg:pb-8"></div>
    </div>
  );
};

export default LearningPageViewer;