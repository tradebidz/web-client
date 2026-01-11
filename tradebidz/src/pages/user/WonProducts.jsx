import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingModal from '../../components/common/LoadingModal';
import RatingModal from '../../components/common/RatingModal';
import { getWonProducts, rateSeller as rateTransaction } from '../../services/userService';
import { createOrder } from '../../services/orderService';
import { createPaymentUrl } from '../../services/paymentService';
import { formatCurrency } from '../../utils/format';
import { FaTrophy, FaTruck, FaCheckCircle, FaCommentDots, FaMoneyBillWave, FaStar, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { toast } from 'react-toastify';

const WonProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Rating State
  const [ratingModal, setRatingModal] = useState({ isOpen: false, product: null });

  useEffect(() => {
    fetchWonProducts();
  }, []);

  const fetchWonProducts = async () => {
    try {
      setLoading(true);
      const data = await getWonProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Failed to load won products:", error);
      toast.error("Lỗi: Không thể tải sản phẩm đã thắng");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (productId) => {
    try {
      setCheckoutLoading(true);
      const order = await createOrder(productId);
      const { url } = await createPaymentUrl(order.id);
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Lỗi: Không thể tạo liên kết thanh toán");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error(error.response?.data?.message || "Lỗi: Không thể tạo liên kết thanh toán");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleOpenRate = (item) => {
    setRatingModal({ isOpen: true, product: item });
  };

  const handleRateSubmit = async ({ score, comment }) => {
    try {
      setCheckoutLoading(true);
      await rateTransaction({
        productId: ratingModal.product.id,
        score,
        comment
      });
      toast.success("Đánh giá thành công");
      setRatingModal({ isOpen: false, product: null });
      fetchWonProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Đánh giá thất bại");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const getStatusBadge = (item) => {
    const order = item.orders?.[0];
    const isRated = item.feedbacks?.length > 0;
    
    if (!order) {
      return <span className="badge bg-yellow-100 text-yellow-800 flex items-center gap-1 w-fit px-2 py-1 rounded-full text-xs font-bold"><FaMoneyBillWave /> Chưa thanh toán</span>;
    }

    // Rating chỉ cho phép khi DELIVERED hoặc COMPLETED
    if (isRated || order.status === 'DELIVERED' || order.status === 'COMPLETED') {
      return <span className="badge bg-green-100 text-green-800 flex items-center gap-1 w-fit px-2 py-1 rounded-full text-xs font-bold"><FaCheckCircle /> {isRated ? 'Hoàn tất' : (order.status === 'DELIVERED' ? 'Đã nhận hàng' : 'Hoàn tất')}</span>;
    }
    
    if (order.status === 'SHIPPED') {
      return <span className="badge bg-blue-100 text-blue-800 flex items-center gap-1 w-fit px-2 py-1 rounded-full text-xs font-bold"><FaTruck /> Đang giao hàng</span>;
    }
    
    if (order.payment_status === 'PAID' || order.status === 'PAID') {
      return <span className="badge bg-green-100 text-green-700 flex items-center gap-1 w-fit px-2 py-1 rounded-full text-xs font-bold"><FaCheckCircle /> Đã thanh toán</span>;
    }

    // Mặc định hiển thị Unpaid
    return <span className="badge bg-yellow-100 text-yellow-800 flex items-center gap-1 w-fit px-2 py-1 rounded-full text-xs font-bold"><FaMoneyBillWave /> Chưa thanh toán</span>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <LoadingModal isOpen={loading || checkoutLoading} text={checkoutLoading ? "Đang xử lý thanh toán..." : "Đang tải sản phẩm..."} />

      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-text-main flex items-center gap-3">
          <FaTrophy className="text-yellow-500" /> Sản phẩm đã thắng
        </h1>
        <p className="text-text-light mt-2">Chúc mừng! Đây là danh sách các sản phẩm bạn đã đấu giá thành công.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-text-light text-xs uppercase font-semibold">
                <tr>
                  <th className="p-4">Sản phẩm</th>
                  <th className="p-4">Giá thắng</th>
                  <th className="p-4">Người bán</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {products.map((item) => {
                  const order = item.orders?.[0];
                  const isRated = item.feedbacks?.length > 0;
                  const canPay = !order || (order.payment_status !== 'PAID' && order.status !== 'CANCELLED');
                  // Chỉ cho phép rating khi đã DELIVERED hoặc COMPLETED
                  const canRate = order && (order.status === 'DELIVERED' || order.status === 'COMPLETED') && !isRated;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {/* FIX: Dùng thumbnail từ API mới */}
                          <img
                            src={item.thumbnail || item.product_images?.[0]?.url || '/placeholder.png'}
                            alt={item.name}
                            className="w-12 h-12 rounded object-cover border border-gray-200"
                          />
                          {/* FIX: Route products (số nhiều) */}
                          <Link to={`/product/${item.id}`} className="font-medium text-text-main hover:text-primary line-clamp-1">
                            {item.name}
                          </Link>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-primary">{formatCurrency(item.current_price)}</td>
                      {/* FIX: Truy cập seller.full_name thay vì users_products... */}
                      <td className="p-4 text-gray-600">{item.seller?.full_name || 'Người bán'}</td>
                      <td className="p-4">
                        {getStatusBadge(item)}
                      </td>
                      <td className="p-4 text-right">
                        {isRated ? (
                          <span className="text-gray-400 text-xs italic">Đã đánh giá</span>
                        ) : canRate ? (
                          <button
                            onClick={() => handleOpenRate(item)}
                            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-md transition hover:bg-primary-dark flex items-center gap-2 ml-auto"
                          >
                            <FaCommentDots /> Đánh giá
                          </button>
                        ) : canPay ? (
                          <button
                            onClick={() => handleCheckout(item.id)}
                            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-md transition hover:bg-primary-dark"
                          >
                            Thanh toán ngay
                          </button>
                        ) : (
                          <Link
                            to="/order-history"
                            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-md transition hover:bg-blue-700 inline-block"
                          >
                            Xem chi tiết đơn hàng
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            Bạn chưa thắng sản phẩm nào.
          </div>
        )}
      </div>

      {/* Rate Modal - Giữ nguyên logic */}
      {/* Shared Rating Modal */}
      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={() => setRatingModal({ isOpen: false, product: null })}
        onSubmit={handleRateSubmit}
        title="Đánh giá người bán"
        targetName={ratingModal.product?.seller?.full_name || 'Người bán'}
      />
    </div>
  );
};

export default WonProducts;