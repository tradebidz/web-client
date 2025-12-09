import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingModal from '../../components/common/LoadingModal';
import { mockMyBids } from '../../utils/mockData';
import { formatCurrency, formatTimeLeft } from '../../utils/format';
import { FaGavel, FaCheckCircle, FaExclamationCircle, FaExternalLinkAlt } from 'react-icons/fa';

const MyBidding = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setBids(mockMyBids);
      setLoading(false);
    }, 600);
  }, []);

  return (
    <div className="container mx-auto">
      <LoadingModal isOpen={loading} text="Loading your bids..." />

      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-text-main flex items-center gap-3">
          <FaGavel className="text-primary" /> My Bidding
        </h1>
        <p className="text-text-light mt-2">
          Products you are currently bidding on.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {bids.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-text-light text-xs uppercase font-semibold">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">My Max Bid</th>
                  <th className="p-4">Current Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Time Left</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {bids.map((bid) => (
                  <tr key={bid.id} className="hover:bg-blue-50/30 transition-colors">
                    {/* Product Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={bid.image} 
                          alt={bid.productName} 
                          className="w-12 h-12 rounded object-cover border border-gray-200" 
                        />
                        <div>
                          <Link to={`/product/${bid.productId}`} className="font-medium text-text-main hover:text-primary line-clamp-1">
                            {bid.productName}
                          </Link>
                          <span className="text-xs text-text-light">Seller: {bid.seller}</span>
                        </div>
                      </div>
                    </td>

                    {/* My Bid */}
                    <td className="p-4 font-medium text-gray-600">
                      {formatCurrency(bid.myBid)}
                    </td>

                    {/* Current Price */}
                    <td className="p-4 font-bold text-primary">
                      {formatCurrency(bid.currentPrice)}
                    </td>

                    {/* Status [cite: 88, 101] */}
                    <td className="p-4">
                      {bid.isWinning ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                          <FaCheckCircle /> Leading
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold animate-pulse">
                          <FaExclamationCircle /> Outbid
                        </span>
                      )}
                    </td>

                    {/* Time Left */}
                    <td className="p-4 text-gray-500">
                      {formatTimeLeft(bid.endTime)}
                    </td>

                    {/* Action */}
                    <td className="p-4 text-center">
                      <Link 
                        to={`/product/${bid.productId}`}
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                          bid.isWinning 
                            ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' 
                            : 'bg-primary text-white hover:bg-primary-dark shadow-md shadow-primary/30'
                        }`}
                        title="View Details"
                      >
                        <FaExternalLinkAlt className="text-xs" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <FaGavel className="mx-auto text-4xl text-gray-200 mb-4" />
            <p className="text-gray-500">You haven't placed any bids yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBidding;