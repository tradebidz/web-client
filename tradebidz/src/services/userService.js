import apiClient from './apiClient';

/**
 * User Service - Handles all user-related API calls to app-service
 */

export const getCurrentUser = async () => {
  const { data } = await apiClient.get('/users/me');
  return data;
};

export const updateCurrentUser = async (payload) => {
  const { data } = await apiClient.patch('/users', payload);
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await apiClient.patch('/users/profile', payload);
  return data;
};

export const toggleWatchlist = async (productId) => {
  const { data } = await apiClient.post('/users/watchlist', { productId });
  return data;
};

export const getMyWatchlist = async () => {
  const { data } = await apiClient.get('/users/watchlist');
  return data;
};

export const getMyFeedbacks = async () => {
  const { data } = await apiClient.get('/users/feedbacks');
  return data;
};

export const getActiveBids = async () => {
  const { data } = await apiClient.get('/users/bids/active');
  return data;
};

export const getWonProducts = async () => {
  const { data } = await apiClient.get('/users/bids/won');
  return data;
};

export const rateSeller = async (ratingData) => {
  const { data } = await apiClient.post('/users/rate', ratingData);
  return data;
};

export const requestUpgrade = async (reason) => {
  const { data } = await apiClient.post('/users/upgrade', { reason });
  return data;
};

export const getSellingProducts = async () => {
  const { data } = await apiClient.get('/users/selling');
  return data;
};

export const getSoldProducts = async () => {
  const { data } = await apiClient.get('/users/sold');
  return data;
};

export const cancelTransaction = async (productId) => {
  const { data } = await apiClient.post('/users/cancel-transaction', { productId });
  return data;
};

