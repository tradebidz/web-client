import { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimes, FaCloudUploadAlt, FaTruck, FaFileInvoice, FaMapMarkerAlt } from 'react-icons/fa';
import { uploadImage } from '../../services/mediaService';
import { uploadPaymentReceipt, uploadShippingTracking } from '../../services/orderService';
import { toast } from 'react-toastify';
import LoadingModal from '../common/LoadingModal';

const OrderCompletionWizard = ({ isOpen, onClose, order, userRole, onUpdate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Step 1: Payment Receipt (Buyer)
  const [paymentReceiptFile, setPaymentReceiptFile] = useState(null);
  const [paymentReceiptPreview, setPaymentReceiptPreview] = useState(null);
  const [paymentReceiptUrl, setPaymentReceiptUrl] = useState(order?.payment_receipt_url || null);
  const [shippingAddress, setShippingAddress] = useState(order?.shipping_address || '');

  // Step 2: Shipping Tracking (Seller)
  const [shippingTrackingCode, setShippingTrackingCode] = useState(order?.shipping_tracking_code || '');
  const [shippingCompany, setShippingCompany] = useState(order?.shipping_company || '');
  const [shippingTrackingUrl, setShippingTrackingUrl] = useState(order?.shipping_tracking_url || null);
  const [shippingTrackingFile, setShippingTrackingFile] = useState(null);
  const [shippingTrackingPreview, setShippingTrackingPreview] = useState(null);

  const isBuyer = userRole === 'BUYER' || (order?.currentUser && order?.buyer_id === order?.currentUser?.id);
  const isSeller = !isBuyer;

  // Check if all steps are completed (view mode)
  const isCompleted = order?.payment_receipt_url && order?.shipping_tracking_code;

  // Reset state when order changes
  useEffect(() => {
    if (order) {
      setPaymentReceiptUrl(order.payment_receipt_url || null);
      setShippingTrackingCode(order.shipping_tracking_code || '');
      setShippingCompany(order.shipping_company || '');
      setShippingTrackingUrl(order.shipping_tracking_url || null);
      setShippingAddress(order.shipping_address || ''); // Ensure address is synced

      // If completed, show tracking view (step 2 for both)
      if (isCompleted) {
        setCurrentStep(2);
      } else if (isBuyer && !order.payment_receipt_url) {
        setCurrentStep(1);
      } else if (isSeller && order.payment_receipt_url && !order.shipping_tracking_code) {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
    }
  }, [order, isBuyer, isCompleted]);

  if (!isOpen || !order) return null;

  // ... (Keep existing handlers: handlePaymentReceiptChange, handleShippingTrackingFileChange) ...
  const handlePaymentReceiptChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 5MB');
        return;
      }
      setPaymentReceiptFile(file);
      setPaymentReceiptPreview(URL.createObjectURL(file));
    }
  };

  const handleShippingTrackingFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 5MB');
        return;
      }
      setShippingTrackingFile(file);
      setShippingTrackingPreview(URL.createObjectURL(file));
    }
  };

  // ... (Keep existing submit handlers: handleSubmitPaymentReceipt, handleSubmitShippingTracking) ...
  const handleSubmitPaymentReceipt = async () => {
    if (!paymentReceiptFile && !paymentReceiptUrl) {
      toast.error('Vui lòng chọn hóa đơn chuyển tiền');
      return;
    }

    if (!shippingAddress.trim()) {
      toast.error('Vui lòng nhập địa chỉ giao hàng');
      return;
    }

    setLoading(true);
    setUploading(true);

    try {
      let receiptUrl = paymentReceiptUrl;
      if (paymentReceiptFile) {
        const uploadResponse = await uploadImage(paymentReceiptFile);
        receiptUrl = uploadResponse.url || uploadResponse.data?.url || uploadResponse;
      }

      await uploadPaymentReceipt(order.id, receiptUrl, shippingAddress);
      toast.success('Đã đăng hóa đơn chuyển tiền thành công!');
      setPaymentReceiptUrl(receiptUrl);
      setPaymentReceiptFile(null);
      setPaymentReceiptPreview(null);
      if (onUpdate) await onUpdate();
      onClose();
    } catch (error) {
      console.error('Error uploading payment receipt:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi đăng hóa đơn chuyển tiền');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleSubmitShippingTracking = async () => {
    if (!shippingTrackingCode.trim()) {
      toast.error('Vui lòng nhập mã vận đơn');
      return;
    }

    setLoading(true);
    setUploading(true);

    try {
      let trackingUrl = shippingTrackingUrl;
      if (shippingTrackingFile) {
        const uploadResponse = await uploadImage(shippingTrackingFile);
        trackingUrl = uploadResponse.url || uploadResponse.data?.url || uploadResponse;
      }

      await uploadShippingTracking(order.id, {
        trackingCode: shippingTrackingCode,
        company: shippingCompany,
        trackingUrl: trackingUrl
      });

      toast.success('Đã đăng vận đơn thành công!');
      if (onUpdate) await onUpdate();
      onClose();
    } catch (error) {
      console.error('Error uploading shipping tracking:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi đăng vận đơn');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const steps = [
    {
      id: 1,
      title: 'Đăng hóa đơn chuyển tiền',
      description: 'Người mua đăng hóa đơn chuyển tiền',
      icon: <FaFileInvoice />,
      canAccess: isBuyer || (order.payment_receipt_url && isSeller),
      completed: !!order.payment_receipt_url
    },
    {
      id: 2,
      title: 'Đăng vận đơn',
      description: 'Người bán đăng vận đơn',
      icon: <FaTruck />,
      canAccess: (isSeller && order.payment_receipt_url) || (order.shipping_tracking_code && isBuyer),
      completed: !!order.shipping_tracking_code
    }
  ];

  return (
    <>
      <LoadingModal isOpen={loading || uploading} text={uploading ? "Đang tải file lên..." : "Đang xử lý..."} />

      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 fade-in"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl fade-in m-4">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold text-text-main">Hoàn Tất Đơn Hàng</h2>
              <p className="text-sm text-text-light mt-1">Đơn hàng #{order.id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              aria-label="Close"
            >
              <FaTimes />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all ${step.completed
                          ? 'bg-green-500 text-white'
                          : currentStep === step.id
                            ? 'bg-primary text-white'
                            : step.canAccess
                              ? 'bg-gray-200 text-gray-500'
                              : 'bg-gray-100 text-gray-400'
                        }`}
                    >
                      {step.completed ? <FaCheckCircle /> : step.icon}
                    </div>
                    <div className="mt-2 text-center">
                      <p className={`text-xs font-bold ${step.completed || currentStep === step.id ? 'text-primary' : 'text-gray-400'}`}>
                        {step.title}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 rounded ${step.completed ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Step 1: Payment Receipt */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-text-main mb-2 flex items-center gap-2">
                    <FaFileInvoice className="text-primary" />
                    Đăng hóa đơn chuyển tiền
                  </h3>
                  <p className="text-text-light text-sm">
                    Vui lòng upload hóa đơn/chứng từ chuyển khoản để người bán xác nhận thanh toán
                  </p>
                </div>

                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors">
                  {paymentReceiptPreview || paymentReceiptUrl ? (
                    <div className="space-y-4">
                      <img
                        src={paymentReceiptPreview || paymentReceiptUrl}
                        alt="Payment Receipt"
                        className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                      />
                      <div className="flex gap-2 justify-center">
                        {/* Chỉ hiện nút upload/xóa cho Buyer và khi chưa có url hoặc đang edit */}
                        {isBuyer && (!order.payment_receipt_url || paymentReceiptFile) && (
                          <>
                             <label className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark cursor-pointer transition font-medium">
                              <FaCloudUploadAlt className="inline mr-2" />
                              Chọn ảnh khác
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePaymentReceiptChange}
                              />
                            </label>
                            {(paymentReceiptFile || paymentReceiptUrl) && (
                              <button
                                onClick={() => {
                                  setPaymentReceiptFile(null);
                                  setPaymentReceiptPreview(null);
                                  if (!paymentReceiptUrl) setPaymentReceiptPreview(null);
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                              >
                                <FaTimes className="inline mr-2" />
                                Xóa
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <label className={`cursor-pointer ${!isBuyer ? 'pointer-events-none opacity-50' : ''}`}>
                      <FaCloudUploadAlt className="text-5xl text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        {isBuyer ? 'Chọn hóa đơn chuyển tiền' : 'Người mua chưa đăng hóa đơn'}
                      </p>
                      {isBuyer && <p className="text-sm text-gray-500">JPG, PNG tối đa 5MB</p>}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePaymentReceiptChange}
                        disabled={!isBuyer}
                      />
                    </label>
                  )}
                </div>

                {/* CHANGE 1: Shipping Address Field 
                  - Hiển thị nếu là Buyer HOẶC nếu đã có địa chỉ (cho Seller xem)
                  - Disabled nếu không phải Buyer HOẶC đã có hóa đơn
                */}
                {(isBuyer || shippingAddress) && (
                  <div>
                    <label className="block text-sm font-bold text-text-main mb-2">
                      <FaMapMarkerAlt className="inline mr-2 text-primary" />
                      Địa chỉ giao hàng {isBuyer && !order.payment_receipt_url && <span className="text-red-500">*</span>}
                    </label>
                    <textarea
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder={isBuyer ? "Nhập địa chỉ nhận hàng đầy đủ..." : "Người mua chưa cập nhật địa chỉ"}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none ${
                        (!isBuyer || !!order.payment_receipt_url) ? 'bg-gray-100 text-gray-600' : 'bg-white'
                      }`}
                      rows={3}
                      disabled={!isBuyer || !!order.payment_receipt_url}
                    />
                    {isBuyer && !shippingAddress.trim() && !order.payment_receipt_url && (
                      <p className="text-xs text-gray-500 mt-1">Địa chỉ này sẽ được gửi cho người bán để giao hàng</p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition font-medium"
                    disabled={loading}
                  >
                    Hủy
                  </button>
                  {isBuyer && (
                    <button
                      onClick={handleSubmitPaymentReceipt}
                      disabled={loading || (!paymentReceiptFile && !paymentReceiptUrl) || !shippingAddress.trim()}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Xác nhận
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Shipping Tracking */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-text-main mb-2 flex items-center gap-2">
                    <FaTruck className="text-primary" />
                    {isCompleted ? 'Theo dõi vận đơn' : 'Đăng vận đơn'}
                  </h3>
                  <p className="text-text-light text-sm">
                    {isCompleted
                      ? 'Thông tin vận đơn và thanh toán'
                      : 'Vui lòng nhập thông tin vận đơn để người mua có thể tracking đơn hàng'}
                  </p>
                </div>

                {/* Payment Receipt Info (Read-only) */}
                {order.payment_receipt_url && (isCompleted || isSeller) && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FaCheckCircle className="text-green-500" />
                      <span className="font-medium text-green-700">Hóa đơn chuyển tiền</span>
                    </div>
                    <img
                      src={order.payment_receipt_url}
                      alt="Payment Receipt"
                      className="max-w-full max-h-64 rounded-lg shadow-sm"
                    />
                  </div>
                )}
                
                {/* CHANGE 2: Shipping Address Display in Step 2 
                  - Hiển thị cho cả Seller (để biết đường ship) và Buyer (để check lại)
                  - Dạng read-only
                */}
                {shippingAddress && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                     <div className="flex items-center gap-2 mb-2">
                      <FaMapMarkerAlt className="text-primary" />
                      <span className="font-medium text-gray-700">Địa chỉ giao hàng</span>
                    </div>
                    <p className="text-gray-600 whitespace-pre-wrap text-sm">{shippingAddress}</p>
                  </div>
                )}

                {/* Shipping Tracking Info */}
                {(order.shipping_tracking_code || isSeller) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FaTruck className="text-blue-500" />
                      <span className="font-medium text-blue-700">Thông tin vận đơn</span>
                    </div>

                    {/* Shipping Form - Only editable for seller when not completed */}
                    {!isCompleted && isSeller ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-text-main mb-2">
                            Mã vận đơn <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={shippingTrackingCode}
                            onChange={(e) => setShippingTrackingCode(e.target.value)}
                            placeholder="Nhập mã vận đơn"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-text-main mb-2">
                            Đơn vị vận chuyển
                          </label>
                          <input
                            type="text"
                            value={shippingCompany}
                            onChange={(e) => setShippingCompany(e.target.value)}
                            placeholder="Ví dụ: Viettel Post, Giao Hàng Nhanh, ..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-text-main mb-2">
                            Ảnh vận đơn (tùy chọn)
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors bg-white">
                            {shippingTrackingPreview || shippingTrackingUrl ? (
                              <div className="space-y-4">
                                <img
                                  src={shippingTrackingPreview || shippingTrackingUrl}
                                  alt="Shipping Tracking"
                                  className="max-w-full max-h-48 mx-auto rounded-lg shadow-sm"
                                />
                                <div className="flex gap-2 justify-center">
                                  <label className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark cursor-pointer transition font-medium">
                                    <FaCloudUploadAlt className="inline mr-2" />
                                    Chọn ảnh khác
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={handleShippingTrackingFileChange}
                                    />
                                  </label>
                                  <button
                                    onClick={() => {
                                      setShippingTrackingFile(null);
                                      setShippingTrackingPreview(null);
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                                  >
                                    <FaTimes className="inline mr-2" />
                                    Xóa
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <label className="cursor-pointer">
                                <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto mb-3" />
                                <p className="text-sm font-medium text-gray-700 mb-1">
                                  Chọn ảnh vận đơn
                                </p>
                                <p className="text-xs text-gray-500">JPG, PNG tối đa 5MB</p>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleShippingTrackingFileChange}
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* View mode - Show shipping tracking info */
                      <div className="space-y-3">
                        {order.shipping_tracking_code && (
                          <p className="text-sm text-gray-700">
                            <strong>Mã vận đơn:</strong> {order.shipping_tracking_code}
                          </p>
                        )}
                        {order.shipping_company && (
                          <p className="text-sm text-gray-700">
                            <strong>Đơn vị:</strong> {order.shipping_company}
                          </p>
                        )}
                        {order.shipping_tracking_url && (
                          <img
                            src={order.shipping_tracking_url}
                            alt="Shipping Tracking"
                            className="max-w-full max-h-64 rounded-lg shadow-sm"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  {!isCompleted && isSeller && order.payment_receipt_url && (
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition font-medium"
                      disabled={loading}
                    >
                      Quay lại
                    </button>
                  )}
                  {!isCompleted && isSeller && (
                    <button
                      onClick={handleSubmitShippingTracking}
                      disabled={loading || !shippingTrackingCode.trim()}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Xác nhận
                    </button>
                  )}
                  {(isCompleted || isBuyer) && (
                    <button
                      onClick={onClose}
                      className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition font-medium"
                    >
                      Đóng
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderCompletionWizard;