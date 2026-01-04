import apiClient from './apiClient';

export const getDashboardStats = async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
};

export const getCategories = async () => {
    // Re-use public category service or admin specific if needed
    // For now, assuming public GET /categories is sufficient or if admin needs specific struct
    // The controller doesn't have GET /admin/categories, so we use the public one via category service usually
    // But for admin management we might want direct access if there are hidden ones?
    // Looking at controller: Create, Update, Delete are in Admin. Get is not.
    // So we'll use the public one in the page, but let's expose these CUD ops here.
    return [];
};

export const createCategory = async (data) => {
    const response = await apiClient.post('/admin/categories', data);
    return response.data;
};

export const updateCategory = async (id, data) => {
    const response = await apiClient.patch(`/admin/categories/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await apiClient.delete(`/admin/categories/${id}`);
    return response.data;
};

export const getAllProducts = async (page = 1, limit = 10) => {
    const response = await apiClient.get('/admin/products', { params: { page, limit } });
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await apiClient.delete(`/admin/products/${id}`);
    return response.data;
};

export const getAllUsers = async (page = 1, limit = 10) => {
    const response = await apiClient.get('/admin/users', { params: { page, limit } });
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data;
};

export const updateUser = async (id, data) => {
    const response = await apiClient.patch(`/admin/users/${id}`, data);
    return response.data;
};

export const getPendingUpgrades = async () => {
    const response = await apiClient.get('/admin/upgrades');
    return response.data;
};

export const approveUpgrade = async (id, approved) => {
    const response = await apiClient.post(`/admin/upgrades/${id}/approve`, { approved });
    return response.data;
};
