import { privateApi } from './index';
import {
  FileUploadResponse,
  MultipleFileUploadResponse,
} from '../types';

class UploadApiService {
  async uploadImage(file: File): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await privateApi.post<FileUploadResponse>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async uploadMissionImages(files: File[]): Promise<MultipleFileUploadResponse> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await privateApi.post<MultipleFileUploadResponse>('/upload/mission-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async uploadProfileImage(file: File): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await privateApi.post<FileUploadResponse>('/upload/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // 이미지 파일을 dataURL에서 File 객체로 변환하는 유틸리티 메서드
  dataURLToFile(dataURL: string, filename: string): File {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
  }

  // 이미지 파일 검증
  validateImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPEG, JPG, PNG, and WebP images are allowed');
    }

    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }

    return true;
  }
}

export const uploadApi = new UploadApiService();
export default uploadApi;
