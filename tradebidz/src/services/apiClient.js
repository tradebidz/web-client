import axios from 'axios';
import { store } from '../redux/store';
import { logout, updateAccessToken, updateRefreshToken } from '../redux/slices/authSlice';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
const refreshTokenURL = `${baseURL.replace(/\/$/, '')}/auth/refresh`;

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Reusable Request Interceptor
export const setupRequestInterceptor = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.accessToken || localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

// Reusable Response Interceptor
export const setupResponseInterceptor = (instance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken =
          store.getState().auth.refreshToken || localStorage.getItem('refreshToken');

        if (!refreshToken) {
          store.dispatch(logout());
          return Promise.reject(error);
        }

        try {
          const response = await axios.post(
            refreshTokenURL,
            { refresh_token: refreshToken, refreshToken },
            { headers: { Authorization: `Bearer ${refreshToken}` }}
          );

          const newAccessToken = response.data?.access_token || response.data?.accessToken;
          const newRefreshToken = response.data?.refresh_token || response.data?.refreshToken;

          if (newAccessToken) {
            store.dispatch(updateAccessToken(newAccessToken));
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          if (newRefreshToken) {
            store.dispatch(updateRefreshToken(newRefreshToken));
          }

          // Return the original instance call
          return instance(originalRequest);
        } catch (err) {
          store.dispatch(logout());
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );
};

// Apply to default instance
setupRequestInterceptor(apiClient);
setupResponseInterceptor(apiClient);

export default apiClient;