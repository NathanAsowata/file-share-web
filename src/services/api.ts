/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
});

export const uploadContent = (formData: FormData, onUploadProgress: (progressEvent: any) => void) => {
  return apiClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

export const getMetadata = (shortId: string) => {
  return apiClient.get(`/meta/${shortId}`);
};