import { Link } from 'react-router-dom';
import { FaShieldAlt, FaHome } from 'react-icons/fa';

const Forbidden = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 py-16 px-4">
      <div className="bg-red-50 p-6 rounded-full">
        <FaShieldAlt className="text-6xl text-red-500" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-6xl font-black text-red-500">403</h2>
        <h3 className="text-2xl font-bold text-text-main">Truy cập bị từ chối</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Bạn không có quyền hạn để truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là một lỗi.
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

export default Forbidden;

