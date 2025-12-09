import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  upgradeRequests: [],
  loading: false,
  error: null,
};

const upgradeRequestSlice = createSlice({
  name: 'upgradeRequests',
  initialState,
  reducers: {
    setUpgradeRequests: (state, action) => {
      state.upgradeRequests = action.payload;
      state.loading = false;
      state.error = null;
    },
    addUpgradeRequest: (state, action) => {
      state.upgradeRequests.unshift(action.payload);
    },
    updateUpgradeRequest: (state, action) => {
      const index = state.upgradeRequests.findIndex(
        req => req.id === action.payload.id
      );
      if (index !== -1) {
        state.upgradeRequests[index] = {
          ...state.upgradeRequests[index],
          ...action.payload,
        };
      }
    },
    removeUpgradeRequest: (state, action) => {
      state.upgradeRequests = state.upgradeRequests.filter(
        req => req.id !== action.payload
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setUpgradeRequests,
  addUpgradeRequest,
  updateUpgradeRequest,
  removeUpgradeRequest,
  setLoading,
  setError,
} = upgradeRequestSlice.actions;

export default upgradeRequestSlice.reducer;

