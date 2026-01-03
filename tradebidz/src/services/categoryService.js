import apiClient from './apiClient';

/**
 * Category Service - Handles all category-related API calls to app-service
 */

export const getCategories = async () => {
  const { data } = await apiClient.get('/categories');
  return data;
};

