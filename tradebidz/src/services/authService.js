import apiClient from './apiClient';

// const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
// const authBasePath = `${baseURL.replace(/\/$/, '')}/auth`;

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

export const verifyOtp = async (email, otp) => {
  // const { data } = await apiClient.post(`${authBasePath}/verify-otp`, {
  //   email,
  //   otp,
  // });

  const endpoint = import.meta.env.VITE_API_VERIFY_OTP;
  const payload = {
    email,
    otp,
  };
  const { data } = await apiClient.post(endpoint, payload);
  return data;
};

export const resendOtp = async (email) => {
  // const { data } = await apiClient.post(`${authBasePath}/resend-otp`, {
  //   email,
  // });

  const endpoint = import.meta.env.VITE_API_RESEND_OTP;
  const payload = {
    email,
  };
  const { data } = await apiClient.post(endpoint, payload);
  return data;
};

export const requestResetPassword = async (email) => {
  // const { data } = await apiClient.post(`${authBasePath}/request-reset-password`, {
  //   email,
  // });

  const endpoint = import.meta.env.VITE_API_REQUEST_RESET;
  const payload = {
    email,
  };
  const { data } = await apiClient.post(endpoint, payload);
  return data;
};

export const verifyResetOtp = async (email, otp) => {
  // const { data } = await apiClient.post(`${authBasePath}/verify-reset-otp`, {
  //   email,
  //   otp,
  // });

  const endpoint = import.meta.env.VITE_API_VERIFY_RESET;
  const payload = {
    email,
    otp,
  };
  const { data } = await apiClient.post(endpoint, payload);
  return data;
};

export const resetPassword = async (email, otp, newPassword) => {
  // const { data } = await apiClient.post(`${authBasePath}/reset-password`, {
  //   email,
  //   otp,
  //   new_password: newPassword,
  // });

  const endpoint = import.meta.env.VITE_API_RESET_PASSWORD;
  const payload = {
    email,
    otp,
    new_password: newPassword,
  };
  const { data } = await apiClient.post(endpoint, payload);
  return data;
};

