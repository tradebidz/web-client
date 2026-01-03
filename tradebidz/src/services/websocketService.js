import { io } from 'socket.io-client';
import { store } from '../redux/store';
import { updateProduct } from '../redux/slices/productSlice';
import { addBid, updateBid } from '../redux/slices/bidSlice';

/**
 * WebSocket Service - Handles real-time bidding updates via Socket.IO
 * Connects to app-service WebSocket gateway on namespace '/auctions'
 */

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.subscribedProducts = new Set();
  }

  /**
   * Connect to WebSocket server
   */
  connect() {
    if (this.socket?.connected) {
      console.log('WebSocket already connected');
      return;
    }

    const wsURL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

    this.socket = io(`${wsURL}/auctions`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected:', this.socket.id);
      this.isConnected = true;

      // Re-subscribe to previously subscribed products
      this.subscribedProducts.forEach(productId => {
        this.subscribeToProduct(productId);
      });
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.isConnected = false;
    });

    // Listen for product updates
    this.socket.onAny((eventName, data) => {
      if (eventName.startsWith('product_') && eventName.endsWith('_update')) {
        this.handleProductUpdate(data);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.subscribedProducts.clear();
      console.log('WebSocket disconnected');
    }
  }

  /**
   * Subscribe to real-time updates for a specific product
   * @param {number} productId - Product ID to subscribe to
   */
  subscribeToProduct(productId) {
    if (!this.isConnected || !this.socket) {
      console.warn('WebSocket not connected. Will subscribe when connected.');
      this.subscribedProducts.add(productId);
      return;
    }

    // The backend emits to `product_{productId}_update` automatically
    // We just need to listen for it
    const eventName = `product_${productId}_update`;

    this.socket.on(eventName, (data) => {
      this.handleProductUpdate(data);
    });

    this.subscribedProducts.add(productId);
    console.log(`Subscribed to product ${productId} updates`);
  }

  /**
   * Unsubscribe from product updates
   * @param {number} productId - Product ID to unsubscribe from
   */
  unsubscribeFromProduct(productId) {
    if (!this.socket) return;

    const eventName = `product_${productId}_update`;
    this.socket.off(eventName);
    this.subscribedProducts.delete(productId);
    console.log(`Unsubscribed from product ${productId} updates`);
  }

  /**
   * Handle product update from WebSocket
   * @param {Object} data - Update data from backend
   */
  handleProductUpdate(data) {
    console.log('Received product update:', data);

    // Map backend camelCase to frontend snake_case
    // Backend sends: { productId, currentPrice, winnerId, winnerName, bidCount, endTime }
    // Frontend expects: { id, current_price, winner_id, bid_count, end_time, ... }
    const mappedData = {
      id: data.productId,
      current_price: data.currentPrice,
      winner_id: data.winnerId,
      bid_count: data.bidCount,
      end_time: data.endTime,
      // Keep original data as well for any additional fields
      ...data,
    };

    // Update product in Redux store
    if (data.productId) {
      store.dispatch(updateProduct(mappedData));
    }

    // If there's bid information, update bid slice
    if (data.bid) {
      store.dispatch(addBid(data.bid));
    }
  }

  /**
   * Get connection status
   * @returns {boolean} Whether WebSocket is connected
   */
  getConnectionStatus() {
    return this.isConnected && this.socket?.connected;
  }
}

// Export singleton instance
const websocketService = new WebSocketService();
export default websocketService;

