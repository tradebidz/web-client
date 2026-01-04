import axios from 'axios';
import { store } from '../redux/store';
import { setupRequestInterceptor, setupResponseInterceptor } from './apiClient';

/**
 * Media Service - Handles image uploads to media-service (Go)
 * Note: This service uses a separate axios instance since it connects to a different port
 */

const mediaServiceURL = import.meta.env.VITE_MEDIA_SERVICE_URL || 'http://localhost:8080/api/v1';

const mediaServiceClient = axios.create({
  baseURL: mediaServiceURL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Apply centralized interceptors for token handling and 401 refresh
setupRequestInterceptor(mediaServiceClient);
setupResponseInterceptor(mediaServiceClient);

/**
 * Upload an image file
 * @param {File} file - Image file to upload
 * @returns {Promise} Response containing the uploaded image URL
 */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await mediaServiceClient.post('/media/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

