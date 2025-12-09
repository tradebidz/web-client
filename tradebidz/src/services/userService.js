import apiClient from './apiClient';

export const getCurrentUser = async () => {
  const endpoint = import.meta.env.VITE_API_GET_ME;
  const { data } = await apiClient.get(endpoint);
  return data;
};

export const updateCurrentUser = async (payload) => {
  const endpoint = import.meta.env.VITE_API_UPDATE_ME;
  const { data } = await apiClient.patch(endpoint, payload);
  return data;
};

