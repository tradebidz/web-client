import { FaCheckCircle, FaInfoCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

/**
 * Reusable Alert Modal Component (for informational messages)
 * @param {boolean} isOpen - Whether the modal is open
 * @param {string} title - Modal title
 * @param {string} message - Alert message
 * @param {string} buttonText - Text for button (default: "OK")
 * @param {string} variant - Modal variant: "success" | "info" | "warning" | "error" (default: "info")
 * @param {function} onClose - Callback when closed
 */
const AlertModal = ({
  isOpen,
  title = "Information",
  message = "",
  buttonText = "OK",
  variant = "info",
  onClose,
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    success: {
      icon: <FaCheckCircle className="text-green-500" />,
      iconBg: "bg-green-100",
      button: "bg-green-500 hover:bg-green-600 text-white",
    },
    info: {
      icon: <FaInfoCircle className="text-blue-500" />,
      iconBg: "bg-blue-100",
      button: "bg-primary hover:bg-primary-dark text-white",
    },
    warning: {
      icon: <FaExclamationCircle className="text-orange-500" />,
      iconBg: "bg-orange-100",
      button: "bg-orange-500 hover:bg-orange-600 text-white",
    },
    error: {
      icon: <FaExclamationCircle className="text-red-500" />,
      iconBg: "bg-red-100",
      button: "bg-red-500 hover:bg-red-600 text-white",
    },
  };

  const styles = variantStyles[variant] || variantStyles.info;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
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
            onClick={onClose}
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

        {/* Action */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${styles.button}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;

