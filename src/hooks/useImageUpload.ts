import { useState, useCallback } from 'react';
import { uploadApi } from '../api';
import { FileUploadResponse, MultipleFileUploadResponse } from '../types';

interface UseImageUploadReturn {
  isUploading: boolean;
  uploadedFiles: FileUploadResponse[];
  error: string | null;
  uploadSingleImage: (file: File) => Promise<FileUploadResponse | null>;
  uploadMissionImages: (files: File[]) => Promise<MultipleFileUploadResponse | null>;
  uploadProfileImage: (file: File) => Promise<FileUploadResponse | null>;
  convertDataURLToFile: (dataURL: string, filename: string) => File;
  validateImageFile: (file: File) => boolean;
  clearError: () => void;
  clearUploadedFiles: () => void;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const uploadSingleImage = useCallback(async (file: File): Promise<FileUploadResponse | null> => {
    setIsUploading(true);
    setError(null);

    try {
      uploadApi.validateImageFile(file);
      const response = await uploadApi.uploadImage(file);
      setUploadedFiles(prev => [...prev, response]);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || '이미지 업로드 중 오류가 발생했습니다.');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const uploadMissionImages = useCallback(async (files: File[]): Promise<MultipleFileUploadResponse | null> => {
    setIsUploading(true);
    setError(null);

    try {
      // 각 파일 검증
      files.forEach(file => uploadApi.validateImageFile(file));
      
      const response = await uploadApi.uploadMissionImages(files);
      setUploadedFiles(prev => [...prev, ...response.files]);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || '이미지 업로드 중 오류가 발생했습니다.');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const uploadProfileImage = useCallback(async (file: File): Promise<FileUploadResponse | null> => {
    setIsUploading(true);
    setError(null);

    try {
      uploadApi.validateImageFile(file);
      const response = await uploadApi.uploadProfileImage(file);
      setUploadedFiles(prev => [...prev, response]);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || '프로필 이미지 업로드 중 오류가 발생했습니다.');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const convertDataURLToFile = useCallback((dataURL: string, filename: string): File => {
    return uploadApi.dataURLToFile(dataURL, filename);
  }, []);

  const validateImageFile = useCallback((file: File): boolean => {
    try {
      return uploadApi.validateImageFile(file);
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearUploadedFiles = useCallback(() => {
    setUploadedFiles([]);
  }, []);

  return {
    isUploading,
    uploadedFiles,
    error,
    uploadSingleImage,
    uploadMissionImages,
    uploadProfileImage,
    convertDataURLToFile,
    validateImageFile,
    clearError,
    clearUploadedFiles,
  };
};
