import apiClient from './apiClient';

export const login = async (credentials) => {
  const endpoint = import.meta.env.VITE_API_LOGIN;
  const { data } = await apiClient.post(endpoint, credentials);
  return data;
};

export const register = async (payload) => {
  const endpoint = import.meta.env.VITE_API_REGISTER;
  const { data } = await apiClient.post(endpoint, payload);
  return data;
};

