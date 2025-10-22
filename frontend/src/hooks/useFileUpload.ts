// File Upload Hook for Wheeler Knight Portfolio
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

interface UploadResponse {
  filename: string;
  original_filename: string;
  file_path: string;
  file_url: string;
  file_size: number;
  file_category: string;
  uploaded_at: string;
  uploaded_by: number;
}

interface UploadedFile {
  filename: string;
  file_path: string;
  file_url: string;
  file_size: number;
  file_category: string;
  uploaded_at: string;
}

// Upload image file
export const useUploadImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation<UploadResponse, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    },
    onSuccess: () => {
      // Invalidate files query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['uploaded-files'] });
    },
  });
};

// Upload document file
export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation<UploadResponse, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/upload/document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    },
    onSuccess: () => {
      // Invalidate files query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['uploaded-files'] });
    },
  });
};

// Get list of uploaded files
export const useUploadedFiles = () => {
  return useQuery<{ files: UploadedFile[] }, Error>({
    queryKey: ['uploaded-files'],
    queryFn: async () => {
      const response = await api.get('/upload/files');
      return response.data;
    },
  });
};

// Delete uploaded file
export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: async (filename: string) => {
      await api.delete(`/upload/${filename}`);
    },
    onSuccess: () => {
      // Invalidate files query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['uploaded-files'] });
    },
  });
};

// Utility function to validate file before upload
export const validateFile = (file: File, maxSize: number = 10 * 1024 * 1024): string | null => {
  // Check file size
  if (file.size > maxSize) {
    return `File size must be less than ${maxSize / (1024 * 1024)}MB`;
  }
  
  // Check file type
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(file.type)) {
    return 'File type not supported. Please upload PNG, JPG, GIF, WebP, SVG, PDF, or DOC files.';
  }
  
  return null;
};

// Utility function to get file category
export const getFileCategory = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext || '')) {
    return 'image';
  } else if (['pdf', 'doc', 'docx'].includes(ext || '')) {
    return 'document';
  }
  return 'other';
};

// Utility function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
