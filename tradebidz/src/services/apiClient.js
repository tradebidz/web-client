import axios from 'axios';
import { store } from '../redux/store';
import { logout, updateAccessToken } from '../redux/slices/authSlice';

const apiClient = axios.create({
  // Change this URL to your NestJS backend URL
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach token to header
apiClient.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 (Unauthorized) and not tried retry yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Assume API refresh token is /auth/refresh
        // Note: Refresh token usually saved in httpOnly cookie, 
        // if saved in localStorage, need to get it and send with.
        const refreshToken = localStorage.getItem('refreshToken'); // Example if saved in local
        
        const response = await axios.post('http://localhost:3000/api/auth/refresh', { refreshToken });
        
        const { accessToken } = response.data;
        
        // Update Redux and LocalStorage
        store.dispatch(updateAccessToken(accessToken));
        
        // Attach new token to old request and call again
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        // If refresh also fails -> Logout
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;