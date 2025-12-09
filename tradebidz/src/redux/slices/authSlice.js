import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from "jwt-decode";

// Helper to get initial state from localStorage
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  accessToken: localStorage.getItem('accessToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { accessToken, user } = action.payload;
      state.accessToken = accessToken;
      // If BE doesn't return full user info, decode token to get role/id
      // const decoded = jwtDecode(accessToken);
      // state.user = { ...user, ...decoded }; 
      state.user = { ...user }
      state.isAuthenticated = true;
      
      // Save local to keep login when F5
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    },
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
      localStorage.setItem('accessToken', action.payload);
    }
  },
});

export const { loginSuccess, logout, updateAccessToken } = authSlice.actions;
export default authSlice.reducer;