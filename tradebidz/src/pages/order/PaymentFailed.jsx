import { useSearchParams, Link } from 'react-router-dom';
import { FaTimesCircle, FaRedo, FaExclamationTriangle } from 'react-icons/fa';

const PaymentFailed = () => {
    const [searchParams] = useSearchParams();
    const reason = searchParams.get('reason');

    const getReasonMessage = (reason) => {
        switch (reason) {
            case 'checksum_invalid':
                return 'Mã xác thực không hợp lệ. Vui lòng thử lại.';
            case 'order_not_found':
                return 'Không tìm thấy thông tin đơn hàng.';
            case 'amount_mismatch':
                return 'Số tiền thanh toán không khớp với đơn hàng.';
            case 'user_cancelled':
                return 'Giao dịch đã bị hủy bởi người dùng.';
            default:
                if (reason?.startsWith('code_')) {
                    return `Giao dịch thất bại (Mã lỗi: ${reason.split('_')[1]}).`;
                }
                return 'Đã có lỗi xảy ra trong quá trình thanh toán.';
        }
    };

    return (
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-lg w-full text-center fade-in">
                <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaTimesCircle size={48} />
                </div>

                <h1 className="text-3xl font-bold text-text-main mb-2">Thanh toán thất bại</h1>
                <div className="flex items-center justify-center gap-2 text-red-600 bg-red-50 py-2 px-4 rounded-lg mb-8 mx-auto w-fit">
                    <FaExclamationTriangle size={14} />
                    <span className="text-sm font-medium">{getReasonMessage(reason)}</span>
                </div>

                <p className="text-text-light mb-8">
                    Đừng lo lắng, tiền của bạn vẫn chưa bị trừ. Bạn có thể thử thanh toán lại từ trang lịch sử đơn hàng hoặc sản phẩm đã thắng.
                </p>

                <div className="grid grid-cols-1 gap-3">
                    <Link
                        to="/won-products"
                        className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark transition flex items-center justify-center gap-2"
                    >
                        <FaRedo /> Thử lại ngay
                    </Link>
                    <Link
                        to="/orders"
                        className="w-full py-3 bg-white border border-gray-200 text-text-light font-bold rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2"
                    >
                        Quay lại trang Đơn hàng
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;
