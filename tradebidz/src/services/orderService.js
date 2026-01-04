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
