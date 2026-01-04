import { useState } from 'react';
import { FaStar, FaThumbsUp, FaThumbsDown, FaTimes } from 'react-icons/fa';

const RatingModal = ({ isOpen, onClose, onSubmit, title = "Đánh giá giao dịch", targetName = "người dùng" }) => {
    const [score, setScore] = useState(1);
    const [comment, setComment] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit({ score, comment });
        // Reset state for next use
        setScore(1);
        setComment('');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <FaStar className="text-yellow-500" /> {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <FaTimes className="text-gray-400" />
                        </button>
                    </div>

                    <p className="text-gray-600 mb-6 text-sm">
                        Bạn đang đánh giá trải nghiệm giao dịch với <strong>{targetName}</strong>. Ý kiến của bạn sẽ giúp cộng đồng TradeBidz an toàn hơn.
                    </p>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">Bạn cảm thấy thế nào?</label>
                            <div className="flex gap-4">
                                <button
                                    className={`flex-1 py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${score === 1
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-500'
                                        }`}
                                    onClick={() => setScore(1)}
                                >
                                    <FaThumbsUp className="text-2xl" />
                                    <span className="text-xs font-bold uppercase">Tích cực (+1)</span>
                                </button>
                                <button
                                    className={`flex-1 py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${score === -1
                                            ? 'border-red-500 bg-red-50 text-red-700'
                                            : 'border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-500'
                                        }`}
                                    onClick={() => setScore(-1)}
                                >
                                    <FaThumbsDown className="text-2xl" />
                                    <span className="text-xs font-bold uppercase">Tiêu cực (-1)</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">Nhận xét chi tiết</label>
                            <textarea
                                className="w-full border-2 border-gray-100 rounded-2xl p-4 text-sm focus:ring-primary focus:border-primary transition-all min-h-[120px] resize-none"
                                placeholder="Mô tả trải nghiệm của bạn (ví dụ: Giao hàng nhanh, sản phẩm đúng mô tả, hoặc lý do bạn không hài lòng...)"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Bỏ qua
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!comment.trim()}
                            className="flex-1 px-4 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            Gửi đánh giá
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RatingModal;
