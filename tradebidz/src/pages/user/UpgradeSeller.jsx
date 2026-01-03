import { useEffect, useState } from 'react';
import { FaStore, FaCheckCircle, FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingModal from '../../components/common/LoadingModal';
import { requestUpgrade, getCurrentUser } from '../../services/userService';

const UpgradeSeller = () => {
  const [loading, setLoading] = useState(true);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const user = await getCurrentUser();
        // Backend returns { ...user, has_pending_upgrade_request: true/false }
        if (user.has_pending_upgrade_request) {
          setIsSent(true);
        }
      } catch (error) {
        console.error("Failed to check upgrade status", error);
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, []);

  const handleUpgradeRequest = async () => {
    setLoading(true);
    try {
      await requestUpgrade("I want to become a seller to sell my products.");
      setIsSent(true);
      toast.success("Gửi yêu cầu thành công! Vui lòng chờ admin phê duyệt.");
    } catch (error) {
      console.error("Upgrade request failed:", error);
      toast.error(error.response?.data?.message || "Gửi yêu cầu thất bại.");
      setLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <div className="bg-white max-w-lg mx-auto p-10 rounded-2xl shadow-lg border border-green-100">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-text-main mb-2">Yêu cầu đang chờ duyệt</h2>
          <p className="text-text-light mb-6">
            Yêu cầu nâng cấp thành Người bán của bạn đã được gửi đến Quản trị viên.
            Chúng tôi sẽ thông báo cho bạn qua email khi được duyệt (thường trong vòng 24 giờ).
          </p>
          <button className="px-6 py-2 bg-gray-100 text-text-main rounded-lg hover:bg-gray-200" disabled>
            Đã gửi yêu cầu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <LoadingModal isOpen={loading} text="Đang gửi yêu cầu..." />

      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-primary to-primary-light p-10 text-center text-white">
          <FaStore className="text-6xl mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl font-bold mb-2">Trở thành Người bán</h1>
          <p className="opacity-90">Chia sẻ sản phẩm của bạn với cộng đồng TradeBid ngay hôm nay</p>
        </div>

        {/* Content */}
        <div className="p-10">
          <h3 className="text-xl font-bold text-text-main mb-6">Tại sao nên nâng cấp?</h3>

          <ul className="space-y-4 mb-10">
            {[
              "Đăng bán không giới hạn sản phẩm.",
              "Thiết lập giá 'Mua ngay' để bán nhanh.",
              "Xem thống kê chi tiết và lịch sử đấu giá.",
              "Quản lý hồ sơ cửa hàng chuyên nghiệp.",
              "Được ưu tiên hỗ trợ từ đội ngũ của chúng tôi."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-text-light">
                <FaCheckCircle className="text-secondary mt-1 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mb-8 text-sm text-blue-800">
            <strong>Lưu ý:</strong> Yêu cầu của bạn sẽ có hiệu lực trong 7 ngày sau khi được duyệt.
            Bạn cần duy trì điểm đánh giá ít nhất 80% để giữ trạng thái Người bán.
          </div>

          <button
            onClick={handleUpgradeRequest}
            className="w-full py-4 bg-primary text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/30 transition-all flex justify-center items-center gap-2"
          >
            <FaPaperPlane /> Gửi yêu cầu nâng cấp
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeSeller;