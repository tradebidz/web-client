import { useState, useEffect, Fragment } from 'react';
import { FaTrash, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils/format';
import { Link } from 'react-router-dom';
import ConfirmModal from '../../components/common/ConfirmModal';
import { getAllProducts, deleteProduct } from '../../services/adminService';
import LoadingModal from '../../components/common/LoadingModal';

const ProductManagePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, productId: null });

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, pagination.limit]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProducts(pagination.page, pagination.limit);

      setProducts(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.total,
        totalPages: response.last_page
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const generatePageNumbers = () => {
    const { page: currentPage, totalPages } = pagination;
    const pages = [];
    const delta = 2;

    pages.push(1);

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    if (rangeStart > 2) {
      pages.push('...');
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < totalPages - 1) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleRemove = (id) => {
    setConfirmModal({ isOpen: true, productId: id });
  };

  const confirmRemove = async () => {
    try {
      await deleteProduct(confirmModal.productId);
      toast.success("Đã xóa sản phẩm thành công.");
      fetchProducts();
    } catch (error) {
      toast.error("Lỗi khi xóa sản phẩm");
    } finally {
      setConfirmModal({ isOpen: false, productId: null });
    }
  };

  return (
    <div>
      <LoadingModal isOpen={loading} />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-primary-dark">Quản lý sản phẩm</h2>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold">
          Tổng cộng: {pagination.total} sản phẩm
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-text-light text-[10px] uppercase tracking-wider">
            <tr>
              <th className="p-4 font-bold">Sản phẩm</th>
              <th className="p-4 font-bold">Danh mục</th>
              <th className="p-4 font-bold">Giá hiện tại</th>
              <th className="p-4 font-bold text-center">Trạng thái</th>
              <th className="p-4 font-bold text-center">Hợp lệ</th>
              <th className="p-4 text-center font-bold">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition">
                <td className="p-4 flex items-center gap-3">
                  <img src={p.thumbnail || (p.product_images?.[0]?.url) || '/placeholder.png'} alt="" className="w-10 h-10 rounded-lg object-cover shadow-sm" />
                  <div>
                    <span className="font-bold text-sm text-text-main line-clamp-1">{p.name}</span>
                    <p className="text-[10px] text-gray-400 font-mono">#{p.id}</p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-xs font-medium text-gray-600">{p.category?.name || 'Chưa phân loại'}</div>
                </td>
                <td className="p-4">
                  <div className="font-bold text-primary text-sm">{formatCurrency(p.current_price > 0 ? p.current_price : p.start_price)}</div>
                  {p.buy_now_price && (
                    <div className="text-[10px] text-gray-400">Mua ngay: {formatCurrency(p.buy_now_price)}</div>
                  )}
                </td>
                <td className="p-4 text-center">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                    p.status === 'SOLD' ? 'bg-blue-100 text-blue-700' :
                      p.status === 'EXPIRED' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                    }`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="text-[10px] text-gray-500 font-medium">
                    {p.view_count || 0} lượt xem
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-3">
                    <Link to={`/product/${p.id}`} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Xem chi tiết">
                      <FaExternalLinkAlt size={14} />
                    </Link>
                    <button
                      onClick={() => handleRemove(p.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Gỡ sản phẩm"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="p-12 text-center text-gray-400 font-medium italic">Không tìm thấy sản phẩm nào.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 bg-gray-50 border-t flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white text-text-light transition-colors"
            >
              <FaChevronLeft size={14} />
            </button>

            <div className="flex items-center gap-2">
              {generatePageNumbers().map((pageNum, index) => (
                <Fragment key={index}>
                  {pageNum === '...' ? (
                    <span className="px-3 py-1 text-gray-400 text-sm italic">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-[36px] h-9 rounded-lg font-bold text-sm transition-all ${pagination.page === pageNum
                          ? 'bg-primary text-white shadow-md shadow-primary/20'
                          : 'bg-white border border-gray-200 text-text-light hover:border-primary hover:text-primary'
                        }`}
                    >
                      {pageNum}
                    </button>
                  )}
                </Fragment>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white text-text-light transition-colors"
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Gỡ sản phẩm"
        message="Bạn có chắc chắn muốn gỡ sản phẩm này khỏi sàn? Hành động này không thể hoàn tác."
        confirmText="Xác nhận gỡ"
        variant="danger"
        onConfirm={confirmRemove}
        onCancel={() => setConfirmModal({ isOpen: false, productId: null })}
      />
    </div>
  );
};
export default ProductManagePage;