# Frontend-Backend Integration Guide

This document explains how the frontend (React) integrates with the backend microservices.

## Architecture Overview

The frontend communicates with **3 backend microservices**:

1. **app-service** (NestJS) - Port 3000 - Main API & WebSocket Gateway
2. **core-service** (Spring Boot) - Port 8082 - Bidding Engine
3. **media-service** (Go) - Port 8080 - Image Upload Service

## Service Files

All service files are located in `src/services/`:

### 1. `apiClient.js`
- Main HTTP client for **app-service** (NestJS)
- Handles JWT token authentication
- Automatic token refresh on 401 errors
- Base URL: `http://localhost:3000/api/v1` (configurable via `VITE_API_URL`)

### 2. `authService.js`
- Authentication endpoints:
  - `login()` - POST `/auth/login`
  - `register()` - POST `/auth/register`
  - `logout()` - POST `/auth/logout`
  - `googleLogin()` - POST `/auth/google-login`
  - `verifyOtp()` - POST `/auth/verify-otp`
  - `resendOtp()` - POST `/auth/resend-otp`
  - `requestResetPassword()` - POST `/auth/request-reset-password`
  - `verifyResetOtp()` - POST `/auth/verify-reset-otp`
  - `resetPassword()` - POST `/auth/reset-password`

### 3. `userService.js`
- User management endpoints:
  - `getCurrentUser()` - GET `/users/me`
  - `updateCurrentUser()` - PATCH `/users`
  - `updateProfile()` - PATCH `/users/profile`
  - `toggleWatchlist()` - POST `/users/watchlist`
  - `getMyWatchlist()` - GET `/users/watchlist`
  - `getMyFeedbacks()` - GET `/users/feedbacks`
  - `getActiveBids()` - GET `/users/bids/active`
  - `getWonProducts()` - GET `/users/bids/won`
  - `rateSeller()` - POST `/users/rate`
  - `requestUpgrade()` - POST `/users/upgrade`
  - `getSellingProducts()` - GET `/users/selling`
  - `getSoldProducts()` - GET `/users/sold`
  - `cancelTransaction()` - POST `/users/cancel-transaction`

### 4. `productService.js`
- Product endpoints:
  - `getProducts(filters)` - GET `/products` (with query params)
  - `getProductById(id)` - GET `/products/:id`
  - `getTopEnding()` - GET `/products/top-ending`
  - `getTopBidding()` - GET `/products/top-bidding`
  - `getTopPrice()` - GET `/products/top-price`
  - `validateBidEligibility(productId)` - GET `/products/:id/validate-bid`
  - `getSuggestedPrice(productId)` - GET `/products/:id/suggested-price`
  - `getBidHistory(productId)` - GET `/products/:id/history`
  - `createProduct(productData)` - POST `/products`
  - `appendDescription(productId, content)` - POST `/products/:id/descriptions`
  - `createQuestion(productId, content)` - POST `/products/:id/questions`
  - `answerQuestion(questionId, answer)` - POST `/products/questions/:questionId/answer`
  - `banBidder(productId, bidderData)` - POST `/products/:id/ban-bidder`

### 5. `categoryService.js`
- Category endpoints:
  - `getCategories()` - GET `/categories`

### 6. `biddingService.js`
- **Connects to core-service (Spring Boot) on port 8082**
- Bid placement:
  - `placeBid(bidData)` - POST `http://localhost:8082/api/v1/bids`
    - Requires `X-User-Id` header (automatically added from Redux auth state)
    - Body: `{ productId, amount, isAutoBid, maxAmount }`
- Base URL: `http://localhost:8082/api/v1` (configurable via `VITE_CORE_SERVICE_URL`)

### 7. `mediaService.js`
- **Connects to media-service (Go) on port 8080**
- Image upload:
  - `uploadImage(file)` - POST `http://localhost:8080/api/v1/media/upload`
    - Accepts `FormData` with file
    - Returns uploaded image URL
- Base URL: `http://localhost:8080/api/v1` (configurable via `VITE_MEDIA_SERVICE_URL`)

### 8. `websocketService.js`
- **WebSocket client for real-time bidding updates**
- Connects to app-service WebSocket gateway on namespace `/auctions`
- WebSocket URL: `http://localhost:3000` (configurable via `VITE_WS_URL`)
- Automatically subscribes to product updates
- Updates Redux store when bid updates are received
- Events:
  - `product_{productId}_update` - Real-time product/bid updates

