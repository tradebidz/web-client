import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingModal from '../../components/common/LoadingModal';
import EditDescriptionModal from '../../components/product/EditDescriptionModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import RatingModal from '../../components/common/RatingModal';
import { formatCurrency, formatTimeLeft } from '../../utils/format';
import { FaBoxOpen, FaEye, FaGavel, FaPen, FaCommentDots, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getSellingProducts, getSoldProducts, cancelTransaction, rateSeller as rateTransaction } from '../../services/userService';
import { getProductById } from '../../services/productService';
import { useSelector } from 'react-redux';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Modals for Cancellation and Rating
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, productId: null });
  const [ratingModal, setRatingModal] = useState({ isOpen: false, product: null });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = activeTab === 'active'
          ? await getSellingProducts()
          : await getSoldProducts();

        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Lỗi tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    setCurrentPage(1); // Reset to page 1 when tab changes
  }, [activeTab, isAuthenticated, navigate]);

  const handleOpenEditModal = async (product) => {
    try {
      // Fetch full product details to get descriptions
      const fullProduct = await getProductById(product.id);
      setEditingProduct(fullProduct);
      setIsEditModalOpen(true);
    } catch (error) {
      toast.error('Lỗi khi tải thông tin sản phẩm');
    }
  };

  const handleEditSuccess = async () => {
    // Refresh products list
    const data = activeTab === 'active'
      ? await getSellingProducts()
      : await getSoldProducts();
    setProducts(Array.isArray(data) ? data : []);
  };

  const handleCancelTransaction = async (id) => {
    try {
      setLoading(true);
      await cancelTransaction(id);
      toast.success("Hủy giao dịch thành công và người thắng đã bị đánh giá -1.");
      const data = await getSoldProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Hủy giao dịch thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleRateWinner = async ({ score, comment }) => {
    try {
      setLoading(true);
      await rateTransaction({
        productId: ratingModal.product.id,
        score,
        comment
      });
      toast.success("Đánh giá người thắng thành công!");
      setRatingModal({ isOpen: false, product: null });
      // Refresh list
      const data = await getSoldProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Đánh giá thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <LoadingModal isOpen={loading} text="Đang tải cửa hàng..." />

      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main flex items-center gap-3">
            <FaBoxOpen className="text-primary" /> Quản lý sản phẩm
          </h1>
          <p className="text-text-light mt-1">Quản lý tin đăng và đơn hàng của bạn.</p>
        </div>
        <Link to="/post-product" className="px-6 py-2 bg-primary-light font-bold rounded-lg shadow hover:bg-primary transition">
          + Đăng bán mới
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'active' ? 'border-primary text-primary' : 'border-transparent text-text-light hover:text-text-main'
            }`}
        >
          Đang đấu giá {activeTab === 'active' && `(${products.length})`}
        </button>
        <button
          onClick={() => setActiveTab('ended')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'ended' ? 'border-primary text-primary' : 'border-transparent text-text-light hover:text-text-main'
            }`}
        >
          Đã bán / Kết thúc {activeTab === 'ended' && `(${products.length})`}
        </button>
      </div>

      {/* Pagination info */}
      <div className="mb-4 text-sm text-gray-600">
        Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, products.length)} của {products.length} sản phẩm
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-text-light text-xs uppercase font-semibold">
                <tr>
                  <th className="p-4">Sản phẩm</th>
                  <th className="p-4">Giá / Lượt đấu</th>
                  <th className="p-4">Người giữ giá / Người thắng</th>
                  <th className="p-4">Thời gian</th>
                  <th className="p-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {products
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="p-4 max-w-xs">
                        <div className="flex items-center gap-3">
                          {/* FIX: Image source */}
                          <img
                            src={item.thumbnail || item.product_images?.[0]?.url || '/placeholder.png'}
                            alt={item.name}
                            className="w-12 h-12 rounded object-cover border border-gray-200"
                          />
                          <div className="truncate">
                            {/* FIX: Link path */}
                            <Link to={`/product/${item.id}`} className="font-medium text-text-main hover:text-primary block truncate">
                              {item.name}
                            </Link>
                            <span className="text-xs text-text-light">ID: #{item.id}</span>
                            {item.status === 'CANCELLED' && <span className="text-xs text-red-500 font-bold block">CANCELLED</span>}
                          </div>
                        </div>
                      </td>

                      <td className="p-4 flex flex-col gap-1">
                        <div className="font-bold text-primary">{formatCurrency(item.current_price > 0 ? item.current_price : item.start_price)}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          {/* FIX: Dùng item.bid_count */}
                          <FaGavel /> {item.bid_count || 0} lượt đấu
                        </div>
                      </td>

                      <td className="p-4 text-gray-600">
                        {activeTab === 'active' ? (
                          // FIX: Dùng current_bidder_name từ API
                          item.current_bidder_name || 'Chưa có lượt đấu'
                        ) : (
                          item.winner_id ? (
                            // FIX: Dùng winner object
                            <span className="text-green-600 font-medium">🏆 {item.winner?.full_name || 'Người thắng'}</span>
                          ) : (
                            <span className="text-gray-400">Không có người thắng</span>
                          )
                        )}
                      </td>

                      <td className="p-4 text-gray-500">
                        {activeTab === 'active' && item.end_time ? formatTimeLeft(item.end_time) : (item.end_time ? 'Kết thúc' : 'N/A')}
                      </td>

                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <Link
                            to={`/product/${item.id}`}
                            className="p-2 text-gray-500 hover:text-primary hover:bg-blue-50 rounded transition"
                            title="View Details"
                          >
                            <FaEye />
                          </Link>

                          {activeTab === 'active' && (
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              className="p-2 text-gray-500 hover:text-primary hover:bg-blue-50  rounded transition"
                              title="Bổ sung mô tả"
                            >
                              <FaPen />
                            </button>
                          )}

                          {activeTab === 'ended' && (item.status === 'SOLD' || item.status === 'CANCELLED') && (
                            <div className="flex gap-2">
                              {item.is_rated ? (
                                <span className="flex items-center gap-1 text-green-500 text-xs font-bold px-2 py-1 bg-green-50 rounded italic">
                                  <FaCheckCircle /> Đã đánh giá
                                </span>
                              ) : item.winner_id && (
                                <button
                                  onClick={() => setRatingModal({ isOpen: true, product: item })}
                                  className="px-3 py-1 bg-primary text-white rounded-lg transition text-xs font-bold shadow-sm hover:bg-primary-dark flex items-center gap-1"
                                  title="Đánh giá người thắng"
                                >
                                  <FaCommentDots /> Đánh giá
                                </button>
                              )}

                              {item.status === 'SOLD' && (
                                <button
                                  onClick={() => setConfirmModal({ isOpen: true, productId: item.id })}
                                  className="px-3 py-1 bg-white text-red-500 hover:bg-red-50 rounded-lg transition text-xs font-bold border border-red-200"
                                  title="Hủy giao dịch"
                                >
                                  Hủy
                                </button>
                              )}

                              {/* Pending Payment UI */}
                              {item.status !== 'SOLD' && item.status !== 'CANCELLED' && item.winner_id && (
                                <div className="flex flex-col gap-1 items-end">
                                  <span className="text-orange-500 text-xs font-bold flex items-center gap-1">
                                    <FaExclamationCircle /> Chờ thanh toán
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {/* Countdown Logic: Assume 24h payment window */}
                                    Còn {formatTimeLeft(new Date(new Date(item.end_time).getTime() + 24 * 60 * 60 * 1000))}
                                  </span>
                                  <button
                                    onClick={() => setConfirmModal({ isOpen: true, productId: item.id })}
                                    className="px-3 py-1 bg-white text-red-500 hover:bg-red-50 rounded-lg transition text-xs font-bold border border-red-200 mt-1"
                                    title="Hủy giao dịch"
                                  >
                                    Hủy
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            Không tìm thấy sản phẩm.
          </div>
        )}
      </div>

      {/* Pagination */}
      {products.length > itemsPerPage && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 hover:text-primary text-gray-600 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Trước
          </button>

          {Array.from({ length: Math.ceil(products.length / itemsPerPage) }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-10 h-10 rounded-lg transition text-sm font-medium ${currentPage === pageNum
                ? 'bg-primary text-white shadow-md shadow-primary/30'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(Math.ceil(products.length / itemsPerPage), prev + 1))}
            disabled={currentPage >= Math.ceil(products.length / itemsPerPage)}
            className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 hover:text-primary text-gray-600 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Sau
          </button>
        </div>
      )}

      {/* Edit Description Modal */}
      <EditDescriptionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSuccess={handleEditSuccess}
      />

      {/* Confirmation Modal for Cancellation */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, productId: null })}
        onConfirm={() => handleCancelTransaction(confirmModal.productId)}
        title="Xác nhận hủy giao dịch"
        message="Bạn có chắc chắn muốn hủy giao dịch này? Người thắng sẽ bị đánh giá -1 điểm tín nhiệm do không hoàn tất thanh toán."
        confirmText="Đồng ý hủy"
        cancelText="Quay lại"
        type="danger"
      />

      {/* Rating Modal for Seller rating Winner */}
      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={() => setRatingModal({ isOpen: false, product: null })}
        onSubmit={handleRateWinner}
        title="Đánh giá người thắng"
        targetName={ratingModal.product?.winner?.full_name || 'Người thắng'}
      />
    </div>
  );
};

export default MyProducts;