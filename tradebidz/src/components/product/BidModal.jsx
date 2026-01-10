import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaGavel, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { placeBid } from '../../services/biddingService';
import { validateBidEligibility, getSuggestedPrice } from '../../services/productService';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils/format';
import { useSelector } from 'react-redux';

const BidModal = ({ isOpen, onClose, product }) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();

  const [step, setStep] = useState('INPUT');
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [eligibility, setEligibility] = useState(null);
  const [suggestedPrice, setSuggestedPrice] = useState(null);

  const user = useSelector((state) => state.auth.user);

  const isAutoBid = watch('isAutoBid');

  useEffect(() => {
    if (isOpen && product?.id) {
      checkEligibility();
      fetchSuggestedPrice();
      setStep('INPUT');
      setFormData(null);
    }
  }, [isOpen, product?.id]);

  const checkEligibility = async () => {
    if (!product?.id) return;
    setCheckingEligibility(true);
    try {
      const result = await validateBidEligibility(product.id);
      setEligibility(result);
    } catch (error) {
      console.error('Lỗi kiểm tra điều kiện:', error);
      toast.error('Không thể kiểm tra điều kiện đấu giá');
    } finally {
      setCheckingEligibility(false);
    }
  };

  const fetchSuggestedPrice = async () => {
    if (!product?.id) return;
    try {
      const result = await getSuggestedPrice(product.id);
      const price = result.suggestedPrice || result.suggested_price;
      setSuggestedPrice(price);
      if (price) {
        setValue('amount', price);
      }
    } catch (error) {
      console.error('Lỗi lấy giá gợi ý:', error);
    }
  };

  const onNextStep = (data) => {
    if (!product?.id) return;
    if (data.isAutoBid && (!data.maxAmount || parseFloat(data.maxAmount) <= parseFloat(data.amount))) {
      toast.error('Giá tối đa phải lớn hơn giá đấu khi bật tự động');
      return;
    }
    setFormData(data);
    setStep('CONFIRM');
  };

  const handleConfirmBid = async () => {
    if (!formData || !product?.id) return;
    setLoading(true);
    try {
      if (product?.status !== 'ACTIVE') {
        toast.error('Sản phẩm đã kết thúc đấu giá');
        onClose();
        return;
      }

      await placeBid({
        productId: product.id,
        amount: parseFloat(formData.amount),
        isAutoBid: formData.isAutoBid || false,
        maxAmount: formData.maxAmount ? parseFloat(formData.maxAmount) : null,
      });
      toast.success('Đặt giá thành công!');
      onClose();
    } catch (error) {
      console.error("Bid error:", error);
      let message = 'Đặt giá thất bại';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          message = error.response.data;
        } else if (error.response.data.message) {
          message = error.response.data.message;
        } else if (error.response.data.error) {
          message = error.response.data.error;
        }
      } else if (error.message) {
        message = error.message;
      }

      toast.error(message);

      // If product status might be outdated
      if (error.response?.status === 400 && (message.includes('ended') || message.includes('expired') || message.includes('closed'))) {
        onClose();
        // Trigger a reload of the page or just let the user know
        setTimeout(() => window.location.reload(), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentPrice = parseFloat(product?.current_price || product?.start_price || 0);
  const stepPrice = parseFloat(product?.step_price || 0);
  const minBidAmount = currentPrice + stepPrice;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <FaGavel className="text-primary" />
            {step === 'CONFIRM' ? 'Xác nhận đấu giá' : 'Đặt giá của bạn'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <FaTimes className="text-xl" />
          </button>
        </div>

        {step === 'INPUT' ? (
          <form onSubmit={handleSubmit(onNextStep)} className="p-6 space-y-4">
            {/* Thông tin sản phẩm */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1 tracking-wider">Sản phẩm</p>
              <p className="font-semibold text-text-main mb-3 leading-snug">{product?.name}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-xs">Giá hiện tại</span>
                  <span className="font-bold text-text-main">{formatCurrency(currentPrice)}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-gray-500 text-xs">Giá tối thiểu kế tiếp</span>
                  <span className="font-bold text-red-600">{formatCurrency(minBidAmount)}</span>
                </div>
              </div>
            </div>

            {/* Kiểm tra điều kiện */}
            {checkingEligibility ? (
              <div className="flex items-center gap-2 text-sm text-blue-600 animate-pulse">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
                Đang kiểm tra điều kiện tham gia...
              </div>
            ) : eligibility && !eligibility.eligible ? (
              <div className="bg-red-50 p-3 rounded-lg text-sm text-red-700 border border-red-100 flex items-start gap-2">
                <FaInfoCircle className="mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold">Không đủ điều kiện</p>
                  <p>{eligibility.message}</p>
                </div>
              </div>
            ) : eligibility && eligibility.eligible && (
              <div className="bg-green-50 p-3 rounded-lg text-sm text-green-700 border border-green-100 flex items-center gap-2">
                <FaInfoCircle />
                <p>Bạn đủ điều kiện tham gia đấu giá này.</p>
              </div>
            )}

            {/* Giá gợi ý */}
            {suggestedPrice && (
              <button
                type="button"
                onClick={() => setValue('amount', suggestedPrice)}
                className="w-full bg-primary/5 hover:bg-primary/10 p-3 rounded-lg text-sm border border-primary/20 transition text-left"
              >
                <p className="text-primary font-bold mb-1">💡 Giá gợi ý cho bạn</p>
                <p className="text-text-main font-semibold">{formatCurrency(suggestedPrice)} <span className="text-xs font-normal text-gray-500">(Click để áp dụng)</span></p>
              </button>
            )}

            {/* Nhập giá đấu */}
            <div>
              <label className="block text-sm font-bold text-text-main mb-1">Số tiền muốn đấu (VNĐ) *</label>
              <input
                type="number"
                {...register('amount', {
                  required: 'Vui lòng nhập số tiền',
                  min: { value: minBidAmount, message: `Giá tối thiểu là ${formatCurrency(minBidAmount)}` }
                })}
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-bold text-lg text-primary"
                placeholder="0"
              />
              {errors.amount && <p className="text-red-500 text-xs mt-1 italic">{errors.amount.message}</p>}
            </div>

            {/* Tự động đấu giá */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isAutoBid" {...register('isAutoBid')} className="w-5 h-5 accent-primary" />
                <label htmlFor="isAutoBid" className="text-sm font-bold text-text-main cursor-pointer">
                  Kích hoạt Tự động đấu giá
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-8 italic">
                Hệ thống sẽ thay bạn đặt giá tối thiểu mỗi khi bị vượt mặt cho đến giới hạn này.
              </p>
            </div>

            {isAutoBid && (
              <div className="animate-fadeIn">
                <label className="block text-sm font-bold text-text-main mb-1">Giới hạn tối đa (VNĐ) *</label>
                <input
                  type="number"
                  {...register('maxAmount', {
                    required: isAutoBid ? 'Cần nhập giá tối đa' : false,
                    validate: (val) => parseFloat(val) > parseFloat(watch('amount')) || 'Phải lớn hơn giá đấu hiện tại'
                  })}
                  className="w-full p-3 rounded-xl border border-green-300 focus:ring-2 focus:ring-green-500 outline-none font-bold text-lg text-green-600 bg-green-50/30"
                  placeholder="0"
                />
                {errors.maxAmount && <p className="text-red-500 text-xs mt-1 italic">{errors.maxAmount.message}</p>}
              </div>
            )}

            {/* Cảnh báo điểm tín nhiệm */}
            {user && (user.ratingScore || rating_score || 0) < 80 && (
              <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-700 border border-yellow-200 flex items-start gap-2">
                <FaInfoCircle className="mt-1" />
                <p>Tín nhiệm của bạn: <b>{(user.ratingScore || rating_score || 0).toFixed(0)}%</b>. Hệ thống yêu cầu trên 80% để tham gia tự do.</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition">Đóng</button>
              <button
                type="submit"
                disabled={eligibility && !eligibility.eligible}
                className="flex-[2] py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary-dark transition disabled:opacity-50"
              >
                Tiếp tục
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <p className="font-bold flex items-center gap-2 mb-1"><FaInfoCircle /> Lưu ý quan trọng:</p>
              <p>Hành động đặt giá là một cam kết mua hàng. Bạn không thể hủy giá sau khi đã xác nhận.</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-dashed">
                <span className="text-gray-500 text-sm">Sản phẩm:</span>
                <span className="font-bold text-right max-w-[60%] truncate">{product?.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-dashed">
                <span className="text-gray-500 text-sm">Giá bạn đặt:</span>
                <span className="font-bold text-primary text-xl">{formatCurrency(parseFloat(formData.amount))}</span>
              </div>
              {formData.isAutoBid && (
                <div className="flex justify-between items-center py-2 border-b border-dashed">
                  <span className="text-gray-500 text-sm">Tự động tối đa:</span>
                  <span className="font-bold text-green-600">{formatCurrency(parseFloat(formData.maxAmount))}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('INPUT')}
                disabled={loading}
                className="flex-1 py-3 font-bold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Quay lại
              </button>
              <button
                onClick={handleConfirmBid}
                disabled={loading}
                className="flex-[2] py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary-dark flex items-center justify-center gap-2"
              >
                {loading ? "Đang xử lý..." : "Xác nhận đặt giá"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BidModal;