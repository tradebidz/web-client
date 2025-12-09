import { useState } from 'react';
import { FaTrash, FaExternalLinkAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { mockProducts } from '../../utils/mockData';
import { formatCurrency } from '../../utils/format';
import { Link } from 'react-router-dom';
import ConfirmModal from '../../components/common/ConfirmModal';

const ProductManagePage = () => {
  const [products, setProducts] = useState(mockProducts);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, productId: null });

  // Handle Remove Product [cite: 157]
  const handleRemove = (id) => {
    setConfirmModal({ isOpen: true, productId: id });
  };

  const confirmRemove = () => {
    setProducts(products.filter(p => p.id !== confirmModal.productId));
    toast.success("Product removed successfully.");
    setConfirmModal({ isOpen: false, productId: null });
  };

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
                  <img src={p.image || p.thumbnail} alt="" className="w-10 h-10 rounded object-cover" />
                  <div>
                    <span className="font-medium line-clamp-1">{p.name}</span>
                    <p className="text-xs text-gray-400">ID: #{p.id}</p>
                  </div>
                </td>
                <td className="p-4 text-gray-500">{p.category?.name || 'N/A'}</td>
                <td className="p-4">
                  <div className="font-bold text-primary">{formatCurrency(p.currentPrice || p.price)}</div>
                  {p.buyNowPrice && (
                    <div className="text-xs text-gray-500">Buy Now: {formatCurrency(p.buyNowPrice)}</div>
                  )}
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded font-bold ${
                    p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                    p.status === 'SOLD' ? 'bg-blue-100 text-blue-700' :
                    p.status === 'EXPIRED' ? 'bg-gray-100 text-gray-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  <div>{p.seller?.fullName || p.seller?.name || 'Unknown'}</div>
                  {p.seller?.email && (
                    <div className="text-xs text-gray-400">{p.seller.email}</div>
                  )}
                </td>
                <td className="p-4 text-sm text-gray-500">{p.viewCount || 0}</td>
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