## WebSocket Integration

### Using WebSocket in Components

Use the `useWebSocket` hook in your components:

```javascript
import { useWebSocket } from '../hooks/useWebSocket';

function ProductDetail() {
  const { id } = useParams();
  const { isConnected } = useWebSocket(id); // Automatically subscribes to product updates
  
  // Component will receive real-time updates via Redux
  const product = useSelector((state) => state.products.currentProduct);
  
  return (
    // Your component JSX
  );
}
```

### WebSocket Service Features

- **Automatic connection**: Connects when user is authenticated
- **Automatic reconnection**: Handles disconnections gracefully
- **Product subscriptions**: Subscribe to specific product updates
- **Redux integration**: Automatically updates Redux store on updates

## Environment Variables

Create a `.env` file in the `tradebidz` directory:

```env
# Backend Service URLs
VITE_API_URL=http://localhost:3000/api/v1
VITE_CORE_SERVICE_URL=http://localhost:8082/api/v1
VITE_MEDIA_SERVICE_URL=http://localhost:8080/api/v1
VITE_WS_URL=http://localhost:3000
```

## Usage Examples

### Example 1: Place a Bid

```javascript
import { placeBid } from '../services/biddingService';
import { toast } from 'react-toastify';

const handlePlaceBid = async () => {
  try {
    await placeBid({
      productId: 1,
      amount: 150.00,
      isAutoBid: false,
      maxAmount: null,
    });
    toast.success('Bid placed successfully!');
    // Real-time update will be received via WebSocket
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to place bid');
  }
};
```

### Example 2: Upload Image

```javascript
import { uploadImage } from '../services/mediaService';

const handleImageUpload = async (file) => {
  try {
    const response = await uploadImage(file);
    const imageUrl = response.url; // or response.data.url
    console.log('Image uploaded:', imageUrl);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Example 3: Get Products with Filters

```javascript
import { getProducts } from '../services/productService';
import { useDispatch } from 'react-redux';
import { setProducts } from '../redux/slices/productSlice';

const fetchProducts = async () => {
  try {
    const products = await getProducts({
      categoryId: 1,
      status: 'ACTIVE',
      search: 'laptop',
      page: 1,
      limit: 20,
    });
    dispatch(setProducts(products));
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
};
```

### Example 4: Real-time Product Updates

```javascript
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWebSocket } from '../hooks/useWebSocket';
import { useSelector } from 'react-redux';
import { updateProduct } from '../redux/slices/productSlice';

function ProductDetail() {
  const { id } = useParams();
  const { isConnected } = useWebSocket(parseInt(id));
  const product = useSelector((state) => 
    state.products.products.find(p => p.id === parseInt(id))
  );

  // Product will automatically update when WebSocket receives updates
  // The websocketService handles Redux updates automatically

  return (
    <div>
      {isConnected ? (
        <span className="text-green-500">Live updates active</span>
      ) : (
        <span className="text-gray-500">Connecting...</span>
      )}
      <h1>{product?.name}</h1>
      <p>Current Price: ${product?.currentPrice}</p>
    </div>
  );
}
```

## Redux Integration

All services integrate with Redux:

- **authSlice**: Authentication state (tokens, user)
- **productSlice**: Products list and current product
- **bidSlice**: Bids and bid history
- **userSlice**: User profile and data
- **categorySlice**: Categories
- **watchlistSlice**: User watchlist

The WebSocket service automatically updates Redux when real-time updates are received.

## Error Handling

All services use axios interceptors for error handling:

- **401 Unauthorized**: Automatically attempts token refresh
- **Token refresh failure**: Logs out user automatically
- **Network errors**: Propagated to calling code for handling

## Authentication Flow

1. User logs in via `authService.login()`
2. Tokens stored in Redux and localStorage
3. `apiClient` automatically attaches token to all requests
4. WebSocket connects automatically when authenticated
5. On token expiration, `apiClient` refreshes token automatically
6. On refresh failure, user is logged out

## Notes

- All services use async/await for promise handling
- Services return the `data` property from axios responses
- WebSocket connection is managed automatically by the `useWebSocket` hook
- The `biddingService` uses a separate axios instance for core-service
- The `mediaService` uses a separate axios instance for media-service
- All other services use the main `apiClient` for app-service

