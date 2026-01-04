import { FaSpinner } from 'react-icons/fa';

const LoadingModal = ({ isOpen, text = "Đang tải..." }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg/50 backdrop-blur-sm transition-opacity">
      <div className="bg-bg px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center animate-bounce-slight">
        {/* Spinner Animation */}
        <FaSpinner className="text-4xl text-primary animate-spin mb-4" />
        
        <p className="text-text-main font-semibold text-sm animate-pulse">
          {text}
        </p>
      </div>
    </div>
  );
};

export default LoadingModal;