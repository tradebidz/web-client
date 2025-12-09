import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingModal from '../../components/common/LoadingModal';
import { mockSellerProducts } from '../../utils/mockData';
import { formatCurrency, formatTimeLeft } from '../../utils/format';
import { FaBoxOpen, FaEdit, FaEye, FaGavel, FaPen } from 'react-icons/fa';
import { toast } from 'react-toastify';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'ended'

  useEffect(() => {
    setTimeout(() => {
      setProducts(mockSellerProducts);
      setLoading(false);
    }, 600);
  }, []);

  const filteredProducts = products.filter(p => p.status === activeTab);

  // Mock Action: Append Description
  const handleAppendDesc = (id) => {
    const newDesc = prompt("Enter additional description (will be appended):");
    if (newDesc) {
      toast.success("Description updated successfully!");
    }
  };

  return (
    <div className="container mx-auto">
      <LoadingModal isOpen={loading} text="Loading your store..." />

      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main flex items-center gap-3">
            <FaBoxOpen className="text-primary" /> My Products
          </h1>
          <p className="text-text-light mt-1">Manage your listings and orders.</p>
        </div>
        <Link to="/seller/post-product" className="px-6 py-2 bg-secondary text-white font-bold rounded-lg shadow hover:bg-yellow-600 transition">
          + Post New Product
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'active' ? 'border-primary text-primary' : 'border-transparent text-text-light hover:text-text-main'
          }`}
        >
          Active Auctions ({products.filter(p => p.status === 'active').length})
        </button>
        <button
          onClick={() => setActiveTab('ended')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'ended' ? 'border-primary text-primary' : 'border-transparent text-text-light hover:text-text-main'
          }`}
        >
          Sold / Ended ({products.filter(p => p.status === 'ended').length})
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-text-light text-xs uppercase font-semibold">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Price / Bids</th>
                  <th className="p-4">Highest Bidder / Winner</th>
                  <th className="p-4">Time</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredProducts.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover border" />
                        <div className="truncate">
                          <Link to={`/product/${item.id}`} className="font-medium text-text-main hover:text-primary block truncate">
                            {item.name}
                          </Link>
                          <span className="text-xs text-text-light">ID: #{item.id}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="font-bold text-primary">{formatCurrency(item.currentPrice)}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <FaGavel /> {item.bids} bids
                      </div>
                    </td>

                    <td className="p-4 text-gray-600">
                      {item.status === 'active' ? item.highestBidder : (
                        <span className="text-green-600 font-medium">🏆 {item.winner}</span>
                      )}
                    </td>

                    <td className="p-4 text-gray-500">
                      {item.status === 'active' ? formatTimeLeft(item.timeLeft) : 'Ended'}
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
                        
                        {item.status === 'active' && (
                          <button 
                            onClick={() => handleAppendDesc(item.id)}
                            className="p-2 text-gray-500 hover:text-secondary hover:bg-yellow-50 rounded transition"
                            title="Append Description"
                          >
                            <FaPen />
                          </button>
                        )}

                        {/* Note: "Kick Bidder" is typically handled in Product Detail view as per requirements */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            No products found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProducts;