import { useEffect, useState } from 'react';
import ProductCard from '../../components/product/ProductCard';
import LoadingModal from '../../components/common/LoadingModal';
import { FaHeartBroken, FaHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/common/ConfirmModal';
import { getMyWatchlist, toggleWatchlist } from '../../services/userService';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const WatchList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, productId: null });
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchWatchlist = async () => {
      try {
        setLoading(true);
        const watchlist = await getMyWatchlist();
        // API mới trả về trực tiếp mảng Product (enriched), không cần extract
        setProducts(watchlist || []);
      } catch (error) {
        console.error('Error fetching watchlist:', error);
        toast.error('Failed to load watchlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [isAuthenticated, navigate]);

  const handleRemove = (id) => {
    setConfirmModal({ isOpen: true, productId: id });
  };

  const confirmRemove = async () => {
    try {
      await toggleWatchlist(confirmModal.productId);
      setProducts(products.filter(p => p.id !== confirmModal.productId));
      toast.success("Item removed from Watchlist");
    } catch (error) {
      toast.error('Failed to remove from watchlist');
    } finally {
      setConfirmModal({ isOpen: false, productId: null });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <LoadingModal isOpen={loading} text="Đang tải danh sách theo dõi..." />

      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-text-main flex items-center gap-3">
          <FaHeart className="text-red-500" /> Danh sách theo dõi
        </h1>
        <p className="text-text-light mt-2">
          Theo dõi các sản phẩm bạn quan tâm.
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
                title="Bỏ theo dõi"
              >
                <FaHeartBroken />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <FaHeart className="mx-auto text-4xl text-gray-200 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Danh sách theo dõi trống</h3>
          <p className="text-gray-500 mb-6">Hãy tìm kiếm sản phẩm và thêm vào danh sách theo dõi!</p>
          <a href="/products" className="text-primary hover:underline font-medium">
            Khám phá sản phẩm
          </a>
        </div>
      )}

      {/* Confirm Remove Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Bỏ theo dõi"
        message="Bạn có chắc chắn muốn bỏ theo dõi sản phẩm này?"
        confirmText="Xóa"
        cancelText="Hủy"
        variant="warning"
        onConfirm={confirmRemove}
        onCancel={() => setConfirmModal({ isOpen: false, productId: null })}
      />
    </div>
  );
};

export default WatchList;