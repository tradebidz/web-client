import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

/**
 * Reusable Confirm Modal Component
 * @param {boolean} isOpen - Whether the modal is open
 * @param {string} title - Modal title
 * @param {string} message - Confirmation message
 * @param {string} confirmText - Text for confirm button (default: "Confirm")
 * @param {string} cancelText - Text for cancel button (default: "Cancel")
 * @param {string} variant - Modal variant: "danger" | "warning" | "info" (default: "info")
 * @param {function} onConfirm - Callback when confirmed
 * @param {function} onCancel - Callback when cancelled
 */
const ConfirmModal = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "info",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: <FaExclamationTriangle className="text-red-500" />,
      confirmButton: "bg-red-500 hover:bg-red-600 text-white",
      iconBg: "bg-red-100",
    },
    warning: {
      icon: <FaExclamationTriangle className="text-orange-500" />,
      confirmButton: "bg-orange-500 hover:bg-orange-600 text-white",
      iconBg: "bg-orange-100",
    },
    info: {
      icon: <FaExclamationTriangle className="text-blue-500" />,
      confirmButton: "bg-primary hover:bg-primary-dark text-white",
      iconBg: "bg-blue-100",
    },
  };

  const styles = variantStyles[variant] || variantStyles.info;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel?.();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-bg/50 backdrop-blur-sm flex items-center justify-center z-50 fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl fade-in">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${styles.iconBg}`}>
              {styles.icon}
            </div>
            <h3 className="text-xl font-bold text-text-main">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Message */}
        <div className="mb-6">
          <p className="text-text-light leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${styles.confirmButton}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

