import { useEffect, useRef } from 'react';
import websocketService from '../services/websocketService';
import { useSelector } from 'react-redux';

/**
 * React Hook for WebSocket connection management
 * Connects automatically for all users (authenticated or anonymous)
 * Authenticated users can bid, anonymous users can watch real-time updates
 * 
 * @param {number|null} productId - Product ID to subscribe to (optional)
 * @returns {Object} WebSocket connection status and methods
 */
export const useWebSocket = (productId = null) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const subscribedProductRef = useRef(null);

  useEffect(() => {
    // Always connect WebSocket - even for anonymous users
    // They can watch real-time updates (just can't bid without login)
    websocketService.connect();

    // Cleanup on unmount (but keep connection alive for other components)
    return () => {
      // Don't disconnect here - other components might still need it
      // WebSocket will auto-disconnect when all tabs close
    };
  }, []); // Empty dependency - connect once on mount

  // Subscribe to product updates when productId changes
  useEffect(() => {
    if (productId) {
      // Unsubscribe from previous product if any
      if (subscribedProductRef.current && subscribedProductRef.current !== productId) {
        websocketService.unsubscribeFromProduct(subscribedProductRef.current);
      }

      // Subscribe to new product
      websocketService.subscribeToProduct(productId);
      subscribedProductRef.current = productId;
    }

    // Cleanup: unsubscribe when productId changes or component unmounts
    return () => {
      if (subscribedProductRef.current) {
        websocketService.unsubscribeFromProduct(subscribedProductRef.current);
        subscribedProductRef.current = null;
      }
    };
  }, [productId]); // Removed isAuthenticated dependency

  return {
    isConnected: websocketService.getConnectionStatus(),
    subscribeToProduct: (id) => websocketService.subscribeToProduct(id),
    unsubscribeFromProduct: (id) => websocketService.unsubscribeFromProduct(id),
  };
};

