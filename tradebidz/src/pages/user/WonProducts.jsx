import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingModal from '../../components/common/LoadingModal';
import { getWonProducts, rateSeller } from '../../services/userService';
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
  const [showRateModal, setShowRateModal] = useState(false);
  const [rateData, setRateData] = useState({ productId: null, sellerId: null, score: 1, comment: '' });

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
      toast.error("Failed to load won products");
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
        toast.error("Failed to generate payment URL");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error(error.response?.data?.message || "Lỗi thanh toán");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleOpenRate = (item) => {
    // FIX: Lấy ID từ object seller mới
    setRateData({
      productId: item.id,
      sellerId: item.seller?.id || item.seller_id,
      score: 1,
      comment: ''
    });
    setShowRateModal(true);
  };

  const handleRateSubmit = async () => {
    if (!rateData.comment.trim()) {
      toast.error("Vui lòng nhập nhận xét");
      return;
    }
    try {
      await rateSeller({
        productId: rateData.productId,
        score: rateData.score,
        comment: rateData.comment
      });
      toast.success("Đánh giá thành công");
      setShowRateModal(false);
      fetchWonProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Đánh giá thất bại");
    }
  };

  const getStatusBadge = (item) => {
    // Backend mới chưa trả về orders/feedbacks trong list này (cần update backend nếu muốn hiển thị chính xác status)
    // Code này viết an toàn để fallback
    const order = item.orders?.[0];
    const isRated = item.feedbacks?.length > 0;
    const isPaid = order && ['PAID', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'succeeded', 'paid'].includes(order.status);

    if (isRated) return <span className="badge bg-green-100 text-green-800 flex items-center gap-1 w-fit px-2 py-1 rounded-full text-xs font-bold"><FaCheckCircle /> Hoàn tất</span>;
    if (isPaid) return <span className="badge bg-blue-100 text-blue-800 flex items-center gap-1 w-fit px-2 py-1 rounded-full text-xs font-bold"><FaTruck /> Đã thanh toán</span>;

    // Mặc định hiển thị Unpaid nếu chưa có info
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
                  const isPaid = order && ['PAID', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'succeeded', 'paid'].includes(order.status);

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
                        ) : isPaid ? (
                          <button
                            onClick={() => handleOpenRate(item)}
                            className="px-4 py-2 bg-secondary text-text-main text-xs font-bold rounded-lg shadow-md transition hover:bg-yellow-400 flex items-center gap-2 ml-auto"
                          >
                            <FaCommentDots /> Đánh giá
                          </button>
                        ) : (
                          <button
                            onClick={() => handleCheckout(item.id)}
                            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-md transition hover:bg-primary-dark"
                          >
                            Thanh toán ngay
                          </button>
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
      {showRateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 fade-in">
          <div className="bg-white rounded-xl p-6 w-96 shadow-2xl relative">
            <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
              <FaStar className="text-yellow-500" /> Đánh giá người bán
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Trải nghiệm</label>
              <div className="flex gap-4">
                <button
                  className={`flex-1 py-3 rounded-lg border-2 flex justify-center items-center gap-2 transition ${rateData.score === 1 ? 'border-green-500 bg-green-50 text-green-600' : 'border-gray-200 text-gray-400'}`}
                  onClick={() => setRateData({ ...rateData, score: 1 })}
                >
                  <FaThumbsUp /> Tốt
                </button>
                <button
                  className={`flex-1 py-3 rounded-lg border-2 flex justify-center items-center gap-2 transition ${rateData.score === -1 ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-200 text-gray-400'}`}
                  onClick={() => setRateData({ ...rateData, score: -1 })}
                >
                  <FaThumbsDown /> Kém
                </button>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Nhận xét</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-primary focus:border-primary"
                rows="3"
                placeholder="Mô tả trải nghiệm của bạn..."
                value={rateData.comment}
                onChange={(e) => setRateData({ ...rateData, comment: e.target.value })}
              ></textarea>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRateModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleRateSubmit}
                className="px-6 py-2 bg-primary text-white rounded-lg font-bold shadow hover:bg-primary-dark"
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WonProducts;