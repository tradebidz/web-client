import { useState } from 'react';
import { FaStore, FaCheckCircle, FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingModal from '../../components/common/LoadingModal';

const UpgradeSeller = () => {
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleUpgradeRequest = () => {
    setLoading(true);
    // Mock API call to Admin
    setTimeout(() => {
      setLoading(false);
      setIsSent(true);
      toast.success("Request sent successfully! Please wait for admin approval.");
    }, 1500);
  };

  if (isSent) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <div className="bg-white max-w-lg mx-auto p-10 rounded-2xl shadow-lg border border-green-100">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-text-main mb-2">Request Pending</h2>
            <p className="text-text-light mb-6">
                Your request to become a Seller has been sent to the Administrator. 
                We will notify you via email once it is approved (usually within 24 hours).
            </p>
            <button className="px-6 py-2 bg-gray-100 text-text-main rounded-lg hover:bg-gray-200" disabled>
                Request Sent
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <LoadingModal isOpen={loading} text="Sending request..." />

      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-primary to-primary-light p-10 text-center text-white">
          <FaStore className="text-6xl mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl font-bold mb-2">Become a Seller</h1>
          <p className="opacity-90">Unlock the potential to sell your products on TradeBid</p>
        </div>

        {/* Content */}
        <div className="p-10">
          <h3 className="text-xl font-bold text-text-main mb-6">Why upgrade to Seller?</h3>
          
          <ul className="space-y-4 mb-10">
            {[
              "Post unlimited products for auction.",
              "Set 'Buy Now' prices for quick sales.",
              "Access detailed analytics and bidding history.",
              "Manage your own store profile.",
              "Priority support from our team."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-text-light">
                <FaCheckCircle className="text-secondary mt-1 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mb-8 text-sm text-blue-800">
            <strong>Note:</strong> Your request will be valid for 7 days upon approval. 
            You must maintain a rating of at least 80% to keep your Seller status.
          </div>

          <button 
            onClick={handleUpgradeRequest}
            className="w-full py-4 bg-primary text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/30 transition-all flex justify-center items-center gap-2"
          >
            <FaPaperPlane /> Send Upgrade Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeSeller;