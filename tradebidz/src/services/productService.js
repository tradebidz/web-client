import apiClient from './apiClient';

/**
 * Product Service - Handles all product-related API calls to app-service
 */

export const getProducts = async (filters = {}) => {
  const { data } = await apiClient.get('/products', { params: filters });
  return data;
};

export const getProductById = async (id) => {
  const { data } = await apiClient.get(`/products/${id}`);
  return data;
};

export const getTopEnding = async () => {
  const { data } = await apiClient.get('/products/top-ending');
  return data;
};

export const getTopBidding = async () => {
  const { data } = await apiClient.get('/products/top-bidding');
  return data;
};

export const getTopPrice = async () => {
  const { data } = await apiClient.get('/products/top-price');
  return data;
};

export const validateBidEligibility = async (productId) => {
  const { data } = await apiClient.get(`/products/${productId}/validate-bid`);
  return data;
};

export const getSuggestedPrice = async (productId) => {
  const { data } = await apiClient.get(`/products/${productId}/suggested-price`);
  return data;
};

export const getBidHistory = async (productId) => {
  const { data } = await apiClient.get(`/products/${productId}/history`);
  return data;
};

export const getSellerBids = async (productId) => {
  const { data } = await apiClient.get(`/products/${productId}/seller-bids`);
  return data;
};

export const createProduct = async (productData) => {
  const { data } = await apiClient.post('/products', productData);
  return data;
};

export const appendDescription = async (productId, content) => {
  const { data } = await apiClient.post(`/products/${productId}/descriptions`, { content });
  return data;
};

export const createQuestion = async (productId, content) => {
  const { data } = await apiClient.post(`/products/${productId}/questions`, { content });
  return data;
};

export const answerQuestion = async (questionId, answer) => {
  const { data } = await apiClient.post(`/products/questions/${questionId}/answer`, { answer });
  return data;
};

export const banBidder = async (productId, bidderData) => {
  const { data } = await apiClient.post(`/products/${productId}/ban-bidder`, bidderData);
  return data;
};

export const getCategories = async () => {
  const { data } = await apiClient.get('/categories');
  return data;
};

