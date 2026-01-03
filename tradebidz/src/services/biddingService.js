import axios from 'axios';
import { store } from '../redux/store';

/**
 * Bidding Service - Handles bid placement to core-service (Spring Boot)
 * Note: This service uses a separate axios instance since it connects to a different port
 */

const coreServiceURL = import.meta.env.VITE_CORE_SERVICE_URL || 'http://localhost:8082/api/v1';

const coreServiceClient = axios.create({
  baseURL: coreServiceURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach user ID from auth state
coreServiceClient.interceptors.request.use(
  (config) => {
    const user = store.getState().auth.user;
    if (user?.id) {
      config.headers['X-User-Id'] = user.id.toString();
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Place a bid on a product
 * @param {Object} bidData - Bid information
 * @param {number} bidData.productId - Product ID
 * @param {number} bidData.amount - Bid amount
 * @param {boolean} bidData.isAutoBid - Whether this is an auto-bid
 * @param {number} bidData.maxAmount - Maximum amount for auto-bid (required if isAutoBid is true)
 * @returns {Promise} Response from core-service
 */
export const placeBid = async (bidData) => {
  const { data } = await coreServiceClient.post('/bids', {
    productId: bidData.productId,
    amount: bidData.amount,
    isAutoBid: bidData.isAutoBid || false,
    maxAmount: bidData.maxAmount || null,
  });
  return data;
};

/**
 * Buy a product immediately at fixed price
 * @param {number} productId - Product ID
 * @returns {Promise} Response from core-service
 */
export const buyNow = async (productId) => {
  const { data } = await coreServiceClient.post(`/bids/${productId}/buy-now`);
  return data;
};

