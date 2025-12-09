import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingModal from '../../components/common/LoadingModal';
import { mockWonProducts } from '../../utils/mockData';
import { formatCurrency } from '../../utils/format';
import { FaTrophy, FaTruck, FaCheckCircle, FaCommentDots, FaMoneyBillWave } from 'react-icons/fa';

const WonProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProducts(mockWonProducts);
      setLoading(false);
    }, 600);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ready_to_checkout':
        return <span className="badge bg-yellow-100 text-yellow-800 flex items-center gap-1"><FaMoneyBillWave /> Unpaid</span>;
      case 'paid':
        return <span className="badge bg-blue-100 text-blue-800 flex items-center gap-1"><FaTruck /> Shipping</span>;
      case 'completed':
        return <span className="badge bg-green-100 text-green-800 flex items-center gap-1"><FaCheckCircle /> Completed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto">
      <LoadingModal isOpen={loading} text="Loading won items..." />

      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-text-main flex items-center gap-3">
          <FaTrophy className="text-yellow-500" /> Won Auctions
        </h1>
        <p className="text-text-light mt-2">Congratulations! Here are the items you have won.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-text-light text-xs uppercase font-semibold">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Winning Price</th>
                  <th className="p-4">Seller</th>
                  <th className="p-4">Ended Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {products.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover border" />
                        <Link to={`/product/${item.id}`} className="font-medium text-text-main hover:text-primary">
                          {item.name}
                        </Link>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-primary">{formatCurrency(item.finalPrice)}</td>
                    <td className="p-4 text-gray-600">{item.seller}</td>
                    <td className="p-4 text-gray-500">{new Date(item.endedAt).toLocaleDateString()}</td>
                    <td className="p-4">{getStatusBadge(item.status)}</td>
                    <td className="p-4 text-right">
                      {item.status === 'ready_to_checkout' && (
                        <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-md transition">
                          Checkout Now
                        </button>
                      )}
                      {item.status === 'completed' && (
                        <button className="px-3 py-2 border border-gray-300 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 flex items-center gap-1 ml-auto">
                          <FaCommentDots /> Rate Seller
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            You haven't won any auctions yet. Good luck!
          </div>
        )}
      </div>
    </div>
  );
};

export default WonProducts;