export interface FileUploadResponse {
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  url: string;
}

export interface MultipleFileUploadResponse {
  files: FileUploadResponse[];
  count: number;
}

export interface ImageUploadRequest {
  file: File;
}

export interface MultipleImageUploadRequest {
  files: File[];
}
