import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import bidReducer from './slices/bidSlice';
import watchlistReducer from './slices/watchlistSlice';
import userReducer from './slices/userSlice';
import upgradeRequestReducer from './slices/upgradeRequestSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    categories: categoryReducer,
    bids: bidReducer,
    watchlist: watchlistReducer,
    users: userReducer,
    upgradeRequests: upgradeRequestReducer,
  },
});