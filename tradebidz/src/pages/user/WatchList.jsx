import { useEffect, useState } from 'react';
import ProductCard from '../../components/product/ProductCard';
import LoadingModal from '../../components/common/LoadingModal';
import { mockWatchList } from '../../utils/mockData';
import { FaHeartBroken, FaHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/common/ConfirmModal';

const WatchList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, productId: null });

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setProducts(mockWatchList);
      setLoading(false);
    }, 600);
  }, []);

  const handleRemove = (id) => {
    setConfirmModal({ isOpen: true, productId: id });
  };

  const confirmRemove = () => {
    setProducts(products.filter(p => p.id !== confirmModal.productId));
    toast.success("Item removed from Watchlist");
    setConfirmModal({ isOpen: false, productId: null });
  };

  return (
    <div className="container mx-auto">
      <LoadingModal isOpen={loading} text="Loading your favorites..." />

      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-text-main flex items-center gap-3">
          <FaHeart className="text-red-500" /> My Watchlist
        </h1>
        <p className="text-text-light mt-2">
          Keep track of products you are interested in.
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} />
              
              {/* Overlay remove button */}
              <button
                onClick={() => handleRemove(product.id)}
                className="absolute top-2 right-2 z-10 bg-white/90 p-2 rounded-full text-gray-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
                title="Remove from Watchlist"
              >
                <FaHeartBroken />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <FaHeart className="mx-auto text-4xl text-gray-200 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Your Watchlist is empty</h3>
          <p className="text-gray-500 mb-6">Start exploring and save items you love!</p>
          <a href="/products" className="text-primary hover:underline font-medium">
            Browse Products
          </a>
        </div>
      )}

      {/* Confirm Remove Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Remove from Watchlist"
        message="Remove this item from your Watchlist?"
        confirmText="Remove"
        cancelText="Cancel"
        variant="warning"
        onConfirm={confirmRemove}
        onCancel={() => setConfirmModal({ isOpen: false, productId: null })}
      />
    </div>
  );
};

export default WatchList;