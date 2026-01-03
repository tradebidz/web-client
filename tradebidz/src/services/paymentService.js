import apiClient from './apiClient';

/**
 * Payment Service - Handles payment-related API calls
 */

export const createPaymentUrl = async (orderId) => {
    const { data } = await apiClient.post('/payment/create_payment_url', { orderId });
    return data; // returns { url: string }
};
