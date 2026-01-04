import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaBoxOpen, FaClock, FaCheckCircle, FaTimesCircle, FaCreditCard, FaReceipt, FaCommentDots, FaArrowRight } from 'react-icons/fa';
import { getMyOrders } from '../../services/orderService';
import { rateSeller as rateTransaction } from '../../services/userService';
import { createPaymentUrl } from '../../services/paymentService';
import { formatCurrency, formatDate } from '../../utils/format';
import LoadingModal from '../../components/common/LoadingModal';
import RatingModal from '../../components/common/RatingModal';
import { toast } from 'react-toastify';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [ratingModal, setRatingModal] = useState({ isOpen: false, order: null });
    const currentUser = useSelector((state) => state.auth.user);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getMyOrders();
            setOrders(data || []);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            toast.error("Không thể tải lịch sử đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (orderId) => {
        try {
            setCheckoutLoading(true);
            const { url } = await createPaymentUrl(orderId);
            if (url) {
                window.location.href = url;
            } else {
                toast.error("Không thể tạo liên kết thanh toán");
            }
        } catch (error) {
            console.error("Payment failed:", error);
            toast.error(error.response?.data?.message || "Lỗi thanh toán");
        } finally {
            setCheckoutLoading(false);
        }
    };

    const handleRateSubmit = async ({ score, comment }) => {
        try {
            setCheckoutLoading(true);
            await rateTransaction({
                productId: ratingModal.order.product_id,
                score,
                comment
            });
            toast.success("Đánh giá giao dịch thành công!");
            setRatingModal({ isOpen: false, order: null });
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || "Đánh giá thất bại");
        } finally {
            setCheckoutLoading(false);
        }
    };

    const getStatusBadge = (status, type = 'order') => {
        const configs = {
            order: {
                PENDING: { color: 'bg-yellow-100 text-yellow-700', icon: <FaClock />, label: 'Chờ duyệt' },
                PAID: { color: 'bg-green-100 text-green-700', icon: <FaCheckCircle />, label: 'Đã thanh toán' },
                SHIPPED: { color: 'bg-blue-100 text-blue-700', icon: <FaBoxOpen />, label: 'Đang giao' },
                CANCELLED: { color: 'bg-red-100 text-red-700', icon: <FaTimesCircle />, label: 'Đã hủy' },
                default: { color: 'bg-gray-100 text-gray-700', icon: <FaClock />, label: status }
            },
            payment: {
                UNPAID: { color: 'bg-yellow-100 text-yellow-700', icon: <FaCreditCard />, label: 'Chưa thanh toán' },
                PAID: { color: 'bg-green-100 text-green-700', icon: <FaCheckCircle />, label: 'Đã thanh toán' },
                FAILED: { color: 'bg-red-100 text-red-700', icon: <FaTimesCircle />, label: 'Thanh toán lỗi' },
                default: { color: 'bg-gray-100 text-gray-700', icon: <FaCreditCard />, label: status }
            }
        };

        const config = configs[type][status] || configs[type].default;

        return (
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${config.color}`}>
                {config.icon} {config.label}
            </span>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <LoadingModal isOpen={loading || checkoutLoading} text={checkoutLoading ? "Đang xử lý thanh toán..." : "Đang tải đơn hàng..."} />

            <div className="flex items-center gap-4 mb-8 border-b pb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <FaReceipt className="text-3xl text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-text-main">Lịch sử đơn hàng</h1>
                    <p className="text-text-light">Quản lý tất cả các đơn hàng bạn đã mua hoặc bán.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {orders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-text-light text-[10px] uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="p-4">Đơn hàng / Sản phẩm</th>
                                    <th className="p-4">Ngày tạo</th>
                                    <th className="p-4">Vai trò</th>
                                    <th className="p-4">Người bán/mua</th>
                                    <th className="p-4">Tổng tiền</th>
                                    <th className="p-4">Trạng thái</th>
                                    <th className="p-4 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {orders.map((order) => {
                                    const isBuyer = order.buyer_id === currentUser?.id;
                                    const canPay = isBuyer && order.payment_status !== 'PAID' && order.status !== 'CANCELLED';
                                    const isRated = order.products?.feedbacks?.length > 0;
                                    const canRate = (order.payment_status === 'PAID' || order.status === 'CANCELLED') && !isRated;

                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={order.products?.product_images?.[0]?.url || '/placeholder.png'}
                                                        alt=""
                                                        className="w-12 h-12 rounded-lg object-cover border border-gray-100 shadow-sm"
                                                    />
                                                    <div>
                                                        <Link to={`/product/${order.products?.id}`} className="font-bold text-text-main hover:text-primary line-clamp-1">{order.products?.name}</Link>
                                                        <div className="text-[10px] text-gray-400 font-mono">#{order.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-500 font-medium">{formatDate(order.created_at)}</td>
                                            <td className="p-4">
                                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${isBuyer ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {isBuyer ? 'Người mua' : 'Người bán'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-600 font-medium">
                                                {isBuyer ? order.seller?.full_name : order.buyer?.full_name}
                                            </td>
                                            <td className="p-4 font-bold text-primary">{formatCurrency(order.amount)}</td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-1">
                                                    {order.status === 'PAID' && order.payment_status === 'PAID' ? (
                                                        getStatusBadge(order.status, 'order')
                                                    ) : (
                                                        <>
                                                            {getStatusBadge(order.status, 'order')}
                                                            {getStatusBadge(order.payment_status, 'payment')}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-center gap-2">
                                                    {/* <Link to={`/product/${order.product_id}`} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Xem sản phẩm">
                                                        <FaArrowRight size={14} />
                                                    </Link> */}
                                                    {canPay && (
                                                        <button
                                                            onClick={() => handlePayment(order.id)}
                                                            className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition shadow-sm"
                                                        >
                                                            Thanh toán
                                                        </button>
                                                    )}
                                                    {canRate && (
                                                        <button
                                                            onClick={() => setRatingModal({ isOpen: true, order })}
                                                            className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition shadow-sm flex items-center gap-1"
                                                        >
                                                            <FaCommentDots /> Đánh giá
                                                        </button>
                                                    )}
                                                    {isRated && (
                                                        <span className="flex items-center gap-1 text-green-500 text-[10px] font-bold italic">
                                                            <FaCheckCircle /> Đã đánh giá
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white">
                        <FaBoxOpen className="text-6xl text-gray-200 mb-4" />
                        <h3 className="text-lg font-bold text-gray-700">Chưa có đơn hàng nào</h3>
                        <p className="text-gray-400 text-sm mt-1">Các giao dịch thành công sẽ xuất hiện tại đây.</p>
                        <Link to="/products" className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-bold shadow-lg shadow-primary/30">
                            Khám phá ngay
                        </Link>
                    </div>
                )}
            </div>

            {/* Shared Rating Modal */}
            <RatingModal
                isOpen={ratingModal.isOpen}
                onClose={() => setRatingModal({ isOpen: false, order: null })}
                onSubmit={handleRateSubmit}
                targetName={
                    ratingModal.order?.buyer_id === currentUser?.id
                        ? ratingModal.order?.seller?.full_name
                        : ratingModal.order?.buyer?.full_name
                }
            />
        </div>
    );
};

export default OrderHistory;
