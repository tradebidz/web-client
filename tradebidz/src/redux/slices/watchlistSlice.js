import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  watchlist: [], // Array of Watchlist items with product relations
  loading: false,
  error: null,
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    setWatchlist: (state, action) => {
      state.watchlist = action.payload;
      state.loading = false;
      state.error = null;
    },
    addToWatchlist: (state, action) => {
      // Check if already in watchlist
      const exists = state.watchlist.some(
        item => item.productId === action.payload.productId
      );
      if (!exists) {
        state.watchlist.push(action.payload);
      }
    },
    removeFromWatchlist: (state, action) => {
      state.watchlist = state.watchlist.filter(
        item => item.productId !== action.payload
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
  setWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  setLoading,
  setError,
} = watchlistSlice.actions;

export default watchlistSlice.reducer;

