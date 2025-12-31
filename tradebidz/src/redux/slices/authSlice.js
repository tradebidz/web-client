import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';

// Helper to get initial state from localStorage
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const accessToken = action.payload.accessToken || action.payload.access_token;
      const refreshToken = action.payload.refreshToken || action.payload.refresh_token;
      const providedUser = action.payload.user;
    
      let derivedUser = null;
    
      // Case 1: Backend provided user fully
      if (providedUser) {
        derivedUser = {
          id: providedUser.id,
          email: providedUser.email,
          fullName: providedUser.full_name || providedUser.fullName,
          address: providedUser.address,
          role: providedUser.role,
          ratingScore: providedUser.rating_score,
          ratingCount: providedUser.rating_count,
          isVerified: providedUser.is_verified,
          createdAt: providedUser.created_at,
          updatedAt: providedUser.updated_at,
        };
      }
      // Case 2: Decode from token fallback
      else if (accessToken) {
        try {
          const decoded = jwtDecode(accessToken);
    
          derivedUser = {
            id: decoded.sub || decoded.id,
            email: decoded.email,
            fullName: decoded.full_name || decoded.fullName,
            role: decoded.role,
          };
    
          console.log("User decode from AT:", derivedUser);
        } catch (e) {
          toast.error("Failed to decode token");
          console.error("Failed to decode token:", e);
        }
      }
    
      // Update Redux state
      state.accessToken = accessToken;
      state.refreshToken = refreshToken || state.refreshToken;
      state.user = derivedUser;
      state.isAuthenticated = !!accessToken;
    
      // LocalStorage
      if (accessToken) localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      if (derivedUser) localStorage.setItem("user", JSON.stringify(derivedUser));
    },
    
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
      state.isAuthenticated = !!action.payload;
      localStorage.setItem('accessToken', action.payload);
    },
    updateRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
      localStorage.setItem('refreshToken', action.payload);
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  },
});

export const { loginSuccess, logout, updateAccessToken, updateRefreshToken, updateUser } = authSlice.actions;
export default authSlice.reducer;