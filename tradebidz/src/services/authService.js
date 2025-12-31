import apiClient from './apiClient';

/**
 * Auth Service - Handles all authentication-related API calls to app-service
 */

export const login = async (credentials) => {
  const { data } = await apiClient.post('/auth/login', credentials);
  return data;
};

export const register = async (payload) => {
  const { data } = await apiClient.post('/auth/register', payload);
  return data;
};

export const logout = async () => {
  const { data } = await apiClient.post('/auth/logout');
  return data;
};

export const googleLogin = async (token) => {
  const { data } = await apiClient.post('/auth/google-login', { token });
  return data;
};

export const verifyOtp = async (email, otp) => {
  const { data } = await apiClient.post('/auth/verify-otp', {
    email,
    otp,
  });
  return data;
};

export const resendOtp = async (email) => {
  const { data } = await apiClient.post('/auth/resend-otp', {
    email,
  });
  return data;
};

export const requestResetPassword = async (email) => {
  const { data } = await apiClient.post('/auth/request-reset-password', {
    email,
  });
  return data;
};

export const verifyResetOtp = async (email, otp) => {
  const { data } = await apiClient.post('/auth/verify-reset-otp', {
    email,
    otp,
  });
  return data;
};

export const resetPassword = async (email, otp, newPassword) => {
  const { data } = await apiClient.post('/auth/reset-password', {
    email,
    otp,
    new_password: newPassword,
  });
  return data;
};

