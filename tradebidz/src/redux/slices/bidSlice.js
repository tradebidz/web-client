import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bids: [], // All bids
  myBids: [], // Current user's bids
  productBids: [], // Bids for a specific product
  loading: false,
  error: null,
};

const bidSlice = createSlice({
  name: 'bids',
  initialState,
  reducers: {
    setBids: (state, action) => {
      state.bids = action.payload;
      state.loading = false;
      state.error = null;
    },
    setMyBids: (state, action) => {
      state.myBids = action.payload;
      state.loading = false;
      state.error = null;
    },
    setProductBids: (state, action) => {
      state.productBids = action.payload;
      state.loading = false;
      state.error = null;
    },
    addBid: (state, action) => {
      state.bids.unshift(action.payload);
      // If it's the current user's bid, add to myBids
      if (action.payload.bidderId) {
        state.myBids.unshift(action.payload);
      }
      // If it's for the current product, add to productBids
      if (state.productBids.length > 0 && state.productBids[0]?.productId === action.payload.productId) {
        state.productBids.unshift(action.payload);
      }
    },
    updateBid: (state, action) => {
      const updateBidInArray = (arr) => {
        const index = arr.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          arr[index] = { ...arr[index], ...action.payload };
        }
      };
      updateBidInArray(state.bids);
      updateBidInArray(state.myBids);
      updateBidInArray(state.productBids);
    },
    removeBid: (state, action) => {
      state.bids = state.bids.filter(b => b.id !== action.payload);
      state.myBids = state.myBids.filter(b => b.id !== action.payload);
      state.productBids = state.productBids.filter(b => b.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearProductBids: (state) => {
      state.productBids = [];
    },
  },
});

export const {
  setBids,
  setMyBids,
  setProductBids,
  addBid,
  updateBid,
  removeBid,
  setLoading,
  setError,
  clearProductBids,
} = bidSlice.actions;

export default bidSlice.reducer;

