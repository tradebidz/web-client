import { useState, useEffect } from 'react';
import { FaTrash, FaExternalLinkAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils/format';
import { Link } from 'react-router-dom';
import ConfirmModal from '../../components/common/ConfirmModal';
import { getProducts } from '../../services/productService';
import { deleteProduct } from '../../services/adminService';

const ProductManagePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, productId: null });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Using public list for now. Admin should ideally have a filtered list (inc. hidden/deleted) 
      // but public list is a good start.
      const data = await getProducts({}); // Empty query to get all (paged)
      // data might be { products: [], total: ... } or just [] depending on service impl
      console.log(data);
      setProducts(data.products || data.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Handle Remove Product [cite: 157]
  const handleRemove = (id) => {
    setConfirmModal({ isOpen: true, productId: id });
  };

  const confirmRemove = async () => {
    try {
      await deleteProduct(confirmModal.productId);
      toast.success("Product removed successfully.");
      fetchProducts(); // Refresh list
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to remove product");
    } finally {
      setConfirmModal({ isOpen: false, productId: null });
    }
  };

  if (loading) return <div className="flex justify-center p-8"><span className="loading loading-spinner text-primary"></span></div>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-primary-dark mb-6">Product Management</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-text-light text-xs uppercase">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Seller</th>
              <th className="p-4">Views</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="p-4 flex items-center gap-3">
                  <img src={p.thumbnail || (p.product_images?.[0]?.url) || '/placeholder.jpg'} alt="" className="w-10 h-10 rounded object-cover" />
                  <div>
                    <span className="font-medium line-clamp-1">{p.name}</span>
                    <p className="text-xs text-gray-400">ID: #{p.id}</p>
                  </div>
                </td>
                <td className="p-4 text-gray-500">{p.categories?.name || p.category_name || 'N/A'}</td>
                <td className="p-4">
                  <div className="font-bold text-primary">{formatCurrency(p.current_price || p.start_price)}</div>
                  {p.buy_now_price && (
                    <div className="text-xs text-gray-500">Buy Now: {formatCurrency(p.buy_now_price)}</div>
                  )}
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded font-bold ${p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      p.status === 'SOLD' ? 'bg-blue-100 text-blue-700' :
                        p.status === 'EXPIRED' ? 'bg-gray-100 text-gray-700' :
                          'bg-red-100 text-red-700'
                    }`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {/* Schema: users_products_seller_idTousers relation */}
                  <div>{p.users_products_seller_idTousers?.full_name || 'Unknown'}</div>
                  {p.users_products_seller_idTousers?.email && (
                    <div className="text-xs text-gray-400">{p.users_products_seller_idTousers.email}</div>
                  )}
                </td>
                <td className="p-4 text-sm text-gray-500">{p.view_count || 0}</td>
                <td className="p-4">
                  <div className="h-full flex items-center justify-center gap-3">
                    <Link to={`/product/${p.id}`} className="text-blue-500 hover:text-blue-700" title="View">
                      <FaExternalLinkAlt />
                    </Link>
                    <button
                      onClick={() => handleRemove(p.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove Product"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-400">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Remove Product"
        message="Are you sure you want to remove this product? This action cannot be undone."
        confirmText="Remove"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmRemove}
        onCancel={() => setConfirmModal({ isOpen: false, productId: null })}
      />
    </div>
  );
};
export default ProductManagePage;