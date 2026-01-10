import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingModal from '../../components/common/LoadingModal';
import { formatCurrency, formatTimeLeft } from '../../utils/format';
import { FaGavel, FaCheckCircle, FaExclamationCircle, FaExternalLinkAlt } from 'react-icons/fa';
import { getActiveBids } from '../../services/userService';
import { createOrder } from '../../services/orderService';
import { createPaymentUrl } from '../../services/paymentService';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const MyBidding = () => {
  // Đổi tên state thành products cho đúng ngữ nghĩa với API mới, 
  // nhưng vẫn giữ logic cũ để tương thích nếu API trả về mixed
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useSelector((state) => state.auth); // Lấy thêm user để so sánh winner
  const navigate = useNavigate();

  const handleCheckout = async (productId) => {
    try {
      // setLoading(true); // Có thể thêm loading state cục bộ nếu cần
      const order = await createOrder(productId);
      const { url } = await createPaymentUrl(order.id);
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Failed to generate payment URL");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error(error.response?.data?.message || "Lỗi thanh toán");
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchActiveBids = async () => {
      try {
        setLoading(true);
        const data = await getActiveBids();
        setItems(data || []);
      } catch (error) {
        console.error('Error fetching active bids:', error);
        toast.error('Failed to load active bids');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveBids();
  }, [isAuthenticated, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <LoadingModal isOpen={loading} text="Đang tải..." />

      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-text-main flex items-center gap-3">
          <FaGavel className="text-primary" /> Đang đấu giá
        </h1>
        <p className="text-text-light mt-2">
          Các sản phẩm bạn đang tham gia đấu giá.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-text-light text-xs uppercase font-semibold">
                <tr>
                  <th className="p-4">Sản phẩm</th>
                  <th className="p-4">Giá hiện tại</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4">Người giữ giá cao nhất</th>
                  <th className="p-4">Thời gian còn lại</th>
                  <th className="p-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {items.map((item) => {
                  // Helper để lấy dữ liệu dù nó ở root (API mới) hay lồng trong product (API cũ)
                  const product = item.product || item;
                  const sellerName = product.seller?.full_name || 'Unknown';
                  const isWinning = product.winner_id === user?.id; // Check based on logged in user ID

                  return (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                      {/* Product Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.thumbnail || product.product_images?.[0]?.url || '/placeholder.png'}
                            alt={product.name}
                            className="w-12 h-12 rounded object-cover border border-gray-200"
                          />
                          <div>
                            <Link to={`/product/${product.id}`} className="font-medium text-text-main hover:text-primary line-clamp-1 max-w-[200px]">
                              {product.name}
                            </Link>
                            {/* --- FIX LỖI CRASH Ở ĐÂY: Truy cập sâu vào .full_name --- */}
                            <span className="text-xs text-text-light block">
                              Người bán: {sellerName}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Current Price */}
                      <td className="p-4 font-bold text-primary">
                        {formatCurrency(product.current_price)}
                      </td>

                      {/* Status (Outbid / Leading) */}
                      <td className="p-4">
                        {isWinning ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                            <FaCheckCircle /> Đang dẫn đầu
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold animate-pulse">
                            <FaExclamationCircle /> Bị vượt giá
                          </span>
                        )}
                      </td>

                      {/* Highest Bidder Name */}
                      <td className="p-4 text-gray-600 font-medium">
                        {product.current_bidder_name || '---'}
                        {isWinning && <span className="text-xs text-green-600 ml-1">(Bạn)</span>}
                      </td>

                      {/* Time Left */}
                      <td className="p-4 text-gray-500">
                        {product.end_time ? formatTimeLeft(product.end_time) : 'N/A'}
                      </td>

                      {/* Action */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/product/${product.id}`}
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${isWinning
                              ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              : 'bg-primary text-white hover:bg-primary-dark shadow-md shadow-primary/30'
                              }`}
                            title={isWinning ? "Xem chi tiết" : "Đấu giá ngay!"}
                          >
                            <FaExternalLinkAlt className="text-xs" />
                          </Link>
                          {/* Payment Button if won and ended */}
                          {product.end_time && new Date(product.end_time) < new Date() && isWinning && (
                            <button
                              onClick={() => handleCheckout(product.id)}
                              className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 text-xs font-bold shadow-sm transition-colors"
                              title="Thanh toán ngay"
                            >
                              Thanh toán
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <FaGavel className="mx-auto text-4xl text-gray-200 mb-4" />
            <p className="text-gray-500">Bạn chưa tham gia đấu giá sản phẩm nào.</p>
            <Link to="/products" className="mt-4 inline-block text-primary hover:underline">
              Tìm kiếm sản phẩm
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBidding;