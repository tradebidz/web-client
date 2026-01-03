import { Link } from 'react-router-dom';
import { FaExclamationCircle, FaHome } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 py-16 px-4">
      <div className="bg-gray-100 p-6 rounded-full">
        <FaExclamationCircle className="text-6xl text-gray-400" />
      </div>

      <div className="space-y-2">
        <h2 className="text-6xl font-black text-gray-800">404</h2>
        <h3 className="text-2xl font-bold text-text-main">Trang không tồn tại</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Đường dẫn bạn đang truy cập có thể đã bị xóa hoặc không còn tồn tại trên hệ thống.
        </p>
      </div>

      <Link
        to="/"
        className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all active:scale-95"
      >
        <FaHome /> Quay về trang chủ
      </Link>
    </div>
  );
};

export default NotFound;

