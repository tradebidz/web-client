import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaArrowRight, FaReceipt } from 'react-icons/fa';
import { getOrder } from '../../services/orderService';
import { formatCurrency } from '../../utils/format';
import LoadingModal from '../../components/common/LoadingModal';

const PaymentSuccess = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await getOrder(id);
                setOrder(data);
            } catch (error) {
                console.error("Failed to fetch order:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return <LoadingModal isOpen={true} text="Đang tải thông tin đơn hàng..." />;

    return (
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-lg w-full text-center fade-in">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaCheckCircle size={48} />
                </div>

                <h1 className="text-3xl font-bold text-text-main mb-2">Thanh toán thành công!</h1>
                <p className="text-text-light mb-8">Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.</p>

                {order && (
                    <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                            <span className="text-sm text-gray-500 font-medium">Mã đơn hàng:</span>
                            <span className="font-bold text-text-main">#{order.id}</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Sản phẩm:</span>
                                <span className="text-sm font-semibold text-text-main line-clamp-1 max-w-[200px]">{order.products?.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Tổng tiền:</span>
                                <span className="text-lg font-bold text-primary">{formatCurrency(order.amount)}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                    <Link
                        to="/orders"
                        className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark transition flex items-center justify-center gap-2"
                    >
                        <FaReceipt /> Lịch sử đơn hàng
                    </Link>
                    <Link
                        to="/products"
                        className="w-full py-3 bg-white border border-gray-200 text-text-light font-bold rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2"
                    >
                        Tiếp tục mua sắm <FaArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
