import { useState } from 'react';
import { FaTrash, FaExternalLinkAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { mockProducts } from '../../utils/mockData';
import { formatCurrency } from '../../utils/format';
import { Link } from 'react-router-dom';

const ProductManagePage = () => {
  const [products, setProducts] = useState(mockProducts);

  // Handle Remove Product [cite: 157]
  const handleRemove = (id) => {
    if (window.confirm("Are you sure you want to remove this product? This action cannot be undone.")) {
      setProducts(products.filter(p => p.id !== id));
      toast.success("Product removed successfully.");
    }
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
              <th className="p-4">Seller</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="p-4 flex items-center gap-3">
                  <img src={p.image} alt="" className="w-10 h-10 rounded object-cover" />
                  <span className="font-medium line-clamp-1">{p.name}</span>
                </td>
                <td className="p-4 text-gray-500">{p.category}</td>
                <td className="p-4 font-bold text-primary">{formatCurrency(p.price)}</td>
                <td className="p-4 text-sm text-gray-600">Unknown (Mock)</td>
                <td className="p-4 flex justify-center gap-3">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagePage;