import apiClient from './apiClient';

/**
 * Order Service - Handles order-related API calls
 */

export const createOrder = async (productId) => {
    const { data } = await apiClient.post('/orders', { productId });
    return data;
};

export const getOrder = async (id) => {
    const { data } = await apiClient.get(`/orders/${id}`);
    return data;
};

export const getMyOrders = async () => {
    const { data } = await apiClient.get('/orders');
    return data;
};

/**
 * Upload payment receipt (for buyer)
 * @param {number} orderId - Order ID
 * @param {string} receiptUrl - URL of the uploaded payment receipt image
 * @param {string} shippingAddress - Shipping address for delivery
 */
export const uploadPaymentReceipt = async (orderId, receiptUrl, shippingAddress) => {
    const { data } = await apiClient.patch(`/orders/${orderId}/payment-receipt`, {
        paymentReceiptUrl: receiptUrl,
        shippingAddress: shippingAddress
    });
    return data;
};

/**
 * Upload shipping tracking information (for seller)
 * @param {number} orderId - Order ID
 * @param {object} trackingInfo - Tracking information
 * @param {string} trackingInfo.trackingCode - Shipping tracking code
 * @param {string} trackingInfo.company - Shipping company name
 * @param {string} trackingInfo.trackingUrl - URL of the uploaded tracking document image (optional)
 */
export const uploadShippingTracking = async (orderId, trackingInfo) => {
    const { data } = await apiClient.patch(`/orders/${orderId}/shipping-tracking`, trackingInfo);
    return data;
};

/**
 * Confirm delivery (for buyer)
 * @param {number} orderId - Order ID
 */
export const confirmDelivery = async (orderId) => {
    const { data } = await apiClient.patch(`/orders/${orderId}/confirm-delivery`);
    return data;
};
